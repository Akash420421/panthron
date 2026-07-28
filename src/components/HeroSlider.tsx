import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Slide {
  id: string;
  image: string;
  productId: string;
  alt: string;
}

const SLIDES: Slide[] = [
  {
    id: 'slide-slp',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1400&q=80',
    productId: 'prod-slp-4',
    alt: 'Panthron AirCushion Sleeper'
  },
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80',
    productId: 'prod-1',
    alt: 'AuraSound Pro Headphones'
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80',
    productId: 'prod-2',
    alt: 'Horizon Smartwatch'
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1400&q=80',
    productId: 'prod-3',
    alt: 'Urban Leather Backpack'
  }
];

export const HeroSlider: React.FC = () => {
  const { navigateTo } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto slide every 3.5 seconds
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <div 
      className="relative w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-2 pb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-200/80 shadow-lg bg-zinc-950 h-[220px] sm:h-[340px] md:h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigateTo('product-detail', { productId: currentSlide.productId })}
            className="relative w-full h-full cursor-pointer group"
          >
            {/* Pure Full Slide Image */}
            <img
              src={currentSlide.image}
              alt={currentSlide.alt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle Gradient Shadow on bottom for navigation visibility */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-transform active:scale-90 z-20 shadow-md"
          title="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-transform active:scale-90 z-20 shadow-md"
          title="Next Slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Dots Pagination */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all ${
                currentIndex === index ? 'w-6 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white'
              }`}
              title={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};


