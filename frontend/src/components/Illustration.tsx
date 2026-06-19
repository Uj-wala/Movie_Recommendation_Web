import React from 'react';

const Illustration: React.FC = () => {
  return (
    <div className="w-full h-full min-w-0 overflow-hidden flex items-center justify-center bg-[#dbfce8]">
      <img 
        src="/Illustration.png" 
        alt="Learning Illustration" 
        className="w-full h-full max-w-full max-h-full object-contain p-8 lg:p-12 xl:p-16"
      />
    </div>
  );
};

export default Illustration;
