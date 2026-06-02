import React from 'react';

interface LogoProps {
  className?: string;
  imgClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "mb-6 inline-block", imgClassName = "h-16 object-contain" }) => {
  return (
    <div className={className}>
      <img src="/Frame 1000002962.png" alt="Alcademy Logo" className={imgClassName} />
    </div>
  );
};

export default Logo;
