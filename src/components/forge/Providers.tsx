import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useProviders } from '@/hooks/useApi';

const Providers = () => {
  const { data, isLoading } = useProviders();
  const providers = data?.providers ?? [];

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-lg bg-muted/40" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {providers.map((p, i) => (
        <Card
          key={p.id}
          className="glass border-border animate-scale-in hover:border-primary/50 transition-colors"
          style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    p.status === 'online'
                      ? 'bg-neon-cyan animate-pulse'
                      : p.status === 'beta'
                      ? 'bg-yellow-400'
                      : 'bg-muted-foreground'
                  }`}
                />
                <span className="font-display text-lg uppercase tracking-wider">{p.name}</span>
              </span>
              <Badge
                variant="outline"
                className={`font-mono-tech text-[10px] ${
                  p.status === 'online'
                    ? 'border-neon-cyan/40 text-neon-cyan'
                    : p.status === 'beta'
                    ? 'border-yellow-400/40 text-yellow-400'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {p.status === 'online' ? 'Онлайн' : p.status === 'beta' ? 'Бета' : 'Офлайн'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 font-mono-tech text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Icon name="Zap" size={13} className="text-primary" />
                {p.latency}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="Box" size={13} className="text-primary" />
                {p.models?.length ?? 0} моделей
              </span>
              <span className="flex items-center gap-1">
                <Icon name="ShieldCheck" size={13} className="text-neon-cyan" />
                OpenAI API
              </span>
            </div>

            <div className="space-y-2">
              {p.models?.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2.5 rounded border border-border bg-muted/20"
                >
                  <span className="font-display text-sm">{m.name}</span>
                  <Badge variant="outline" className="font-mono-tech text-[10px] border-secondary/40 text-secondary">
                    {m.credits_cost} кр.
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Providers;
