import React from 'react';

type ButtonProps = {
  label: string;
  onClick: (label: string) => void;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({ label, onClick, className = '' }) => {
  const baseClasses = 
    'flex items-center justify-center text-2xl font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const handleClick = () => {
    onClick(label);
  };

  return (
    <button 
      onClick={handleClick} 
      className={`${baseClasses} ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
