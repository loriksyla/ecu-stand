import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium tracking-normal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed text-[15px] py-2.5 px-6 rounded-full";
  
  const variants = {
    primary: "bg-brand-accent text-white hover:bg-brand-accentHover shadow-sm hover:shadow-md",
    outline: "border border-brand-accent text-brand-accent hover:bg-brand-accent/5",
    ghost: "text-brand-text hover:text-brand-accent hover:bg-black/5",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;