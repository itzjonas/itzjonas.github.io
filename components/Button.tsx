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
      className={`rounded-full bg-gradient-to-r from-[#00FFFF] to-[#FF69B4] text-80s-black px-2.5 py-1.5 hover:brightness-125 active:brightness-90 active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
