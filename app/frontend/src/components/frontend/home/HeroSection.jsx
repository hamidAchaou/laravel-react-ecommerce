import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Truck, Shield, ArrowRight } from "lucide-react";
import AppButton from "../ui/Button/AppButton";
import SecondaryButton from "../ui/Button/SecondaryButton";

const HeroSection = () => {
  const [imageErrors, setImageErrors] = useState({});

  const features = [
    { icon: Truck, text: "Free Shipping", subtext: "On orders over $50" },
    { icon: Shield, text: "Secure Payment", subtext: "100% protected" },
    { icon: Star, text: "Premium Quality", subtext: "Guaranteed" },
  ];

  const productThumbnails = [
    {
      image: "/src/assets/images/hero/hero-section-1.webp",
      alt: "Featured Collection",
      fallback: "https://picsum.photos/200/200?fashion&1",
    },
    {
      image: "/src/assets/images/hero/hero-section-2.webp",
      alt: "New Arrivals",
      fallback: "https://picsum.photos/200/200?fashion&2",
    },
    {
      image: "/src/assets/images/hero/hero-section-3.webp",
      alt: "Summer Styles",
      fallback: "https://picsum.photos/200/200?fashion&3",
    },
    {
      image: "/src/assets/images/hero/hero-section-4.png",
      alt: "Premium Fashion",
      fallback: "https://picsum.photos/200/200?fashion&4",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, duration: 0.8 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const handleImageError = (key, fallback) => {
    setImageErrors((prev) => ({ ...prev, [key]: fallback }));
  };

  const getImageSource = (key, src, fallback) => imageErrors[key] || src;

  return (
    <section className="min-h-screen bg-gradient-to-br from-brand-background via-white to-brand-accent/20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-full border border-brand-primary/20 backdrop-blur-sm">
                <ShoppingBag className="w-4 h-4 text-brand-primary" />
                <span className="text-sm font-medium text-brand-primary">
                  Summer Sale Live Now
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-text-primary leading-tight">
                Discover Your{" "}
                <span className="block text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text">
                  Perfect Style
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-brand-text-secondary max-w-lg leading-relaxed">
                Explore our curated collection of premium fashion. From everyday essentials to statement pieces, find exactly what you need.
              </p>
            </motion.div>

            {/* ✅ Use AppButton Components */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <AppButton className="text-lg px-8 py-4">
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </AppButton>

              <SecondaryButton className="text-lg px-8 py-4">
                View Collection
              </SecondaryButton>
            </motion.div>

            {/* Features */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-brand-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <feature.icon className="w-6 h-6 text-brand-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-brand-text-primary text-sm">
                      {feature.text}
                    </p>
                    <p className="text-brand-text-secondary text-xs">{feature.subtext}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-text-primary">10K+</p>
                <p className="text-brand-text-secondary text-sm">Happy Customers</p>
              </div>
              <div className="h-8 w-px bg-brand-gray-200"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-text-primary">500+</p>
                <p className="text-brand-text-secondary text-sm">Premium Products</p>
              </div>
              <div className="h-8 w-px bg-brand-gray-200"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-text-primary">5★</p>
                <p className="text-brand-text-secondary text-sm">Customer Rating</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Section - Hero Image */}
          <motion.div variants={imageVariants} initial="hidden" animate="visible" className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white to-brand-accent/10">
              <div className="aspect-square flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-brand-secondary/5 to-brand-accent/10" />
                <img
                  src="https://picsum.photos/600/600?grayscale&blur=2"
                  alt="Fashion texture"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-soft-light opacity-30"
                  loading="lazy"
                  onError={(e) => (e.target.src = "https://picsum.photos/600/600?grayscale&blur=2")}
                />
                <div className="text-center space-y-4 p-8 relative z-10">
                  <div className="w-64 h-64 mx-auto bg-white rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden border border-brand-gray-100">
                    <img
                      src={getImageSource("main", "/src/assets/images/hero/hero-section-1.webp", "https://picsum.photos/300/300?fashion")}
                      alt="Featured collection 2024"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="eager"
                      onError={(e) => {
                        handleImageError("main", "https://picsum.photos/300/300?fashion");
                        e.target.src = "https://picsum.photos/300/300?fashion";
                      }}
                    />
                  </div>
                  <p className="text-brand-text-secondary italic text-sm bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full inline-block">
                    Trending Collection 2024
                  </p>
                </div>
              </div>

              {/* Floating Badges */}
              <motion.div
                className="absolute top-8 right-8 bg-white rounded-2xl shadow-xl p-4 border border-brand-gray-100 backdrop-blur-sm"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text">
                  30% OFF
                </p>
                <p className="text-brand-text-secondary text-sm">Today Only</p>
              </motion.div>

              <motion.div
                className="absolute bottom-8 left-8 bg-white rounded-2xl shadow-xl p-4 border border-brand-gray-100 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-accent text-brand-accent" />
                    ))}
                  </div>
                  <span className="text-brand-text-primary text-sm font-medium">4.9/5</span>
                </div>
              </motion.div>
            </div>

            {/* Thumbnails */}
            <div className="flex justify-center gap-4 mt-6">
              {productThumbnails.map((product, index) => (
                <motion.div
                  key={index}
                  className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
                  whileHover={{ scale: 1.15, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={getImageSource(`thumb-${index}`, product.image, product.fallback)}
                    alt={product.alt}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      handleImageError(`thumb-${index}`, product.fallback);
                      e.target.src = product.fallback;
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HeroSection);
