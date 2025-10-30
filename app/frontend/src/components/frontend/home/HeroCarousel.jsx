import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mui/material";

const slides = [
  {
    id: 1,
    title: "Découvrez Nos Produits Exceptionnels",
    subtitle: "Qualité, innovation et design au service de vos besoins.",
    image: "/images/hero/slide1.jpg",
    buttonText: "Voir Plus",
    buttonLink: "/products",
  },
  {
    id: 2,
    title: "Offres Spéciales de la Semaine",
    subtitle: "Profitez de réductions incroyables sur une sélection unique.",
    image: "/images/hero/slide2.jpg",
    buttonText: "Explorer",
    buttonLink: "/offers",
  },
  {
    id: 3,
    title: "Votre Satisfaction, Notre Priorité",
    subtitle: "Un service client à l’écoute et des produits de qualité.",
    image: "/images/hero/slide3.jpg",
    buttonText: "Contactez-nous",
    buttonLink: "/contact",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      <AnimatePresence>
        {slides.map(
          (slide, index) =>
            index === current && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-center bg-cover"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/50" />

                <div className="relative text-center text-white px-4 md:px-10 z-10 max-w-2xl">
                  <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-5xl font-bold mb-4"
                  >
                    {slide.title}
                  </motion.h2>
                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg md:text-xl mb-6"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      href={slide.buttonLink}
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        borderRadius: "9999px",
                      }}
                    >
                      {slide.buttonText}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-6 w-full flex justify-center space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              current === index ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
