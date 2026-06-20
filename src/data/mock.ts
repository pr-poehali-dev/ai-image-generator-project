export const HERO_IMG = 'https://cdn.poehali.dev/projects/2a050ee6-8059-4f8e-bcd7-94ce7cd91055/files/24fc8279-f682-410d-909d-b1fdbf9f0cf8.jpg';
export const CITY_IMG = 'https://cdn.poehali.dev/projects/2a050ee6-8059-4f8e-bcd7-94ce7cd91055/files/ed8b0bd5-4cef-43df-9a98-55d0107ca543.jpg';
export const ABSTRACT_IMG = 'https://cdn.poehali.dev/projects/2a050ee6-8059-4f8e-bcd7-94ce7cd91055/files/f3695ba3-9339-4597-a83a-d528b255f318.jpg';

export interface Provider {
  id: string;
  name: string;
  status: 'online' | 'beta' | 'offline';
  latency: string;
  models: string[];
}

export const PROVIDERS: Provider[] = [
  { id: 'caila', name: 'Caila', status: 'online', latency: '0.8s', models: ['FLUX.1 Pro', 'SDXL Turbo', 'Kandinsky 3.1'] },
  { id: 'chutes', name: 'Chutes', status: 'online', latency: '1.2s', models: ['FLUX.1 Dev', 'Playground v2.5'] },
  { id: 'cerebras', name: 'Cerebras', status: 'beta', latency: '0.4s', models: ['SD 3.5 Large', 'Pixart Σ'] },
  { id: 'nebius', name: 'Nebius', status: 'online', latency: '1.0s', models: ['FLUX.1 Schnell', 'SDXL Lightning'] },
];

export const STYLES = [
  { id: 'cyberpunk', name: 'Киберпанк', emoji: '🌃' },
  { id: 'anime', name: 'Аниме', emoji: '🎴' },
  { id: 'realism', name: 'Реализм', emoji: '📷' },
  { id: 'neon', name: 'Неон', emoji: '💜' },
  { id: '3d', name: '3D Render', emoji: '🧊' },
  { id: 'pixel', name: 'Пиксель-арт', emoji: '👾' },
];

export const RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:2'];

export interface GalleryItem {
  id: number;
  img: string;
  prompt: string;
  provider: string;
  model: string;
  style: string;
  date: string;
  likes: number;
  favorite: boolean;
}

export const GALLERY: GalleryItem[] = [
  { id: 1, img: HERO_IMG, prompt: 'Киборг-девушка с неоновыми схемами на лице', provider: 'Caila', model: 'FLUX.1 Pro', style: 'Киберпанк', date: '2026-06-20', likes: 342, favorite: true },
  { id: 2, img: CITY_IMG, prompt: 'Неоновый мегаполис будущего под дождём', provider: 'Chutes', model: 'FLUX.1 Dev', style: 'Киберпанк', date: '2026-06-19', likes: 218, favorite: true },
  { id: 3, img: ABSTRACT_IMG, prompt: 'Абстрактные неоновые геометрические паттерны', provider: 'Cerebras', model: 'SD 3.5 Large', style: 'Неон', date: '2026-06-18', likes: 156, favorite: false },
  { id: 4, img: CITY_IMG, prompt: 'Летающие авто над голографическими билбордами', provider: 'Nebius', model: 'SDXL Lightning', style: 'Киберпанк', date: '2026-06-17', likes: 97, favorite: false },
  { id: 5, img: HERO_IMG, prompt: 'Портрет хакера в дополненной реальности', provider: 'Caila', model: 'Kandinsky 3.1', style: 'Реализм', date: '2026-06-16', likes: 285, favorite: true },
  { id: 6, img: ABSTRACT_IMG, prompt: 'Цифровая нейросеть, потоки данных', provider: 'Chutes', model: 'Playground v2.5', style: '3D Render', date: '2026-06-15', likes: 64, favorite: false },
];

export interface HistoryRow {
  id: string;
  prompt: string;
  provider: string;
  status: 'success' | 'processing' | 'failed';
  credits: number;
  time: string;
}

export const HISTORY: HistoryRow[] = [
  { id: 'GEN-9F2A', prompt: 'Киборг-девушка с неоновыми схемами', provider: 'Caila', status: 'success', credits: 4, time: '12:42' },
  { id: 'GEN-7B3C', prompt: 'Неоновый мегаполис под дождём', provider: 'Chutes', status: 'success', credits: 6, time: '12:38' },
  { id: 'GEN-1D8E', prompt: 'Абстрактные геометрические паттерны', provider: 'Cerebras', status: 'processing', credits: 3, time: '12:35' },
  { id: 'GEN-4A5F', prompt: 'Летающие авто над городом', provider: 'Nebius', status: 'success', credits: 5, time: '12:30' },
  { id: 'GEN-2C9B', prompt: 'Портрет в стиле вапорвейв', provider: 'Caila', status: 'failed', credits: 0, time: '12:22' },
];
