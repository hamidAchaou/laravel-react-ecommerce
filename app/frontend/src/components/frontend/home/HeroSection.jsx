import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Truck, Shield, ArrowRight } from 'lucide-react';

// Import your local images
import heroMain from '../../../assets/images/hero/hero-section-1.webp';
import heroBg from '../../../assets/images/hero/hero-section-2.webp';
import product1 from '../../../assets/images/hero/hero-section-3.webp';
import product2 from '../../../assets/images/hero/hero-section-4.png';

const HeroSection = () => {
  const features = [
    { icon: Truck, text: 'Free Shipping', subtext: 'On orders over $50' },
    { icon: Shield, text: 'Secure Payment', subtext: '100% protected' },
    { icon: Star, text: 'Premium Quality', subtext: 'Guaranteed' }
  ];

  const productThumbnails = [
    { image: heroMain, alt: "Featured Collection" },
    { image: heroBg, alt: "New Arrivals" },
    { image: product1, alt: "Summer Styles" },
    { image: product2, alt: "Premium Fashion" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-brand-background via-white to-brand-accent/20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
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
                Discover Your
                <span className="block text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text">
                  Perfect Style
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-brand-text-secondary max-w-lg leading-relaxed">
                Explore our curated collection of premium fashion. From everyday essentials to statement pieces, find exactly what you need.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white flex items-center justify-center gap-2 text-lg px-8 py-4 rounded-xl hover-lift transition-all duration-300 shadow-lg">
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button className="border-2 border-brand-text-primary text-brand-text-primary px-8 py-4 rounded-xl font-medium hover:bg-brand-text-primary hover:text-white transition-all duration-300 shadow-md">
                View Collection
              </button>
            </motion.div>

            {/* Features */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-brand-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-brand-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-brand-text-primary text-sm">{feature.text}</p>
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

          {/* Hero Image with Local Images */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white to-brand-accent/10">
              {/* Main product image using local assets */}
              <div className="aspect-square flex items-center justify-center relative">
                {/* Enhanced background with better color overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-brand-secondary/5 to-brand-accent/10" />
                
                <img 
                  src={heroBg} 
                  alt="Fashion background texture"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-soft-light opacity-30"
                  loading="lazy"
                />
                
                <div className="text-center space-y-4 p-8 relative z-10">
                  <div className="w-64 h-64 mx-auto bg-white rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden border border-brand-gray-100">
                    <img 
                      src={heroMain} 
                      alt="Featured fashion collection 2024"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="eager"
                    />
                  </div>
                  <p className="text-brand-text-secondary italic text-sm bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full inline-block">
                    Trending Collection 2024
                  </p>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                className="absolute top-8 right-8 bg-white rounded-2xl shadow-xl p-4 border border-brand-gray-100 backdrop-blur-sm"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-brand-primary bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                    30% OFF
                  </p>
                  <p className="text-brand-text-secondary text-sm">Today Only</p>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute bottom-8 left-8 bg-white rounded-2xl shadow-xl p-4 border border-brand-gray-100 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-brand-accent text-brand-accent" />
                    ))}
                  </div>
                  <span className="text-brand-text-primary text-sm font-medium">4.9/5</span>
                </div>
              </motion.div>
            </div>
            
            {/* Product thumbnails using all local images */}
            <div className="flex justify-center gap-4 mt-6">
              {productThumbnails.map((product, index) => (
                <motion.div 
                  key={index}
                  className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
                  whileHover={{ scale: 1.15, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img 
                    src={product.image} 
                    alt={product.alt}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
            
            {/* Enhanced background decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 rounded-full blur-2xl -z-10"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-r from-brand-accent/20 to-brand-primary/20 rounded-full blur-2xl -z-10"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-secondary/10 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HeroSection);