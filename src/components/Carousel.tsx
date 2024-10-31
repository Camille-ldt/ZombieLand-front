import React, { useState } from 'react';
import { CardProps } from './ActivityCard';
import { Card } from './ActivityCard';

export interface CarouselProps {
  items: CardProps[];
}

export const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsToShow = 3;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (items.length - cardsToShow + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + (items.length - cardsToShow + 1)) % (items.length - cardsToShow + 1));
  };

  const carouselStyle = {
    transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-in-out" 
        style={carouselStyle}
      >
        {items.map((item) => (
          <div key={item.title} className={`w-1/${cardsToShow} flex-shrink-0 px-2`}>
            <Card {...item} />
          </div>
        ))}
      </div>
      <button 
        onClick={prevSlide} 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition focus:outline-none"
        aria-label="Précédent"
      >
        &lsaquo;
      </button>
      <button 
        onClick={nextSlide} 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition focus:outline-none"
        aria-label="Suivant"
      >
        &rsaquo;
      </button>
    </div>
  );
};

export default Carousel;