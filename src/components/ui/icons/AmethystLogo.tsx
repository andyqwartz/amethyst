import React from 'react';

interface AmethystLogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const AmethystLogo: React.FC<AmethystLogoProps> = ({
  width = 40,
  height = 40,
  className = '',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M20 0L37.3205 10V30L20 40L2.67949 30V10L20 0Z"
        fill="#9B51E0"
      />
      <path
        d="M20 8L31.547 14.5V27.5L20 34L8.45299 27.5V14.5L20 8Z"
        fill="#F2F2F2"
      />
      <path
        d="M20 16L25.7735 19.5V26.5L20 30L14.2265 26.5V19.5L20 16Z"
        fill="#9B51E0"
      />
    </svg>
  );
};

export default AmethystLogo;