import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'white' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  icon?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-soft hover:shadow-glow',
  secondary: 'bg-navy-900 text-white hover:bg-navy-800 shadow-soft',
  ghost: 'text-navy-700 hover:bg-navy-50',
  white: 'bg-white text-navy-900 hover:bg-navy-50 shadow-soft',
  outline: 'border border-navy-200 text-navy-700 hover:border-brand-400 hover:text-brand-600 bg-white/50',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export function Button({ variant = 'primary', size = 'md', children, icon = false, className = '', ...props }: ButtonProps) {
  const ctaLabel = typeof children === 'string' ? children : props.id || 'cta';
  return (
    <button
      data-track-cta={ctaLabel}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 active:scale-[0.97] ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
      {icon && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />}
    </button>
  );
}
