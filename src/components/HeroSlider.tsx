import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HeroSlider: React.FC = () => {
  const { navigateTo, heroSlides } = useShop();
  const slides = heroSlides.length > 0 ? heroSlides : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (currentIndex >= slides.length && slides.length > 0) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  useEffect(() => {
    if (isHovered || slides.length < 2) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered, slides.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length < 2) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length < 2) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  if (slides.length === 0) return null;
  const currentSlide = slides[currentIndex];

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.38, ease: 'easeInOut' }}
            style={{ willChange: 'opacity' }}
            onClick={() => currentSlide.productId && navigateTo('product-detail', { productId: currentSlide.productId })}
            className={`relative w-full h-full ${currentSlide.productId ? 'cursor-pointer group' : ''}`}
          >
            <img
              src={currentSlide.image}
              alt={currentSlide.alt}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover ${currentSlide.productId ? 'group-hover:scale-[1.03] transition-transform duration-500 ease-out' : ''}`}
            />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {slides.length > 1 && (
          <>
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

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              {slides.map((slide, index) => (
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
          </>
        )}
      </div>
    </div>
  );
};


