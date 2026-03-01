import React from 'react';

type DisplayProps = {
  value: string;
};

const Display: React.FC<DisplayProps> = ({ value }) => {
  return (
    <div className="bg-light-display-bg dark:bg-dark-display-bg text-light-display-text dark:text-dark-display-text rounded-lg p-4 mb-4 w-full text-right overflow-x-auto">
      <p className="text-5xl font-light break-all" style={{ minHeight: '60px' }}>
        {value}
      </p>
    </div>
  );
};

export default Display;
