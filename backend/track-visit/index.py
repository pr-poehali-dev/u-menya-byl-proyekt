import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Записывает визит посетителя сайта в БД."""

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
    page = body.get('page', '/')[:255]
    referrer = body.get('referrer', '') or None
    user_agent = (event.get('headers') or {}).get('user-agent', '') or None
    ip = (event.get('requestContext') or {}).get('identity', {}).get('sourceIp') or None

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO visits (page, referrer, user_agent, ip) VALUES (%s, %s, %s, %s)",
        (page, referrer, user_agent, ip)
    )
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }
