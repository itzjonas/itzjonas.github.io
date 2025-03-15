const Button = ({ children, onClick, className, ...props }) => {
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