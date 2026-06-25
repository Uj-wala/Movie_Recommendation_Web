import React from 'react';
import { useLogoNavigation } from '../hooks/useLogoNavigation';

interface LogoProps {
  className?: string;
  imgClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "mb-6 inline-block", imgClassName = "h-16 object-contain" }) => {
  const handleLogoClick = useLogoNavigation();

  return (
    <button
      type="button"
      onClick={handleLogoClick}
      className={`${className} border-0 bg-transparent p-0 cursor-pointer`.trim()}
      aria-label="Go to Home Page"
    >
      <img src="/Frame 1000002962.png" alt="Alcademy Logo" className={imgClassName} />
    </button>
  );
};

export default Logo;
