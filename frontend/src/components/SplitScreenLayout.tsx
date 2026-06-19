import React from 'react';
import Illustration from './Illustration';

interface SplitScreenLayoutProps {
  children: React.ReactNode;
  fitViewport?: boolean;
}

const SplitScreenLayout: React.FC<SplitScreenLayoutProps> = ({
  children,
  fitViewport = false,
}) => {
  const outerClassName = fitViewport
    ? 'flex min-h-screen lg:h-screen w-full overflow-x-hidden lg:overflow-hidden bg-white'
    : 'flex min-h-screen w-full overflow-x-hidden bg-white';

  const leftClassName =
    'w-full lg:w-1/2 lg:shrink-0 min-w-0 flex flex-col justify-center items-center px-6 py-12 sm:px-16 sm:py-0 lg:px-24 xl:px-32 relative' +
    (fitViewport ? ' lg:overflow-hidden' : '');

  const rightClassName = fitViewport
    ? 'hidden lg:block lg:w-1/2 lg:shrink-0 min-w-0 lg:h-screen self-stretch overflow-hidden bg-[#defaeb]'
    : 'hidden lg:block lg:w-1/2 lg:shrink-0 min-w-0 min-h-screen self-stretch overflow-hidden bg-[#defaeb]';

  return (
    <div className={outerClassName}>
      {/* Left Form Side */}
      <div className={leftClassName}>
        {children}
      </div>

      {/* Right Illustration Side */}
      <div className={rightClassName}>
        <Illustration />
      </div>
    </div>
  );
};

export default SplitScreenLayout;