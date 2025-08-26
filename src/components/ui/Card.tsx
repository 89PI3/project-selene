import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export function Card({ children, className, hover = false, gradient = false }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border backdrop-blur-sm',
        gradient 
          ? 'bg-gradient-to-br from-gray-900/90 via-blue-900/20 to-purple-900/20 border-gray-700/50' 
          : 'bg-gray-900/80 border-gray-700/50',
        'shadow-xl',
        hover && 'hover:scale-[1.02] hover:-translate-y-0.5 transition-transform duration-300',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('p-6 pb-0', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('p-6', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={clsx('text-xl font-bold text-white mb-2', className)}>
      {children}
    </h3>
  );
}