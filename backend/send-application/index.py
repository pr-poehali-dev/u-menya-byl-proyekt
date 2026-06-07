import json
import os
import urllib.request
import psycopg2


def handler(event: dict, context) -> dict:
    """Принимает заявку с сайта студии Оазис и отправляет в Telegram владельцу."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    raw_body = event.get('body') or '{}'
    body = json.loads(raw_body)
    name = body.get('name', '').strip()
    max_link = body.get('max', '').strip()
    telegram = body.get('telegram', '').strip()
    message = body.get('message', '').strip()
    file_urls = body.get('file_urls', [])

    if not name or not message or (not max_link and not telegram):
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Заполни все поля'})
        }

    token = os.environ['TELEGRAM_BOT_TOKEN']
    chat_id = '6391432309'

    contacts = []
    if max_link:
        contacts.append(f"📱 Макс: {max_link}")
    if telegram:
        contacts.append(f"✈️ Telegram: {telegram}")

    files_section = ""
    if file_urls:
        links = "\n".join(f"• {url}" for url in file_urls)
        files_section = f"\n📎 Примеры работ:\n{links}"

    text = (
        f"🌴 Новая заявка в команду Оазис\n\n"
        f"👤 Имя: {name}\n"
        + "\n".join(contacts) +
        f"\n🎨 Навыки:\n{message}"
        + files_section
    )

    payload = json.dumps({
        'chat_id': chat_id,
        'text': text,
    }).encode()

    req = urllib.request.Request(
        f'https://api.telegram.org/bot{token}/sendMessage',
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        resp.read()

    contact = telegram or max_link
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO applications (name, contact, message, has_files) VALUES (%s, %s, %s, %s)",
        (name, contact, message, bool(file_urls))
    )
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }