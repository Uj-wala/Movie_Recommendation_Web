import React from 'react';
import sidebarImage from '../assets/sidebar_image.jpeg';

interface SplitScreenLayoutProps {
  children: React.ReactNode;
  fitViewport?: boolean;
}

const SplitScreenLayout: React.FC<SplitScreenLayoutProps> = ({
  children,
  fitViewport = false,
}) => {
  const outerClassName = fitViewport
    ? 'flex min-h-screen md:h-screen w-full md:min-w-[1440px] overflow-x-auto md:overflow-y-hidden bg-white'
    : 'flex min-h-screen w-full md:min-w-[1440px] overflow-x-auto bg-white';

  const leftClassName =
    'w-full md:basis-[54.58%] md:shrink-0 min-w-0 flex flex-col justify-center items-center px-6 py-12 sm:px-16 sm:py-0 lg:px-20 xl:px-24 2xl:px-32 relative' +
    (fitViewport ? ' md:overflow-y-auto' : '');

  const rightClassName = fitViewport
    ? 'relative hidden md:flex md:basis-[45.42%] md:shrink-0 min-w-0 md:h-screen self-stretch items-center justify-center overflow-hidden bg-[#d4fae1]'
    : 'relative hidden md:flex md:basis-[45.42%] md:shrink-0 min-w-0 min-h-screen self-stretch items-center justify-center overflow-hidden bg-[#d4fae1]';

  return (
    <div className={outerClassName}>
      {/* Left Form Side */}
      <div className={leftClassName}>
        {children}
      </div>

      {/* Right Sidebar Image */}
      <div className={rightClassName}>
        <img
          src={sidebarImage}
          alt=""
          className="absolute left-1/2 top-1/2 block h-[118%] min-h-screen w-[108%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default SplitScreenLayout;
