import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'white' | 'glass' | 'dark';
}

export const Card = ({ children, className = '', onClick, variant = 'white' }: CardProps) => {
  const variants = {
    white: 'bg-white border-slate-200',
    glass: 'bg-white/5 border-white/10 backdrop-blur-md',
    dark: 'bg-slate-900 border-slate-800',
  };

  return (
    <div 
      onClick={onClick}
      className={`rounded-2xl border p-5 shadow-sm transition-all ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};
