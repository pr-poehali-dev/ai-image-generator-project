const GALLERY_URL = 'https://functions.poehali.dev/bba29c8d-a51e-443c-9662-06bf2360b565';
const GENERATE_URL = 'https://functions.poehali.dev/3cf33146-1449-4da9-9816-bc554a653a6c';

const USER_ID = '1';

export interface ApiImage {
  id: number;
  prompt: string;
  image_url: string;
  ratio: string;
  steps: number;
  guidance: string;
  seed: number | null;
  is_favorite: boolean;
  is_public: boolean;
  likes: number;
  status: string;
  credits_used: number;
  created_at: string;
  provider: string;
  model: string;
  style: string;
  emoji: string;
}

export interface ApiModel {
  id: number;
  provider_id: number;
  slug: string;
  name: string;
  credits_cost: number;
}

export interface ApiProvider {
  id: number;
  slug: string;
  name: string;
  status: string;
  latency: string;
  models?: ApiModel[];
  model_count?: number;
}

export interface ApiStyle {
  id: number;
  slug: string;
  name: string;
  emoji: string;
}

export interface ApiHistory {
  gen_code: string;
  prompt: string;
  provider_name: string;
  status: string;
  credits: number;
  time: string;
  created_at: string;
}

export interface ApiStats {
  user: { credits: number; username: string; email: string; plan: string };
  total_images: number;
  favorites: number;
  today: number;
  month_credits: number;
  providers: ApiProvider[];
}

export interface GenerateParams {
  prompt: string;
  provider: string;
  model: string;
  style?: string;
  ratio: string;
  steps: number;
  guidance: number;
  hd: boolean;
}

export interface GenerateResult {
  id: number;
  gen_code: string;
  image_url: string;
  prompt: string;
  provider: string;
  status: string;
  credits_used: number;
  credits_remaining: number;
  seed: number;
  used_real_api: boolean;
  note: string | null;
  created_at: string;
}

const headers = { 'Content-Type': 'application/json', 'X-User-Id': USER_ID };

async function getJson<T>(resource: string): Promise<T> {
  const res = await fetch(`${GALLERY_URL}?resource=${resource}&user_id=${USER_ID}`, { headers });
  if (!res.ok) throw new Error(`API ${resource} failed`);
  return res.json();
}

export const api = {
  gallery: () => getJson<{ images: ApiImage[] }>('gallery'),
  favorites: () => getJson<{ images: ApiImage[] }>('favorites'),
  history: () => getJson<{ history: ApiHistory[] }>('history'),
  providers: () => getJson<{ providers: ApiProvider[] }>('providers'),
  styles: () => getJson<{ styles: ApiStyle[] }>('styles'),
  stats: () => getJson<ApiStats>('stats'),

  generate: async (params: GenerateParams): Promise<GenerateResult> => {
    const res = await fetch(GENERATE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Ошибка генерации');
    }
    return res.json();
  },

  toggleFavorite: async (image_id: number): Promise<{ is_favorite: boolean }> => {
    const res = await fetch(GALLERY_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'toggle_favorite', image_id }),
    });
    return res.json();
  },

  like: async (image_id: number): Promise<{ likes: number }> => {
    const res = await fetch(GALLERY_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'like', image_id }),
    });
    return res.json();
  },

  remove: async (image_id: number): Promise<{ deleted: boolean }> => {
    const res = await fetch(GALLERY_URL, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ image_id }),
    });
    return res.json();
  },
};
