import { useState } from 'react';
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
import { PROVIDERS, STYLES, RATIOS, ABSTRACT_IMG } from '@/data/mock';

const Generator = () => {
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState('caila');
  const [model, setModel] = useState(PROVIDERS[0].models[0]);
  const [style, setStyle] = useState('cyberpunk');
  const [ratio, setRatio] = useState('1:1');
  const [steps, setSteps] = useState([30]);
  const [guidance, setGuidance] = useState([7.5]);
  const [count, setCount] = useState([1]);
  const [hd, setHd] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeProvider = PROVIDERS.find((p) => p.id === provider)!;

  const handleProvider = (id: string) => {
    setProvider(id);
    const p = PROVIDERS.find((x) => x.id === id)!;
    setModel(p.models[0]);
  };

  const generate = () => {
    if (!prompt.trim()) {
      toast.error('Введите описание изображения');
      return;
    }
    setLoading(true);
    setProgress(0);
    const iv = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(iv);
          setLoading(false);
          toast.success('Изображение сгенерировано!');
          return 100;
        }
        return p + 5;
      });
    }, 90);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      {/* PREVIEW */}
      <Card className="glass border-border overflow-hidden relative scan-lines order-2 lg:order-1">
        <div className="aspect-square md:aspect-video lg:aspect-square w-full relative flex items-center justify-center bg-gradient-to-br from-muted/30 to-background">
          {loading ? (
            <div className="text-center z-10 px-8 w-full max-w-md">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <p className="font-display uppercase tracking-widest text-primary mb-3 text-sm">
                Генерация {progress}%
              </p>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="font-mono-tech text-xs text-muted-foreground mt-3">
                {activeProvider.name} · {model}
              </p>
            </div>
          ) : (
            <>
              <img
                src={ABSTRACT_IMG}
                alt="preview"
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
              <div className="text-center z-10 px-8">
                <Icon name="ImagePlus" size={56} className="mx-auto text-primary/60 mb-4 animate-float" />
                <p className="font-display uppercase tracking-widest text-muted-foreground text-sm">
                  Холст готов
                </p>
                <p className="font-mono-tech text-xs text-muted-foreground/60 mt-2">
                  Введите промпт и нажмите «Сгенерировать»
                </p>
              </div>
            </>
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
              className="min-h-28 bg-input border-border font-mono-tech text-sm resize-none focus-visible:ring-primary"
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-mono-tech text-xs text-muted-foreground">Провайдер</Label>
                <Select value={provider} onValueChange={handleProvider}>
                  <SelectTrigger className="bg-input border-border font-display text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-border">
                    {PROVIDERS.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="font-display text-xs">
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
                    {activeProvider.models.map((m) => (
                      <SelectItem key={m} value={m} className="font-display text-xs">
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono-tech text-xs text-muted-foreground">Стиль</Label>
              <div className="grid grid-cols-3 gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`p-2 rounded border text-xs font-display transition-all ${
                      style === s.id
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
                  <SliderRow label="Кол-во изображений" value={count[0]} setVal={setCount} val={count} min={1} max={4} step={1} />
                  <div className="flex items-center justify-between">
                    <Label className="font-mono-tech text-xs text-muted-foreground">HD-качество (×2 кредита)</Label>
                    <Switch checked={hd} onCheckedChange={setHd} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button
              onClick={generate}
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
                  Сгенерировать · {hd ? count[0] * 2 : count[0]} кр.
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
