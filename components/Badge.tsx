import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md';
}

export default function Badge({ children, variant = 'primary', size = 'md' }: BadgeProps) {
  const variantClasses = {
    primary: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    success: 'bg-green-500/20 text-green-300 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    info: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  };
  
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };
  
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${variantClasses[variant]} ${sizeClasses[size]}
      `}
    >
      {children}
    </span>
  );
}

