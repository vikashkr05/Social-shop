import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-bg-card border border-border rounded-xl',
        hover && 'hover:border-border-subtle transition-colors duration-200',
        className
      )}
    >
      {children}
    </div>
  );
}