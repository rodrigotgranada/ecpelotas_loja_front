import React from 'react';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'default';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary text-background font-bold border-primary/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-error/10 text-error border-error/20',
  default: 'bg-surface text-text-primary border-border',
};

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs uppercase rounded-md border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
