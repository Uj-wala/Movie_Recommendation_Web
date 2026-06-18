import React from 'react';
import Illustration from './Illustration';

interface SplitScreenLayoutProps {
  children: React.ReactNode;
}

const SplitScreenLayout: React.FC<SplitScreenLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-white">
      {/* Left Form Side */}
      <div className="w-full lg:w-1/2 lg:shrink-0 min-w-0 flex flex-col justify-center items-center px-6 py-12 sm:px-16 sm:py-0 lg:px-24 xl:px-32 relative">
        {children}
      </div>

      {/* Right Illustration Side */}
      <div className="hidden lg:block lg:w-1/2 lg:shrink-0 min-w-0 min-h-screen self-stretch overflow-hidden bg-[#defaeb]">
        <Illustration />
      </div>
    </div>
  );
};

export default SplitScreenLayout;
