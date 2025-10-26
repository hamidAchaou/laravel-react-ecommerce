import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const HeroCarousel = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Automatic slide change
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  return (
    <section className="relative h-screen min-h-[90vh] overflow-hidden">
      {/* Hero Slides */}
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={slide.image}
                  alt={slide.title || "Hero Slide"}
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                />

                {/* Overlay Content */}
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-start p-8 md:p-20 text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    {/* Badge */}
                    {slide.badge && (
                      <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
                        <Sparkles className="h-4 w-4 text-yellow-300" />
                        <span>{slide.badge}</span>
                      </div>
                    )}

                    {/* Title & Description */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                      {slide.title}
                    </h1>
                    {slide.description && (
                      <p className="text-lg md:text-2xl mb-6 max-w-xl">
                        {slide.description}
                      </p>
                    )}

                    {/* Call to Action */}
                    {slide.cta && slide.cta.link && (
                      <Link
                        to={slide.cta.link}
                        className="px-6 py-3 bg-purple-600 rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
                      >
                        {slide.cta.text}
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Carousel Controls */}
      <div className="absolute inset-0 flex justify-between items-center px-4 md:px-10">
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="p-3 bg-white/50 rounded-full hover:bg-white/80 transition"
        >
          <ChevronLeft className="h-6 w-6 text-gray-800" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="p-3 bg-white/50 rounded-full hover:bg-white/80 transition"
        >
          <ChevronRight className="h-6 w-6 text-gray-800" />
        </button>
      </div>

      {/* Play/Pause */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        aria-label={isPlaying ? "Pause Carousel" : "Play Carousel"}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/30 hover:bg-white/60 p-3 rounded-full transition"
      >
        {isPlaying ? (
          <div className="w-3 h-3 bg-gray-800 rounded-sm" />
        ) : (
          <Play className="h-5 w-5 text-gray-800" />
        )}
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
export default memo(HeroCarousel);
