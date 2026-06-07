import json
import os
import psycopg2
import psycopg2.extras


ADMIN_PASSWORD = "ParovozikDirDirDir"


def handler(event: dict, context) -> dict:
    """Возвращает статистику сайта для админ-панели."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    raw_body = event.get('body') or '{}'
    body = json.loads(raw_body)
    password = body.get('password', '')

    if password != ADMIN_PASSWORD:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный пароль'})
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute("SELECT COUNT(*) AS total FROM visits")
    total_visits = cur.fetchone()['total']

    cur.execute("""
        SELECT COUNT(DISTINCT ip) AS unique_visitors
        FROM visits
        WHERE ip IS NOT NULL
    """)
    unique_visitors = cur.fetchone()['unique_visitors']

    cur.execute("""
        SELECT DATE(visited_at AT TIME ZONE 'Europe/Moscow') AS day,
               COUNT(*) AS count
        FROM visits
        WHERE visited_at >= NOW() - INTERVAL '30 days'
        GROUP BY day
        ORDER BY day
    """)
    visits_by_day = [{"day": str(r['day']), "count": r['count']} for r in cur.fetchall()]

    cur.execute("""
        SELECT COUNT(*) AS today
        FROM visits
        WHERE DATE(visited_at AT TIME ZONE 'Europe/Moscow') = CURRENT_DATE
    """)
    today_visits = cur.fetchone()['today']

    cur.execute("""
        SELECT COUNT(*) AS week
        FROM visits
        WHERE visited_at >= NOW() - INTERVAL '7 days'
    """)
    week_visits = cur.fetchone()['week']

    cur.execute("SELECT COUNT(*) AS total FROM applications")
    total_apps = cur.fetchone()['total']

    cur.execute("""
        SELECT COUNT(*) AS today_apps
        FROM applications
        WHERE DATE(submitted_at AT TIME ZONE 'Europe/Moscow') = CURRENT_DATE
    """)
    today_apps = cur.fetchone()['today_apps']

    cur.execute("""
        SELECT DATE(submitted_at AT TIME ZONE 'Europe/Moscow') AS day,
               COUNT(*) AS count
        FROM applications
        WHERE submitted_at >= NOW() - INTERVAL '30 days'
        GROUP BY day
        ORDER BY day
    """)
    apps_by_day = [{"day": str(r['day']), "count": r['count']} for r in cur.fetchall()]

    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'visits': {
                'total': total_visits,
                'unique': unique_visitors,
                'today': today_visits,
                'week': week_visits,
                'by_day': visits_by_day,
            },
            'applications': {
                'total': total_apps,
                'today': today_apps,
                'by_day': apps_by_day,
            }
        })
    }
