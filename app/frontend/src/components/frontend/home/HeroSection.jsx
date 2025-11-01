// components/hero/HeroSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Star, ArrowRight } from "lucide-react";

import AppButton from "../ui/Button/AppButton";
import SecondaryButton from "../ui/Button/SecondaryButton";
import FeatureCard from "./FeatureCard";
import StatItem from "./StatItem";
import ProductThumbnail from "./ProductThumbnail";

import { useImageError } from "../../../hooks/useImageError";
import { 
  HERO_FEATURES, 
  PRODUCT_THUMBNAILS, 
  STATS_DATA,
  ANIMATION_VARIANTS 
} from "../../../constants/heroConstants";

const HeroSection = () => {
  const { handleImageError, getImageSource } = useImageError();

  const renderSaleBadge = () => (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-full border border-brand-primary/20 backdrop-blur-sm">
      <ShoppingBag 
        className="w-4 h-4 text-brand-primary" 
        aria-hidden="true"
      />
      <span className="text-sm font-medium text-brand-primary">
        Summer Sale Live Now
      </span>
    </div>
  );

  const renderHeroTitle = () => (
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-text-primary leading-tight">
      Discover Your{" "}
      <span className="block text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text">
        Perfect Style
      </span>
    </h1>
  );

  const renderHeroDescription = () => (
    <p className="text-lg sm:text-xl text-brand-text-secondary max-w-lg leading-relaxed">
      Explore our curated collection of premium fashion. From everyday essentials to statement pieces, find exactly what you need.
    </p>
  );

  const renderActionButtons = () => (
    <div className="flex flex-col sm:flex-row gap-4">
      <AppButton className="text-lg px-8 py-4">
        Shop Now
        <ArrowRight className="w-5 h-5" aria-hidden="true" />
      </AppButton>
      <SecondaryButton className="text-lg px-8 py-4">
        View Collection
      </SecondaryButton>
    </div>
  );

  const renderFeatures = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
      {HERO_FEATURES.map((feature, index) => (
        <FeatureCard
          key={`feature-${index}`}
          icon={feature.icon}
          text={feature.text}
          subtext={feature.subtext}
        />
      ))}
    </div>
  );

  const renderStats = () => (
    <div className="flex items-center gap-8 pt-8">
      {STATS_DATA.map((stat, index) => (
        <StatItem
          key={`stat-${index}`}
          value={stat.value}
          label={stat.label}
          showDivider={index < STATS_DATA.length - 1}
        />
      ))}
    </div>
  );

  const renderDiscountBadge = () => (
    <motion.div
      className="absolute top-8 right-8 bg-white rounded-2xl shadow-xl p-4 border border-brand-gray-100 backdrop-blur-sm"
      whileHover={{ scale: 1.05, rotate: 2 }}
      transition={{ type: "spring", stiffness: 300 }}
      role="status"
      aria-label="30% discount today only"
    >
      <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text">
        30% OFF
      </p>
      <p className="text-brand-text-secondary text-sm">Today Only</p>
    </motion.div>
  );

  const renderRatingBadge = () => (
    <motion.div
      className="absolute bottom-8 left-8 bg-white rounded-2xl shadow-xl p-4 border border-brand-gray-100 backdrop-blur-sm"
      whileHover={{ scale: 1.05 }}
      role="status"
      aria-label="Customer rating 4.9 out of 5 stars"
    >
      <div className="flex items-center gap-2">
        <div className="flex" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star 
              key={`star-${index}`}
              className="w-4 h-4 fill-brand-accent text-brand-accent" 
            />
          ))}
        </div>
        <span className="text-brand-text-primary text-sm font-medium">
          4.9/5
        </span>
      </div>
    </motion.div>
  );

  const renderMainImage = () => (
    <div className="text-center space-y-4 p-8 relative z-10">
      <div className="w-64 h-64 mx-auto bg-white rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden border border-brand-gray-100">
        <img
          src={getImageSource(
            "main", 
            "/src/assets/images/hero/hero-section-1.webp", 
            "https://picsum.photos/300/300?fashion"
          )}
          alt="Featured collection 2024"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="eager"
          onError={(event) => {
            handleImageError("main", "https://picsum.photos/300/300?fashion");
            event.target.src = "https://picsum.photos/300/300?fashion";
          }}
        />
      </div>
      <p className="text-brand-text-secondary italic text-sm bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full inline-block">
        Trending Collection 2024
      </p>
    </div>
  );

  const renderThumbnails = () => (
    <div className="flex justify-center gap-4 mt-6">
      {PRODUCT_THUMBNAILS.map((product) => (
        <ProductThumbnail
          key={product.id}
          product={product}
          onImageError={handleImageError}
          getImageSource={getImageSource}
        />
      ))}
    </div>
  );

  return (
    <section 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden relative"
      aria-label="Hero section"
    >
      {/* Added Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-100 rounded-full opacity-50 blur-xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-100 rounded-full opacity-50 blur-xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-50 rounded-full opacity-30 blur-xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content Section */}
          <motion.div
            variants={ANIMATION_VARIANTS.container}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={ANIMATION_VARIANTS.item} className="space-y-4">
              {renderSaleBadge()}
              {renderHeroTitle()}
              {renderHeroDescription()}
            </motion.div>

            <motion.div variants={ANIMATION_VARIANTS.item}>
              {renderActionButtons()}
            </motion.div>

            <motion.div variants={ANIMATION_VARIANTS.item}>
              {renderFeatures()}
            </motion.div>

            <motion.div variants={ANIMATION_VARIANTS.item}>
              {renderStats()}
            </motion.div>
          </motion.div>

          {/* Right Image Section */}
          <motion.div 
            variants={ANIMATION_VARIANTS.image}
            initial="hidden" 
            animate="visible" 
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white to-blue-50/50 border border-blue-100">
              <div className="aspect-square flex items-center justify-center relative">
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-100/20 to-pink-100/20" 
                  aria-hidden="true"
                />
                <img
                  src="https://picsum.photos/600/600?grayscale&blur=2"
                  alt="Fashion texture background"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-soft-light opacity-20"
                  loading="lazy"
                  onError={(event) => {
                    event.target.src = "https://picsum.photos/600/600?grayscale&blur=2";
                  }}
                />
                {renderMainImage()}
                {renderDiscountBadge()}
                {renderRatingBadge()}
              </div>
            </div>
            {renderThumbnails()}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HeroSection);