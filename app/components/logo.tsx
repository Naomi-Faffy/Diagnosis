"use client";

import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className="flex items-center">
      <img 
        src="/images/logo.png" 
        alt="Diagnosis & Sensors Logo" 
        className={`${className} object-contain`}
        style={{ 
          maxHeight: "48px", 
          width: "auto",
         
        }}
      />
    </div>
  );
};

export default Logo;
