import { useState, useEffect } from 'react';
import Display from './components/Display';
import Keypad from './components/Keypad';

type Theme = 'light' | 'dark';

function App() {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('calculator-theme');
    return (savedTheme as Theme) || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('calculator-theme', theme);
  }, [theme]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('calculator-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calculator-history', JSON.stringify(history));
  }, [history]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const performCalculation = (first: number, second: number, op: string): number => {
    switch (op) {
      case '+':
        return first + second;
      case '-':
        return first - second;
      case '*':
        return first * second;
      case '/':
        return first / second;
      default:
        return second;
    }
  };

  const handleButtonClick = (label: string) => {
    if (label >= '0' && label <= '9') {
      handleDigit(label);
    } else if (label === '.') {
      handleDecimal();
    } else if (['+', '-', '*', '/'].includes(label)) {
      handleOperator(label);
    } else if (label === '=') {
      handleEquals();
    } else if (label === 'AC') {
      handleClear();
    } else if (label === '+/-') {
      handleToggleSign();
    } else if (label === '%') {
      handlePercent();
    }
  };

  const handleDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const handleDecimal = () => {
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation(firstOperand, inputValue, operator);
      const calculationString = `${firstOperand} ${operator} ${inputValue} = ${result}`;
      setHistory([calculationString, ...history.slice(0, 9)]);
      setDisplayValue(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    const inputValue = parseFloat(displayValue);
    if (operator && firstOperand !== null) {
      const result = performCalculation(firstOperand, inputValue, operator);
      const calculationString = `${firstOperand} ${operator} ${inputValue} = ${result}`;
      setHistory([calculationString, ...history.slice(0, 9)]);
      setDisplayValue(String(result));
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
    }
  };

  const handleClear = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleToggleSign = () => {
    setDisplayValue(String(parseFloat(displayValue) * -1));
  };

  const handlePercent = () => {
    setDisplayValue(String(parseFloat(displayValue) / 100));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 p-4">
      <div className="w-full max-w-sm mx-auto bg-light-calculator-bg dark:bg-dark-calculator-bg rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Calculadora</h1>
            <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
        </div>
        <Display value={displayValue} />
        <Keypad onButtonClick={handleButtonClick} />
      </div>
      <div className="w-full max-w-sm h-96 mx-auto bg-light-calculator-bg dark:bg-dark-calculator-bg rounded-2xl shadow-2xl p-6 flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2 dark:border-gray-600">Histórico</h2>
        <ul className="flex-grow overflow-y-auto text-gray-700 dark:text-gray-300">
          {history.length === 0 ? (
            <li className='italic text-gray-500'>Nenhum cálculo ainda.</li>
          ) : (
            history.map((item, index) => (
              <li key={index} className="py-1 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                {item}
              </li>
            ))
          )}
        </ul>
        <button onClick={() => setHistory([])} className='mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded'>
            Limpar Histórico
        </button>
      </div>
    </div>
  );
}

export default App;
