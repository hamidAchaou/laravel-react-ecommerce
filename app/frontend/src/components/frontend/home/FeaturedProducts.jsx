import React, { useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Star, ShoppingCart, Heart, Eye, Zap } from 'lucide-react';
import { fetchProducts } from '../../../features/products/productsThunks';
import AppButton from '../ui/Button/AppButton';
import ProductCard from '../ui/Card/ProductCard';

// Constants
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }
};

const FEATURED_PRODUCTS_COUNT = 8;

// Loading Skeleton Component
const ProductSkeleton = React.memo(() => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  </div>
));

ProductSkeleton.displayName = 'ProductSkeleton';

// Main Component
const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const featuredProducts = useMemo(() => 
    products.slice(0, FEATURED_PRODUCTS_COUNT),
    [products]
  );

  const handleAddToCart = useCallback((product) => {
    console.log('Added to cart:', product);
    // Implement cart logic
  }, []);

  const handleQuickView = useCallback((product) => {
    console.log('Quick view:', product);
    // Implement quick view modal
  }, []);

  const handleAddToWishlist = useCallback((product) => {
    console.log('Added to wishlist:', product);
    // Implement wishlist logic
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRetry={() => dispatch(fetchProducts())} />;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader />
        
        <motion.div
          variants={ANIMATION_VARIANTS.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </motion.div>

        <ViewAllButton show={featuredProducts.length > 0} />
        <EmptyState show={featuredProducts.length === 0 && !loading} />
      </div>
    </section>
  );
};

// Additional Components
const SectionHeader = React.memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mb-12"
  >
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full border border-red-200 mb-4">
      <Zap className="w-4 h-4 text-red-600" />
      <span className="text-sm font-medium text-red-600">
        Moroccan Artisans
      </span>
    </div>
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
      Handcrafted Treasures
    </h2>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
      Discover authentic Moroccan craftsmanship with our curated collection of traditional handmade products
    </p>
  </motion.div>
));

const LoadingState = React.memo(() => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <div className="h-8 bg-gray-200 rounded-lg w-48 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(FEATURED_PRODUCTS_COUNT)].map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    </div>
  </section>
));

const ErrorState = React.memo(({ onRetry }) => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4 text-center">
      <div className="text-red-600 text-lg mb-4">
        Failed to load products
      </div>
      <AppButton 
        onClick={onRetry}
        variant="primary"
      >
        Try Again
      </AppButton>
    </div>
  </section>
));

const ViewAllButton = React.memo(({ show }) => {
  if (!show) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="text-center mt-12"
    >
      <AppButton 
        variant="outline"
        size="lg"
      >
        View All Moroccan Crafts
      </AppButton>
    </motion.div>
  );
});

const EmptyState = React.memo(({ show }) => {
  if (!show) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <div className="text-gray-600 text-lg mb-4">
        No featured products available
      </div>
      <p className="text-gray-600">
        Check back later for new traditional crafts!
      </p>
    </motion.div>
  );
});

export default React.memo(FeaturedProducts);