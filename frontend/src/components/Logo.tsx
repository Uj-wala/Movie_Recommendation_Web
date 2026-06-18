import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  imgClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "mb-6 inline-block", imgClassName = "h-16 object-contain" }) => {
  return (
    <Link to="/" className={className} aria-label="Go to Home Page">
      <img src="/Frame 1000002962.png" alt="Alcademy Logo" className={imgClassName} />
    </Link>
  );
};

export default Logo;
