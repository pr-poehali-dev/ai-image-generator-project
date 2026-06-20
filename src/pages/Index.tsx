import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/forge/Header';
import Generator from '@/components/forge/Generator';
import GalleryGrid from '@/components/forge/GalleryGrid';
import Dashboard from '@/components/forge/Dashboard';
import Providers from '@/components/forge/Providers';
import ImageViewer from '@/components/forge/ImageViewer';
import { useGallery, useFavorites, useToggleFavorite } from '@/hooks/useApi';
import type { ApiImage } from '@/lib/api';

const TABS = [
  { v: 'generate', i: 'Sparkles', t: 'Генератор' },
  { v: 'gallery', i: 'Images', t: 'Галерея' },
  { v: 'favorites', i: 'Heart', t: 'Избранное' },
  { v: 'providers', i: 'Network', t: 'Провайдеры' },
  { v: 'dashboard', i: 'LayoutDashboard', t: 'Дашборд' },
];

const Index = () => {
  const [tab, setTab] = useState('generate');
  const [viewer, setViewer] = useState<ApiImage | null>(null);

  const gallery = useGallery();
  const favorites = useFavorites();
  const toggleFav = useToggleFavorite();

  const galleryItems = gallery.data?.images ?? [];
  const favItems = favorites.data?.images ?? [];

  const onToggleFav = (id: number) => {
    toggleFav.mutate(id);
    setViewer((v) => (v && v.id === id ? { ...v, is_favorite: !v.is_favorite } : v));
  };

  return (
    <div className="min-h-screen grid-bg relative overflow-x-hidden">
      <Header />

      <main className="container max-w-7xl mx-auto px-4 pb-24">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="sticky top-[73px] z-30 -mx-4 px-4 py-3 glass border-b border-border mb-8">
            <TabsList className="bg-muted/40 border border-border p-1 h-auto flex-wrap gap-1">
              {TABS.map((x) => (
                <TabsTrigger
                  key={x.v}
                  value={x.v}
                  className="font-display text-xs uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.6)] gap-2"
                >
                  <Icon name={x.i} size={15} />
                  {x.t}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="generate" className="mt-0 animate-fade-in">
            <Generator />
          </TabsContent>

          <TabsContent value="gallery" className="mt-0 animate-fade-in">
            <SectionTitle title="Галерея" sub="Все созданные изображения сообщества" />
            <GalleryGrid
              items={galleryItems}
              loading={gallery.isLoading}
              onToggleFav={onToggleFav}
              onView={setViewer}
            />
          </TabsContent>

          <TabsContent value="favorites" className="mt-0 animate-fade-in">
            <SectionTitle title="Избранное" sub={`${favItems.length} сохранённых работ`} />
            {favorites.isLoading || favItems.length ? (
              <GalleryGrid
                items={favItems}
                loading={favorites.isLoading}
                onToggleFav={onToggleFav}
                onView={setViewer}
              />
            ) : (
              <Card className="glass border-border p-16 text-center">
                <Icon name="HeartOff" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground font-mono-tech">Список избранного пуст</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="providers" className="mt-0 animate-fade-in">
            <SectionTitle title="Провайдеры" sub="Подключённые AI-движки и их модели" />
            <Providers />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-0 animate-fade-in">
            <SectionTitle title="Дашборд" sub="Лимиты, история и активность" />
            <Dashboard />
          </TabsContent>
        </Tabs>
      </main>

      <ImageViewer
        item={viewer}
        open={!!viewer}
        onClose={() => setViewer(null)}
        onToggleFav={onToggleFav}
      />

      <footer className="border-t border-border glass py-8 text-center">
        <p className="font-display text-sm tracking-widest text-muted-foreground">
          NEURO<span className="neon-text-cyan">FORGE</span> // © 2026 — POWERED BY MULTI-AI ENGINE
        </p>
      </footer>
    </div>
  );
};

const SectionTitle = ({ title, sub }: { title: string; sub: string }) => (
  <div className="mb-8">
    <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wider">
      <span className="text-gradient-neon">{title}</span>
    </h2>
    <p className="text-muted-foreground font-mono-tech text-sm mt-1">{sub}</p>
  </div>
);

export default Index;
