import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PROVIDERS, HISTORY } from '@/data/mock';

const STATS = [
  { i: 'Image', l: 'Создано', v: '1 284', c: 'text-neon-cyan' },
  { i: 'Coins', l: 'Кредитов', v: '240', c: 'text-neon-magenta' },
  { i: 'Heart', l: 'В избранном', v: '47', c: 'text-neon-purple' },
  { i: 'Zap', l: 'Сегодня', v: '18', c: 'text-neon-cyan' },
];

const LIMITS = [
  { l: 'Дневной лимит генераций', cur: 18, max: 50 },
  { l: 'Месячные кредиты', cur: 760, max: 1000 },
  { l: 'Хранилище', cur: 3.2, max: 10, unit: 'ГБ' },
];

const statusBadge = (s: string) => {
  const map: Record<string, { c: string; t: string }> = {
    success: { c: 'border-neon-cyan/40 text-neon-cyan', t: 'Успешно' },
    processing: { c: 'border-yellow-400/40 text-yellow-400', t: 'В процессе' },
    failed: { c: 'border-destructive/40 text-destructive', t: 'Ошибка' },
  };
  const x = map[s];
  return (
    <Badge variant="outline" className={`font-mono-tech text-[10px] ${x.c}`}>
      {x.t}
    </Badge>
  );
};

const Dashboard = () => (
  <div className="space-y-6">
    {/* STATS */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((s, i) => (
        <Card
          key={s.l}
          className="glass border-border animate-scale-in"
          style={{ animationDelay: `${i * 70}ms`, opacity: 0 }}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <Icon name={s.i} size={22} className={s.c} />
            </div>
            <div className={`font-display text-3xl font-bold ${s.c}`}>{s.v}</div>
            <div className="font-mono-tech text-xs text-muted-foreground uppercase tracking-wider mt-1">
              {s.l}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      {/* LIMITS */}
      <Card className="glass border-border">
        <CardHeader>
          <CardTitle className="font-display text-base uppercase tracking-wider flex items-center gap-2">
            <Icon name="Gauge" size={18} className="text-primary" />
            Лимиты
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {LIMITS.map((lim) => (
            <div key={lim.l} className="space-y-2">
              <div className="flex justify-between font-mono-tech text-xs">
                <span className="text-muted-foreground">{lim.l}</span>
                <span className="text-primary">
                  {lim.cur} / {lim.max} {lim.unit ?? ''}
                </span>
              </div>
              <Progress value={(lim.cur / lim.max) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PROVIDERS */}
      <Card className="glass border-border">
        <CardHeader>
          <CardTitle className="font-display text-base uppercase tracking-wider flex items-center gap-2">
            <Icon name="Network" size={18} className="text-primary" />
            Провайдеры ИИ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {PROVIDERS.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-3 rounded border border-border bg-muted/20 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    p.status === 'online'
                      ? 'bg-neon-cyan animate-pulse'
                      : p.status === 'beta'
                      ? 'bg-yellow-400'
                      : 'bg-muted-foreground'
                  }`}
                />
                <div>
                  <div className="font-display text-sm">{p.name}</div>
                  <div className="font-mono-tech text-[10px] text-muted-foreground">
                    {p.models.length} моделей
                  </div>
                </div>
              </div>
              <div className="text-right">
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
                <div className="font-mono-tech text-[10px] text-muted-foreground mt-1">
                  ⚡ {p.latency}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>

    {/* HISTORY */}
    <Card className="glass border-border">
      <CardHeader>
        <CardTitle className="font-display text-base uppercase tracking-wider flex items-center gap-2">
          <Icon name="History" size={18} className="text-primary" />
          История генераций
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                {['ID', 'Промпт', 'Провайдер', 'Статус', 'Кредиты', 'Время'].map((h) => (
                  <TableHead key={h} className="font-mono-tech text-xs uppercase text-muted-foreground">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {HISTORY.map((row) => (
                <TableRow key={row.id} className="border-border hover:bg-primary/5">
                  <TableCell className="font-mono-tech text-xs text-primary">{row.id}</TableCell>
                  <TableCell className="max-w-[200px] truncate font-display text-sm">
                    {row.prompt}
                  </TableCell>
                  <TableCell className="font-display text-sm">{row.provider}</TableCell>
                  <TableCell>{statusBadge(row.status)}</TableCell>
                  <TableCell className="font-mono-tech text-xs">{row.credits}</TableCell>
                  <TableCell className="font-mono-tech text-xs text-muted-foreground">
                    {row.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default Dashboard;
