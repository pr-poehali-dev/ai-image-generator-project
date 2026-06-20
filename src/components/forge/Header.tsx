import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HERO_IMG } from '@/data/mock';

const Header = () => (
  <header className="sticky top-0 z-40 glass border-b border-border">
    <div className="container max-w-7xl mx-auto px-4 h-[73px] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary flex items-center justify-center animate-pulse-glow">
          <Icon name="Zap" size={22} className="text-primary" />
        </div>
        <div>
          <h1 className="font-display text-xl font-black tracking-wider leading-none">
            NEURO<span className="neon-text-cyan animate-flicker">FORGE</span>
          </h1>
          <span className="font-mono-tech text-[10px] text-muted-foreground tracking-widest">
            AI IMAGE ENGINE v2.6
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className="hidden sm:flex border-neon-cyan/40 text-neon-cyan font-mono-tech gap-1.5 px-3 py-1"
        >
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          240 кредитов
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 outline-none">
              <Avatar className="border-2 border-primary/50 hover:border-primary transition-colors">
                <AvatarImage src={HERO_IMG} className="object-cover" />
                <AvatarFallback className="bg-muted">NX</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass border-border w-56">
            <DropdownMenuLabel className="font-display">
              <div className="text-foreground">NEONXER</div>
              <div className="text-xs text-muted-foreground font-mono-tech font-normal">
                pro@neuroforge.ai
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              { i: 'User', t: 'Профиль' },
              { i: 'Settings', t: 'Настройки' },
              { i: 'CreditCard', t: 'Подписка PRO' },
              { i: 'BookOpen', t: 'Документация' },
            ].map((x) => (
              <DropdownMenuItem key={x.t} className="gap-2 cursor-pointer focus:bg-primary/10 focus:text-primary">
                <Icon name={x.i} size={15} />
                {x.t}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
              <Icon name="LogOut" size={15} />
              Выход
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
);

export default Header;
