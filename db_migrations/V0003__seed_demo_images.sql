INSERT INTO images (user_id, prompt, provider_id, model_id, style_id, image_url, ratio, is_favorite, is_public, likes, status, credits_used) VALUES
(1, 'Киборг-девушка с неоновыми схемами на лице',
  (SELECT id FROM providers WHERE slug='caila'), (SELECT id FROM models WHERE slug='flux-pro'), (SELECT id FROM styles WHERE slug='cyberpunk'),
  'https://cdn.poehali.dev/projects/2a050ee6-8059-4f8e-bcd7-94ce7cd91055/files/24fc8279-f682-410d-909d-b1fdbf9f0cf8.jpg', '1:1', TRUE, TRUE, 342, 'success', 6),
(1, 'Неоновый мегаполис будущего под дождём',
  (SELECT id FROM providers WHERE slug='chutes'), (SELECT id FROM models WHERE slug='flux-dev'), (SELECT id FROM styles WHERE slug='cyberpunk'),
  'https://cdn.poehali.dev/projects/2a050ee6-8059-4f8e-bcd7-94ce7cd91055/files/ed8b0bd5-4cef-43df-9a98-55d0107ca543.jpg', '16:9', TRUE, TRUE, 218, 'success', 5),
(1, 'Абстрактные неоновые геометрические паттерны',
  (SELECT id FROM providers WHERE slug='cerebras'), (SELECT id FROM models WHERE slug='sd-3.5-large'), (SELECT id FROM styles WHERE slug='neon'),
  'https://cdn.poehali.dev/projects/2a050ee6-8059-4f8e-bcd7-94ce7cd91055/files/f3695ba3-9339-4597-a83a-d528b255f318.jpg', '1:1', FALSE, TRUE, 156, 'success', 5),
(1, 'Летающие авто над голографическими билбордами',
  (SELECT id FROM providers WHERE slug='nebius'), (SELECT id FROM models WHERE slug='sdxl-lightning'), (SELECT id FROM styles WHERE slug='cyberpunk'),
  'https://cdn.poehali.dev/projects/2a050ee6-8059-4f8e-bcd7-94ce7cd91055/files/ed8b0bd5-4cef-43df-9a98-55d0107ca543.jpg', '16:9', FALSE, TRUE, 97, 'success', 3),
(1, 'Портрет хакера в дополненной реальности',
  (SELECT id FROM providers WHERE slug='caila'), (SELECT id FROM models WHERE slug='kandinsky-3.1'), (SELECT id FROM styles WHERE slug='realism'),
  'https://cdn.poehali.dev/projects/2a050ee6-8059-4f8e-bcd7-94ce7cd91055/files/24fc8279-f682-410d-909d-b1fdbf9f0cf8.jpg', '1:1', TRUE, TRUE, 285, 'success', 4),
(1, 'Цифровая нейросеть, потоки данных',
  (SELECT id FROM providers WHERE slug='chutes'), (SELECT id FROM models WHERE slug='playground-2.5'), (SELECT id FROM styles WHERE slug='3d'),
  'https://cdn.poehali.dev/projects/2a050ee6-8059-4f8e-bcd7-94ce7cd91055/files/f3695ba3-9339-4597-a83a-d528b255f318.jpg', '1:1', FALSE, TRUE, 64, 'success', 4);

INSERT INTO generation_history (user_id, image_id, gen_code, prompt, provider_name, status, credits) VALUES
(1, 1, 'GEN-9F2A', 'Киборг-девушка с неоновыми схемами', 'Caila', 'success', 6),
(1, 2, 'GEN-7B3C', 'Неоновый мегаполис под дождём', 'Chutes', 'success', 5),
(1, 3, 'GEN-1D8E', 'Абстрактные геометрические паттерны', 'Cerebras', 'success', 5),
(1, 4, 'GEN-4A5F', 'Летающие авто над городом', 'Nebius', 'success', 3),
(1, NULL, 'GEN-2C9B', 'Портрет в стиле вапорвейв', 'Caila', 'failed', 0);
