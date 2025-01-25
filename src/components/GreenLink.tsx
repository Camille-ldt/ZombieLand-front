// import React from 'react';

// interface LinkProps {
// 	textSize?: 'text-sm' | 'text-base' | 'text-lg';
//   	position?: 'relative' | 'absolute' | 'fixed';
// 	children: React.ReactNode;
// 	className?: string;
// 	onClick: () => void;
// }

// export const GreenLink = ({
// 	onClick,
// 	position,
// 	textSize,
// 	children,
// 	className,
// }: LinkProps) => {
// 	return (
// 		<button
//   onClick={onClick}
//   className={`transform transition-transform duration-400 hover:scale-110 ${position} inline-flex items-center rounded-md bg-green-low px-3 py-2 ${textSize} font-semibold text-white shadow-sm hover:bg-red-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-primary mx-3 active:bg-red-primary focus:bg-red-primary`}
// >
//   {children}
// </button>

// 	);
// };

import React from 'react';

interface LinkProps {
  textSize?: 'text-sm' | 'text-base' | 'text-lg';
  position?: 'relative' | 'absolute' | 'fixed';
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}

export const GreenLink = ({
  onClick,
  position,
  textSize,
  children,
  className,
}: LinkProps) => {
  return (
    <button
      onClick={onClick}
      className={`transform transition-transform duration-400 hover:scale-110 ${position} inline-flex items-center rounded-md bg-green-low px-3 py-2 ${textSize} font-semibold text-white shadow-sm hover:bg-red-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-primary mx-3 active:bg-red-primary focus:bg-red-primary ${className}`}
    >
      {children}
    </button>
  );
};
