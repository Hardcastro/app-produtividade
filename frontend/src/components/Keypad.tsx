import React from 'react';
import Button from './Button';

type KeypadProps = {
  onButtonClick: (label: string) => void;
};

const Keypad: React.FC<KeypadProps> = ({ onButtonClick }) => {
  const keys = [
    { label: 'AC', type: 'special' },
    { label: '+/-', type: 'special' },
    { label: '%', type: 'special' },
    { label: '/', type: 'operator' },
    { label: '7', type: 'number' },
    { label: '8', type: 'number' },
    { label: '9', type: 'number' },
    { label: '*', type: 'operator' },
    { label: '4', type: 'number' },
    { label: '5', type: 'number' },
    { label: '6', type: 'number' },
    { label: '-', type: 'operator' },
    { label: '1', type: 'number' },
    { label: '2', type: 'number' },
    { label: '3', type: 'number' },
    { label: '+', type: 'operator' },
    { label: '0', type: 'number', span: 2 },
    { label: '.', type: 'number' },
    { label: '=', type: 'operator' },
  ];

  const getButtonClasses = (type: string) => {
    switch (type) {
      case 'operator':
        return 'bg-light-operator-key-bg text-light-operator-key-text hover:bg-light-operator-key-hover-bg dark:bg-dark-operator-key-bg dark:text-dark-operator-key-text dark:hover:bg-dark-operator-key-hover-bg';
      case 'special':
        return 'bg-gray-400 text-gray-900 hover:bg-gray-500 dark:bg-gray-500 dark:text-gray-50 dark:hover:bg-gray-400';
      default:
        return 'bg-light-key-bg text-light-key-text hover:bg-light-key-hover-bg dark:bg-dark-key-bg dark:text-dark-key-text dark:hover:bg-dark-key-hover-bg';
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3 w-full">
      {keys.map((key) => (
        <div key={key.label} className={key.span === 2 ? 'col-span-2' : ''}>
            <Button
              label={key.label}
              onClick={onButtonClick}
              className={`w-full h-20 ${getButtonClasses(key.type)}`}
            />
        </div>
      ))}
    </div>
  );
};

export default Keypad;
