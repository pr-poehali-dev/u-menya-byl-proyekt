import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Принимает заявку с сайта студии Оазис и отправляет на email владельца."""

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

    body = json.loads(event.get('body', '{}'))
    name = body.get('name', '').strip()
    contact = body.get('contact', '').strip()
    message = body.get('message', '').strip()

    if not name or not contact or not message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Заполни все поля'})
        }

    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    to_email = 'dasak5009@gmail.com'
    from_email = 'dasak5009@gmail.com'

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка в команду Оазис — {name}'
    msg['From'] = from_email
    msg['To'] = to_email

    html = f"""
    <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; background: #f5f0e8; border-radius: 16px; overflow: hidden;">
      <div style="background: #1a3028; padding: 24px 32px;">
        <h1 style="color: #fff; margin: 0; font-size: 22px;">🌴 Новая заявка в команду</h1>
        <p style="color: #7db89a; margin: 4px 0 0; font-size: 14px;">Студия Оазис</p>
      </div>
      <div style="padding: 28px 32px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd4c0; color: #888; font-size: 13px; width: 140px;">Имя / Ник</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd4c0; color: #1a3028; font-size: 15px; font-weight: 600;">{name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd4c0; color: #888; font-size: 13px;">Telegram / Макс</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd4c0; color: #1a3028; font-size: 15px; font-weight: 600;">{contact}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #888; font-size: 13px; vertical-align: top;">Навыки</td>
            <td style="padding: 10px 0; color: #1a3028; font-size: 15px; line-height: 1.6;">{message}</td>
          </tr>
        </table>
      </div>
      <div style="background: #e8e0d0; padding: 16px 32px; text-align: center;">
        <p style="color: #888; font-size: 12px; margin: 0;">Заявка с сайта oazis-studio.ru</p>
      </div>
    </div>
    """

    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(from_email, smtp_password)
        server.sendmail(from_email, to_email, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }
