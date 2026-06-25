import React from 'react';
import Illustration from './Illustration';

interface SplitScreenLayoutProps {
  children: React.ReactNode;
  fitViewport?: boolean;
}

const SplitScreenLayout: React.FC<SplitScreenLayoutProps> = ({
  children,
}) => {
  const outerClassName = 'h-screen w-screen overflow-auto bg-white';

  const leftClassName =
    'proportional-content flex flex-col justify-center items-center px-6 py-12 sm:px-16 sm:py-0 lg:px-24 xl:px-32 relative';

  const rightClassName =
    'proportional-sidebar min-h-screen self-stretch overflow-hidden';

  return (
    <div className={outerClassName}>
      <div className="proportional-layout">
      {/* Left Form Side */}
      <div className={leftClassName}>
        {children}
      </div>

      {/* Right Illustration Side */}
      <div className={rightClassName}>
        <Illustration />
      </div>
      </div>
    </div>
  );
};

export default SplitScreenLayout;
