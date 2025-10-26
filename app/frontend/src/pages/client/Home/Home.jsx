// app/frontend/src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

// Components
import FeaturesSection from "../components/frontend/home/FeaturesSection";
import FeaturedProducts from "../components/frontend/home/FeaturedProducts";
import CategoriesSection from "../components/frontend/home/CategoriesSection";
import StatsSection from "../components/frontend/home/StatsSection";
import CTASection from "../components/frontend/home/CTASection";
import LoadingOverlay from "../components/frontend/home/LoadingOverlay";

// Example data
const features = [
  { title: "Handcrafted", description: "All products are handcrafted by Moroccan artisans.", icon: Sparkles, color: "text-purple-600" },
  { title: "Fast Delivery", description: "Get your products delivered quickly.", icon: ChevronRight, color: "text-blue-500" },
  { title: "Secure Payment", description: "All transactions are safe and secure.", icon: Play, color: "text-green-500" },
  { title: "Customer Support", description: "We provide 24/7 support.", icon: ArrowRight, color: "text-red-500" },
];

const featuredProducts = [
  { id: 1, title: "Moroccan Rug", price: 120.0, description: "Handwoven traditional rug.", image: "/images/rug.jpg" },
  { id: 2, title: "Ceramic Vase", price: 45.0, description: "Colorful ceramic vase.", image: "/images/vase.jpg" },
];

const displayCategories = [
  { id: 1, name: "Rugs", image: "/images/rug.jpg", products: "12 products", color: "from-purple-700 to-purple-500" },
  { id: 2, name: "Vases", image: "/images/vase.jpg", products: "8 products", color: "from-blue-700 to-blue-500" },
];

const statsData = [
  { label: "Products Sold", number: "1.2k", icon: Sparkles, color: "text-purple-600" },
  { label: "Happy Customers", number: "800+", icon: Play, color: "text-green-500" },
  { label: "Artisans", number: "50", icon: ArrowRight, color: "text-red-500" },
  { label: "Awards", number: "15", icon: ChevronRight, color: "text-blue-500" },
];

// Hero Carousel Component
function HeroCarousel({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-screen min-h-[100vh] overflow-hidden">
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 w-full h-full"
                style={{ backgroundImage: `url(${slide.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
              >
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-start p-8 md:p-20 text-white">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                  <p className="text-lg md:text-2xl mb-6 max-w-xl">{slide.description}</p>
                  {slide.cta && (
                    <Link
                      to={slide.cta.link}
                      className="px-6 py-3 bg-purple-600 rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors"
                    >
                      {slide.cta.text}
                    </Link>
                  )}
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white/100 transition"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white/100 transition"
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>
    </section>
  );
}

// Main Home Page
export default function Home() {
  const [productsLoading, setProductsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const heroSlides = [
    { id: 1, title: "Explore Moroccan Rugs", description: "Handwoven with care.", image: "/images/rug-hero.jpg", cta: { text: "Shop Now", link: "/shop" } },
    { id: 2, title: "Decorate Your Home", description: "Artisan vases and pottery.", image: "/images/vase-hero.jpg", cta: { text: "Discover More", link: "/categories" } },
  ];

  const getProductImage = (product) => product.image || "/images/placeholder.jpg";

  return (
    <div className="relative">
      <HeroCarousel slides={heroSlides} />
      <FeaturesSection features={features} />
      <FeaturedProducts products={featuredProducts} getProductImage={getProductImage} />
      <CategoriesSection categories={displayCategories} />
      <StatsSection stats={statsData} />
      <CTASection />
      {(productsLoading || categoriesLoading) && <LoadingOverlay />}
    </div>
  );
}
