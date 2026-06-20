CREATE TABLE IF NOT EXISTS providers (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    base_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'online',
    latency VARCHAR(20) DEFAULT '1.0s',
    secret_key_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS models (
    id SERIAL PRIMARY KEY,
    provider_id INTEGER REFERENCES providers(id),
    slug VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    credits_cost INTEGER DEFAULT 4,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS styles (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    emoji VARCHAR(10),
    prompt_suffix TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL DEFAULT 'guest',
    email VARCHAR(150),
    credits INTEGER DEFAULT 240,
    plan VARCHAR(30) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    prompt TEXT NOT NULL,
    negative_prompt TEXT,
    provider_id INTEGER REFERENCES providers(id),
    model_id INTEGER REFERENCES models(id),
    style_id INTEGER REFERENCES styles(id),
    image_url TEXT,
    ratio VARCHAR(10) DEFAULT '1:1',
    steps INTEGER DEFAULT 30,
    guidance NUMERIC(4,1) DEFAULT 7.5,
    seed BIGINT,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    likes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'success',
    credits_used INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS generation_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    image_id INTEGER REFERENCES images(id),
    gen_code VARCHAR(20),
    prompt TEXT,
    provider_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'success',
    credits INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_images_user ON images(user_id);
CREATE INDEX IF NOT EXISTS idx_images_fav ON images(is_favorite);
CREATE INDEX IF NOT EXISTS idx_images_created ON images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_history_user ON generation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_models_provider ON models(provider_id);
