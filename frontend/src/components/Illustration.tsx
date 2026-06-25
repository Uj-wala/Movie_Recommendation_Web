import React from 'react';
import sidebarImage from '../assets/sidebar_image.jpeg';

const Illustration: React.FC = () => {
  return (
    <div className="w-full h-full min-w-0 overflow-hidden flex items-center justify-center bg-[#d3fbe1]">
      <img 
        src={sidebarImage} 
        alt="Learning Illustration" 
        className="w-full h-auto max-h-screen object-contain"
      />
    </div>
  );
};

export default Illustration;
