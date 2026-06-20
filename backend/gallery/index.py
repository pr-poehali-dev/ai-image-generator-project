import json
import os
import psycopg2
import psycopg2.extras

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
}


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def json_default(o):
    if hasattr(o, 'isoformat'):
        return o.isoformat()
    return str(o)


def fetch_images(cur, where='', params=None):
    cur.execute(
        "SELECT i.id, i.prompt, i.image_url, i.ratio, i.steps, i.guidance, i.seed, "
        "i.is_favorite, i.is_public, i.likes, i.status, i.credits_used, i.created_at, "
        "p.name AS provider, m.name AS model, COALESCE(s.name,'—') AS style, COALESCE(s.emoji,'') AS emoji "
        "FROM images i "
        "LEFT JOIN providers p ON p.id = i.provider_id "
        "LEFT JOIN models m ON m.id = i.model_id "
        "LEFT JOIN styles s ON s.id = i.style_id "
        + where + " ORDER BY i.created_at DESC LIMIT 60",
        params or (),
    )
    return [dict(r) for r in cur.fetchall()]


def handler(event: dict, context) -> dict:
    '''API галереи: список изображений, избранное, история, справочники (провайдеры/модели/стили), статистика дашборда и лайки'''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    resource = params.get('resource', 'gallery')
    user_id = int(event.get('headers', {}).get('X-User-Id') or params.get('user_id') or 1)

    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    result = {}

    try:
        if method == 'GET':
            if resource == 'gallery':
                result = {'images': fetch_images(cur, "WHERE i.is_public = TRUE")}
            elif resource == 'favorites':
                result = {'images': fetch_images(cur, "WHERE i.is_favorite = TRUE AND i.user_id = %s", (user_id,))}
            elif resource == 'history':
                cur.execute(
                    "SELECT gen_code, prompt, provider_name, status, credits, "
                    "to_char(created_at, 'HH24:MI') AS time, created_at "
                    "FROM generation_history WHERE user_id = %s ORDER BY created_at DESC LIMIT 50",
                    (user_id,),
                )
                result = {'history': [dict(r) for r in cur.fetchall()]}
            elif resource == 'providers':
                cur.execute("SELECT id, slug, name, status, latency FROM providers ORDER BY id")
                provs = [dict(r) for r in cur.fetchall()]
                cur.execute("SELECT id, provider_id, slug, name, credits_cost FROM models WHERE is_active = TRUE ORDER BY id")
                models = [dict(r) for r in cur.fetchall()]
                for p in provs:
                    p['models'] = [m for m in models if m['provider_id'] == p['id']]
                result = {'providers': provs}
            elif resource == 'styles':
                cur.execute("SELECT id, slug, name, emoji FROM styles ORDER BY id")
                result = {'styles': [dict(r) for r in cur.fetchall()]}
            elif resource == 'stats':
                cur.execute("SELECT credits, username, email, plan FROM users WHERE id = %s", (user_id,))
                user = dict(cur.fetchone() or {})
                cur.execute("SELECT COUNT(*) c FROM images WHERE user_id = %s", (user_id,))
                total = cur.fetchone()['c']
                cur.execute("SELECT COUNT(*) c FROM images WHERE user_id = %s AND is_favorite = TRUE", (user_id,))
                favs = cur.fetchone()['c']
                cur.execute("SELECT COUNT(*) c FROM images WHERE user_id = %s AND created_at::date = CURRENT_DATE", (user_id,))
                today = cur.fetchone()['c']
                cur.execute("SELECT COALESCE(SUM(credits),0) c FROM generation_history WHERE user_id = %s AND created_at >= date_trunc('month', CURRENT_DATE)", (user_id,))
                month_credits = cur.fetchone()['c']
                cur.execute("SELECT id, slug, name, status, latency FROM providers ORDER BY id")
                provs = [dict(r) for r in cur.fetchall()]
                cur.execute("SELECT provider_id, COUNT(*) c FROM models GROUP BY provider_id")
                mcounts = {r['provider_id']: r['c'] for r in cur.fetchall()}
                for p in provs:
                    p['model_count'] = mcounts.get(p['id'], 0)
                result = {
                    'user': user,
                    'total_images': total,
                    'favorites': favs,
                    'today': today,
                    'month_credits': month_credits,
                    'providers': provs,
                }

        elif method == 'POST':
            body = json.loads(event.get('body') or '{}')
            action = body.get('action')
            image_id = body.get('image_id')
            if action == 'toggle_favorite' and image_id:
                cur.execute("UPDATE images SET is_favorite = NOT is_favorite WHERE id = %s RETURNING is_favorite", (image_id,))
                row = cur.fetchone()
                conn.commit()
                result = {'is_favorite': row['is_favorite'] if row else False}
            elif action == 'like' and image_id:
                cur.execute("UPDATE images SET likes = likes + 1 WHERE id = %s RETURNING likes", (image_id,))
                row = cur.fetchone()
                conn.commit()
                result = {'likes': row['likes'] if row else 0}
            else:
                cur.close(); conn.close()
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'unknown action'})}

        elif method == 'DELETE':
            body = json.loads(event.get('body') or '{}')
            image_id = body.get('image_id')
            if image_id:
                cur.execute("UPDATE images SET is_public = FALSE WHERE id = %s AND user_id = %s", (image_id, user_id))
                conn.commit()
                result = {'deleted': True}
    finally:
        cur.close()
        conn.close()

    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps(result, default=json_default)}
