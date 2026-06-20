import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { ApiImage } from '@/lib/api';

interface Props {
  item: ApiImage | null;
  open: boolean;
  onClose: () => void;
  onToggleFav: (id: number) => void;
}

const ImageViewer = ({ item, open, onClose, onToggleFav }: Props) => {
  if (!item) return null;

  const download = async () => {
    toast.loading('Загрузка изображения...', { id: 'dl' });
    try {
      const res = await fetch(item.image_url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `neuroforge-${item.id}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Изображение скачано!', { id: 'dl' });
    } catch {
      toast.error('Ошибка скачивания', { id: 'dl' });
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(item.prompt);
    toast.success('Промпт скопирован');
  };

  const meta = [
    { i: 'Server', l: 'Провайдер', v: item.provider },
    { i: 'Box', l: 'Модель', v: item.model },
    { i: 'Palette', l: 'Стиль', v: `${item.emoji} ${item.style}` },
    { i: 'Ratio', l: 'Формат', v: item.ratio },
    { i: 'Hash', l: 'Seed', v: item.seed ?? '—' },
    { i: 'Coins', l: 'Кредиты', v: item.credits_used },
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass border-border max-w-4xl p-0 overflow-hidden gap-0">
        <div className="grid md:grid-cols-[1.4fr_1fr]">
          <div className="relative bg-background aspect-square md:aspect-auto">
            <img src={item.image_url} alt={item.prompt} className="w-full h-full object-cover" />
            <Badge className="absolute top-4 left-4 bg-background/80 border border-primary/40 text-primary font-mono-tech">
              #{item.id} · NEUROFORGE
            </Badge>
          </div>

          <div className="p-6 flex flex-col">
            <h3 className="font-display text-lg uppercase tracking-wider mb-1 text-gradient-neon">
              Просмотр
            </h3>
            <p className="font-mono-tech text-sm text-foreground/90 mb-4 leading-relaxed">
              {item.prompt}
            </p>

            <Separator className="bg-border mb-4" />

            <div className="space-y-3 flex-1">
              {meta.map((m) => (
                <div key={m.l} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono-tech text-xs text-muted-foreground">
                    <Icon name={m.i} size={14} className="text-primary" fallback="Info" />
                    {m.l}
                  </span>
                  <span className="font-display text-xs">{m.v}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-mono-tech text-xs text-muted-foreground">
                  <Icon name="Heart" size={14} className="text-neon-magenta" />
                  Лайки
                </span>
                <span className="font-display text-xs text-neon-magenta">{item.likes}</span>
              </div>
            </div>

            <Separator className="bg-border my-4" />

            <div className="flex gap-2">
              <Button
                onClick={download}
                className="flex-1 font-display uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                <Icon name="Download" size={16} />
                Скачать
              </Button>
              <Button
                variant="outline"
                onClick={copyPrompt}
                className="border-border hover:border-primary hover:bg-primary/10"
                title="Копировать промпт"
              >
                <Icon name="Copy" size={16} />
              </Button>
              <Button
                variant="outline"
                onClick={() => onToggleFav(item.id)}
                className="border-border hover:border-neon-magenta hover:bg-neon-magenta/10"
              >
                <Icon
                  name="Heart"
                  size={16}
                  className={item.is_favorite ? 'fill-neon-magenta text-neon-magenta' : ''}
                />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;
