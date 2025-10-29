import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8
        ${hover ? 'hover:bg-white/10 hover:border-white/20 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

