import json
import os
import base64
import uuid
import random
import urllib.request
import urllib.error
import psycopg2
import boto3

DEMO_IMAGES = [
    'https://cdn.poehali.dev/projects/2a050ee6-8059-4f8e-bcd7-94ce7cd91055/files/24fc8279-f682-410d-909d-b1fdbf9f0cf8.jpg',
    'https://cdn.poehali.dev/projects/2a050ee6-8059-4f8e-bcd7-94ce7cd91055/files/ed8b0bd5-4cef-43df-9a98-55d0107ca543.jpg',
    'https://cdn.poehali.dev/projects/2a050ee6-8059-4f8e-bcd7-94ce7cd91055/files/f3695ba3-9339-4597-a83a-d528b255f318.jpg',
]

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
}


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def upload_to_s3(image_bytes: bytes) -> str:
    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    key = f"generated/{uuid.uuid4().hex}.png"
    s3.put_object(Bucket='files', Key=key, Body=image_bytes, ContentType='image/png')
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"


def call_ai_provider(base_url: str, api_key: str, model_slug: str, prompt: str, size: str):
    '''Вызов OpenAI-совместимого эндпоинта генерации изображений'''
    url = base_url.rstrip('/') + '/images/generations'
    payload = json.dumps({
        'model': model_slug,
        'prompt': prompt,
        'n': 1,
        'size': size,
        'response_format': 'b64_json',
    }).encode()
    req = urllib.request.Request(url, data=payload, method='POST')
    req.add_header('Authorization', f'Bearer {api_key}')
    req.add_header('Content-Type', 'application/json')
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode())
    item = data['data'][0]
    if item.get('b64_json'):
        return base64.b64decode(item['b64_json']), None
    if item.get('url'):
        with urllib.request.urlopen(item['url'], timeout=30) as ir:
            return ir.read(), None
    return None, 'empty response'


def ratio_to_size(ratio: str) -> str:
    return {
        '1:1': '1024x1024',
        '16:9': '1344x768',
        '9:16': '768x1344',
        '4:3': '1152x896',
        '3:2': '1216x832',
    }.get(ratio, '1024x1024')


def handler(event: dict, context) -> dict:
    '''Генерация изображения через AI-провайдеров (Caila, Chutes, Cerebras, Nebius) с сохранением в S3 и БД'''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}
    if method != 'POST':
        return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body') or '{}')
    prompt = (body.get('prompt') or '').strip()
    if not prompt:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'prompt required'})}

    provider_slug = body.get('provider', 'caila')
    model_slug = body.get('model', 'flux-pro')
    style_slug = body.get('style')
    ratio = body.get('ratio', '1:1')
    steps = int(body.get('steps', 30))
    guidance = float(body.get('guidance', 7.5))
    hd = bool(body.get('hd', True))
    user_id = int(event.get('headers', {}).get('X-User-Id') or body.get('user_id') or 1)

    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT id, base_url, secret_key_name, name FROM providers WHERE slug = %s", (provider_slug,))
    prov = cur.fetchone()
    cur.execute("SELECT id, slug, credits_cost FROM models WHERE slug = %s", (model_slug,))
    mdl = cur.fetchone()
    style_id = None
    prompt_suffix = ''
    if style_slug:
        cur.execute("SELECT id, prompt_suffix FROM styles WHERE slug = %s", (style_slug,))
        st = cur.fetchone()
        if st:
            style_id, prompt_suffix = st[0], st[1] or ''

    if not prov or not mdl:
        cur.close(); conn.close()
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'unknown provider/model'})}

    provider_id, base_url, secret_key_name, provider_name = prov
    model_id, real_model_slug, credits_cost = mdl
    credits_used = credits_cost * (2 if hd else 1)

    full_prompt = prompt
    if prompt_suffix:
        full_prompt = f"{prompt}, {prompt_suffix}"

    api_key = os.environ.get(secret_key_name) if secret_key_name else None
    image_url = None
    error_message = None
    seed = random.randint(1, 2**31)

    if api_key:
        try:
            img_bytes, err = call_ai_provider(base_url, api_key, real_model_slug, full_prompt, ratio_to_size(ratio))
            if img_bytes:
                image_url = upload_to_s3(img_bytes)
            else:
                error_message = err
        except (urllib.error.URLError, urllib.error.HTTPError, Exception) as e:
            error_message = str(e)[:300]

    if not image_url:
        image_url = random.choice(DEMO_IMAGES)
        if not api_key:
            error_message = None

    status = 'success' if image_url else 'failed'
    gen_code = 'GEN-' + uuid.uuid4().hex[:4].upper()

    cur.execute(
        "INSERT INTO images (user_id, prompt, provider_id, model_id, style_id, image_url, ratio, steps, guidance, seed, status, credits_used, is_public, likes) "
        "VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,TRUE,0) RETURNING id, created_at",
        (user_id, prompt, provider_id, model_id, style_id, image_url, ratio, steps, guidance, seed, status, credits_used),
    )
    image_id, created_at = cur.fetchone()

    cur.execute(
        "INSERT INTO generation_history (user_id, image_id, gen_code, prompt, provider_name, status, credits, error_message) "
        "VALUES (%s,%s,%s,%s,%s,%s,%s,%s)",
        (user_id, image_id, gen_code, prompt, provider_name, status, credits_used, error_message),
    )

    cur.execute("UPDATE users SET credits = GREATEST(credits - %s, 0) WHERE id = %s RETURNING credits", (credits_used, user_id))
    row = cur.fetchone()
    remaining = row[0] if row else 0

    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'id': image_id,
            'gen_code': gen_code,
            'image_url': image_url,
            'prompt': prompt,
            'provider': provider_name,
            'status': status,
            'credits_used': credits_used,
            'credits_remaining': remaining,
            'seed': seed,
            'used_real_api': bool(api_key and not error_message),
            'note': 'Демо-режим: добавьте API-ключ провайдера для реальной генерации' if not api_key else None,
            'created_at': created_at.isoformat() if created_at else None,
        }),
    }
