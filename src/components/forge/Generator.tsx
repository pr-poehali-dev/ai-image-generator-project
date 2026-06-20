import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';
import { useProviders, useStyles, useGenerate } from '@/hooks/useApi';
import type { GenerateResult } from '@/lib/api';

const RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:2'];

const PROMPT_IDEAS = [
  'Киборг-самурай под неоновым дождём',
  'Космическая станция в стиле ретровейв',
  'Хакер в киберпространстве, голограммы',
  'Неоновый дракон над городом будущего',
];

const Generator = () => {
  const { data: provData } = useProviders();
  const { data: styleData } = useStyles();
  const generate = useGenerate();

  const providers = provData?.providers ?? [];
  const styles = styleData?.styles ?? [];

  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState('caila');
  const [model, setModel] = useState('flux-pro');
  const [style, setStyle] = useState('cyberpunk');
  const [ratio, setRatio] = useState('1:1');
  const [steps, setSteps] = useState([30]);
  const [guidance, setGuidance] = useState([7.5]);
  const [hd, setHd] = useState(true);
  const [result, setResult] = useState<GenerateResult | null>(null);

  const activeProvider = providers.find((p) => p.slug === provider);
  const models = activeProvider?.models ?? [];
  const activeModel = models.find((m) => m.slug === model);
  const baseCost = activeModel?.credits_cost ?? 4;

  useEffect(() => {
    if (providers.length && !providers.find((p) => p.slug === provider)) {
      setProvider(providers[0].slug);
    }
  }, [providers, provider]);

  const handleProvider = (slug: string) => {
    setProvider(slug);
    const p = providers.find((x) => x.slug === slug);
    if (p?.models?.length) setModel(p.models[0].slug);
  };

  const onGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Введите описание изображения');
      return;
    }
    generate.mutate(
      { prompt, provider, model, style, ratio, steps: steps[0], guidance: guidance[0], hd },
      { onSuccess: (res) => setResult(res) }
    );
  };

  const loading = generate.isPending;
  const previewImg = result?.image_url;

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      {/* PREVIEW */}
      <Card className="glass border-border overflow-hidden relative scan-lines order-2 lg:order-1">
        <div className="aspect-square md:aspect-video lg:aspect-square w-full relative flex items-center justify-center bg-gradient-to-br from-muted/30 to-background">
          {loading ? (
            <div className="text-center z-10 px-8 w-full max-w-md">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <p className="font-display uppercase tracking-widest text-primary mb-3 text-sm animate-pulse">
                Нейросеть рисует...
              </p>
              <p className="font-mono-tech text-xs text-muted-foreground mt-3">
                {activeProvider?.name} · {activeModel?.name}
              </p>
            </div>
          ) : previewImg ? (
            <>
              <img src={previewImg} alt={result?.prompt} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                <Badge className="bg-background/80 border border-primary/40 text-primary font-mono-tech">
                  {result?.gen_code}
                </Badge>
                <Badge className="bg-background/80 border border-neon-magenta/40 text-neon-magenta font-mono-tech">
                  {result?.used_real_api ? 'REAL AI' : 'DEMO'}
                </Badge>
              </div>
            </>
          ) : (
            <div className="text-center z-10 px-8">
              <Icon name="ImagePlus" size={56} className="mx-auto text-primary/60 mb-4 animate-float" />
              <p className="font-display uppercase tracking-widest text-muted-foreground text-sm">
                Холст готов
              </p>
              <p className="font-mono-tech text-xs text-muted-foreground/60 mt-2">
                Введите промпт и нажмите «Сгенерировать»
              </p>
            </div>
          )}
          <Badge className="absolute top-4 left-4 bg-background/80 border border-border font-mono-tech z-10">
            {ratio} · {hd ? 'HD' : 'SD'}
          </Badge>
        </div>
      </Card>

      {/* CONTROLS */}
      <div className="space-y-4 order-1 lg:order-2">
        <Card className="glass border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base uppercase tracking-wider flex items-center gap-2">
              <Icon name="Terminal" size={18} className="text-primary" />
              Промпт
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Опишите изображение: неоновый город, киборг, дождь, кинематографичный свет..."
              className="min-h-24 bg-input border-border font-mono-tech text-sm resize-none focus-visible:ring-primary"
            />

            <div className="flex flex-wrap gap-1.5">
              {PROMPT_IDEAS.map((idea) => (
                <button
                  key={idea}
                  onClick={() => setPrompt(idea)}
                  className="text-[10px] font-mono-tech px-2 py-1 rounded border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {idea}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-mono-tech text-xs text-muted-foreground">Провайдер</Label>
                <Select value={provider} onValueChange={handleProvider}>
                  <SelectTrigger className="bg-input border-border font-display text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-border">
                    {providers.map((p) => (
                      <SelectItem key={p.slug} value={p.slug} className="font-display text-xs">
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.status === 'online'
                                ? 'bg-neon-cyan'
                                : p.status === 'beta'
                                ? 'bg-yellow-400'
                                : 'bg-muted-foreground'
                            }`}
                          />
                          {p.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono-tech text-xs text-muted-foreground">Модель</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="bg-input border-border font-display text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-border">
                    {models.map((m) => (
                      <SelectItem key={m.slug} value={m.slug} className="font-display text-xs">
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono-tech text-xs text-muted-foreground">Стиль</Label>
              <div className="grid grid-cols-3 gap-2">
                {styles.map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => setStyle(s.slug)}
                    className={`p-2 rounded border text-xs font-display transition-all ${
                      style === s.slug
                        ? 'border-primary bg-primary/10 text-primary neon-border'
                        : 'border-border bg-muted/20 text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    <div className="text-base mb-0.5">{s.emoji}</div>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono-tech text-xs text-muted-foreground">Соотношение</Label>
              <div className="flex flex-wrap gap-2">
                {RATIOS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRatio(r)}
                    className={`px-3 py-1.5 rounded border text-xs font-mono-tech transition-all ${
                      ratio === r
                        ? 'border-secondary bg-secondary/10 text-secondary'
                        : 'border-border text-muted-foreground hover:border-secondary/40'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <Accordion type="single" collapsible className="border-t border-border pt-2">
              <AccordionItem value="adv" className="border-none">
                <AccordionTrigger className="font-display text-xs uppercase tracking-wider hover:no-underline py-2">
                  <span className="flex items-center gap-2">
                    <Icon name="SlidersHorizontal" size={14} className="text-primary" />
                    Параметры
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-5 pt-3">
                  <SliderRow label="Шаги (steps)" value={steps[0]} setVal={setSteps} val={steps} min={10} max={60} step={1} />
                  <SliderRow label="Guidance Scale" value={guidance[0]} setVal={setGuidance} val={guidance} min={1} max={20} step={0.5} />
                  <div className="flex items-center justify-between">
                    <Label className="font-mono-tech text-xs text-muted-foreground">HD-качество (×2 кредита)</Label>
                    <Switch checked={hd} onCheckedChange={setHd} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button
              onClick={onGenerate}
              disabled={loading}
              className="w-full font-display uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow h-12"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={18} className="animate-spin" />
                  Генерация...
                </>
              ) : (
                <>
                  <Icon name="Sparkles" size={18} />
                  Сгенерировать · {hd ? baseCost * 2 : baseCost} кр.
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SliderRow = ({
  label,
  value,
  setVal,
  val,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  setVal: (v: number[]) => void;
  val: number[];
  min: number;
  max: number;
  step: number;
}) => (
  <div className="space-y-2">
    <div className="flex justify-between">
      <Label className="font-mono-tech text-xs text-muted-foreground">{label}</Label>
      <span className="font-mono-tech text-xs text-primary">{value}</span>
    </div>
    <Slider value={val} onValueChange={setVal} min={min} max={max} step={step} />
  </div>
);

export default Generator;
