import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ApiImage } from '@/lib/api';

interface Props {
  items: ApiImage[];
  loading?: boolean;
  onToggleFav: (id: number) => void;
  onView: (item: ApiImage) => void;
}

const GalleryGrid = ({ items, loading, onToggleFav, onView }: Props) => {
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg bg-muted/40" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item, i) => (
        <Card
          key={item.id}
          className="glass border-border overflow-hidden group relative cursor-pointer hover:border-primary/60 transition-all duration-300 animate-scale-in"
          style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}
          onClick={() => onView(item)}
        >
          <div className="aspect-square overflow-hidden relative">
            <img
              src={item.image_url}
              alt={item.prompt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFav(item.id);
              }}
              className="absolute top-3 right-3 w-9 h-9 rounded-full glass border border-border flex items-center justify-center hover:scale-110 transition-transform z-10"
            >
              <Icon
                name="Heart"
                size={16}
                className={item.is_favorite ? 'fill-neon-magenta text-neon-magenta' : 'text-muted-foreground'}
              />
            </button>

            <Badge className="absolute top-3 left-3 bg-background/80 border border-primary/40 text-primary font-mono-tech text-[10px] z-10">
              {item.emoji} {item.provider}
            </Badge>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="font-display text-sm text-foreground line-clamp-2 mb-2 leading-tight">
                {item.prompt}
              </p>
              <div className="flex items-center justify-between text-xs font-mono-tech text-muted-foreground">
                <span className="flex items-center gap-1 truncate">
                  <Icon name="Box" size={12} />
                  {item.model}
                </span>
                <span className="flex items-center gap-1 text-neon-magenta shrink-0">
                  <Icon name="Heart" size={12} />
                  {item.likes}
                </span>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 rounded-full glass border border-primary flex items-center justify-center neon-border">
                <Icon name="Eye" size={22} className="text-primary" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default GalleryGrid;
