import json
import os
import base64
import uuid
import boto3


ALLOWED_TYPES = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
}

MAX_SIZE_MB = 20


def handler(event: dict, context) -> dict:
    """Загружает файл (пример работы) в S3 и возвращает публичный URL."""

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
    file_data = body.get('file', '')
    content_type = body.get('content_type', '')

    if not file_data or not content_type:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Не передан файл или тип'})
        }

    if content_type not in ALLOWED_TYPES:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Недопустимый тип файла'})
        }

    raw = base64.b64decode(file_data)

    if len(raw) > MAX_SIZE_MB * 1024 * 1024:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Файл слишком большой (макс. {MAX_SIZE_MB} МБ)'})
        }

    ext = ALLOWED_TYPES[content_type]
    key = f'oasis-applications/{uuid.uuid4()}.{ext}'

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )

    s3.put_object(
        Bucket='files',
        Key=key,
        Body=raw,
        ContentType=content_type
    )

    project_id = os.environ['AWS_ACCESS_KEY_ID']
    url = f"https://cdn.poehali.dev/projects/{project_id}/bucket/{key}"

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'url': url})
    }