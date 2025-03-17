import { MouseEventHandler, ReactNode } from 'react';

// TYPES
interface ButtonProps {
  children?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button = ({ children, className, onClick, ...props }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full bg-gradient-to-r from-[#00FFFF] to-[#FF69B4] text-gray-900 px-2.5 py-1.5 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
