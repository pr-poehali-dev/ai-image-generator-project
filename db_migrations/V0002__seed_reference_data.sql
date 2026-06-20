INSERT INTO users (id, username, email, credits, plan) VALUES (1, 'NEONXER', 'pro@neuroforge.ai', 240, 'pro')
ON CONFLICT (id) DO NOTHING;
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

INSERT INTO providers (slug, name, base_url, status, latency, secret_key_name) VALUES
('caila', 'Caila', 'https://caila.io/api/adapters/openai', 'online', '0.8s', 'CAILA_API_KEY'),
('chutes', 'Chutes', 'https://llm.chutes.ai/v1', 'online', '1.2s', 'CHUTES_API_KEY'),
('cerebras', 'Cerebras', 'https://api.cerebras.ai/v1', 'beta', '0.4s', 'CEREBRAS_API_KEY'),
('nebius', 'Nebius', 'https://api.studio.nebius.com/v1', 'online', '1.0s', 'NEBIUS_API_KEY')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO models (provider_id, slug, name, credits_cost) VALUES
((SELECT id FROM providers WHERE slug='caila'), 'flux-pro', 'FLUX.1 Pro', 6),
((SELECT id FROM providers WHERE slug='caila'), 'sdxl-turbo', 'SDXL Turbo', 3),
((SELECT id FROM providers WHERE slug='caila'), 'kandinsky-3.1', 'Kandinsky 3.1', 4),
((SELECT id FROM providers WHERE slug='chutes'), 'flux-dev', 'FLUX.1 Dev', 5),
((SELECT id FROM providers WHERE slug='chutes'), 'playground-2.5', 'Playground v2.5', 4),
((SELECT id FROM providers WHERE slug='cerebras'), 'sd-3.5-large', 'SD 3.5 Large', 5),
((SELECT id FROM providers WHERE slug='cerebras'), 'pixart-sigma', 'Pixart Sigma', 3),
((SELECT id FROM providers WHERE slug='nebius'), 'flux-schnell', 'FLUX.1 Schnell', 2),
((SELECT id FROM providers WHERE slug='nebius'), 'sdxl-lightning', 'SDXL Lightning', 3);

INSERT INTO styles (slug, name, emoji, prompt_suffix) VALUES
('cyberpunk', 'Киберпанк', '🌃', 'cyberpunk style, neon lights, futuristic, cinematic'),
('anime', 'Аниме', '🎴', 'anime style, vibrant colors, detailed'),
('realism', 'Реализм', '📷', 'photorealistic, 4k, highly detailed'),
('neon', 'Неон', '💜', 'neon glow, vibrant, dark background'),
('3d', '3D Render', '🧊', '3d render, octane, ultra detailed'),
('pixel', 'Пиксель-арт', '👾', 'pixel art, 8-bit, retro game style')
ON CONFLICT (slug) DO NOTHING;
