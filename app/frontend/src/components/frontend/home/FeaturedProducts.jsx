import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Star, ShoppingCart, Heart, Eye, Zap } from 'lucide-react';
import { fetchProducts } from '../../../features/products/productsThunks';

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Memoized featured products (first 8 products or all if less)
  const featuredProducts = useMemo(() => {
    return products.slice(0, 8);
  }, [products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -5 }
  };

  const imageHoverVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 }
  };

  // Get primary image from Laravel response
  const getPrimaryImage = (product) => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.is_primary === true);
      return primaryImage ? primaryImage.image_path : product.images[0].image_path;
    }
    // Fallback to category image or placeholder
    return product.category?.image_url || `https://picsum.photos/300/300?random=${product.id}`;
  };

  // Get all images for product
  const getAllImages = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images.map(img => img.image_path);
    }
    return [product.category?.image_url || `https://picsum.photos/300/300?random=${product.id}`];
  };

  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(price));
  };

  // Calculate discount percentage (example logic - you can adjust based on your data)
  const calculateDiscount = (product) => {
    // You can add logic here based on your product data
    // For example, if you have original_price field:
    // if (product.original_price && product.original_price > product.price) {
    //   return Math.round(((parseFloat(product.original_price) - parseFloat(product.price)) / parseFloat(product.original_price)) * 100);
    // }
    
    // Temporary example: 20% discount for products with ID > 10
    return product.id > 10 ? 20 : 0;
  };

  // Quick add to cart handler
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    console.log('Added to cart:', product);
    // Implement your cart logic here
  };

  // Quick view handler
  const handleQuickView = (product, e) => {
    e.stopPropagation();
    console.log('Quick view:', product);
    // Implement quick view modal here
  };

  // Add to wishlist handler
  const handleAddToWishlist = (product, e) => {
    e.stopPropagation();
    console.log('Added to wishlist:', product);
    // Implement wishlist logic here
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-brand-gray-200 rounded-lg w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-brand-gray-200 rounded w-32 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-brand-gray-200 rounded-lg h-64 mb-4"></div>
                <div className="h-4 bg-brand-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-brand-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="text-brand-error text-lg mb-4">
            Failed to load products
          </div>
          <button 
            onClick={() => dispatch(fetchProducts())}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-brand-background/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full border border-brand-primary/20 mb-4">
            <Zap className="w-4 h-4 text-brand-primary" />
            <span className="text-sm font-medium text-brand-primary">
              Moroccan Artisans
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-text-primary mb-4">
            Handcrafted Treasures
          </h2>
          <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto">
            Discover authentic Moroccan craftsmanship with our curated collection of traditional handmade products
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {featuredProducts.map((product) => {
            const discount = calculateDiscount(product);
            const primaryImage = getPrimaryImage(product);
            const allImages = getAllImages(product);

            return (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="group"
              >
                <motion.div
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  className="bg-white rounded-2xl shadow-sm border border-brand-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  {/* Product Image Container */}
                  <div className="relative overflow-hidden bg-brand-gray-50">
                    <motion.img
                      variants={imageHoverVariants}
                      initial="rest"
                      whileHover="hover"
                      src={primaryImage}
                      alt={product.images?.[0]?.alt_text || product.title}
                      className="w-full h-64 object-cover transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/300/300?random=${product.id}`;
                      }}
                    />
                    
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{discount}%
                      </div>
                    )}

                    {/* Image Gallery Indicator */}
                    {allImages.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        +{allImages.length - 1}
                      </div>
                    )}

                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex gap-2">
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className="bg-white text-brand-primary p-3 rounded-full shadow-lg hover:bg-brand-primary hover:text-white transition-all duration-200"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleQuickView(product, e)}
                          className="bg-white text-brand-text-primary p-3 rounded-full shadow-lg hover:bg-brand-text-primary hover:text-white transition-all duration-200"
                          title="Quick View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => handleAddToWishlist(product, e)}
                          className="bg-white text-brand-text-primary p-3 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-200"
                          title="Add to Wishlist"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="absolute bottom-3 left-3">
                      {product.stock > 0 ? (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          {product.stock} in stock
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Category */}
                    <div className="text-xs text-brand-text-secondary uppercase tracking-wide mb-1">
                      {product.category?.name || 'Traditional Moroccan'}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-brand-text-primary mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors duration-200 h-12">
                      {product.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-brand-text-secondary mb-3 line-clamp-2 h-10">
                      {product.description || 'Authentic Moroccan handcrafted product'}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= (product.rating || 4)
                                ? 'fill-brand-accent text-brand-accent'
                                : 'fill-brand-gray-200 text-brand-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-brand-text-secondary">
                        ({product.review_count || '0'})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-brand-primary">
                        {formatPrice(product.price)}
                      </span>
                      {discount > 0 && (
                        <span className="text-sm text-brand-text-secondary line-through">
                          {formatPrice(parseFloat(product.price) * 1.2)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={product.stock === 0}
                      className={`w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group/btn ${
                        product.stock === 0
                          ? 'bg-brand-gray-300 text-brand-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white'
                      }`}
                    >
                      <ShoppingCart className={`w-4 h-4 transition-transform duration-200 ${
                        product.stock > 0 ? 'group-hover/btn:scale-110' : ''
                      }`} />
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Button */}
        {featuredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <button className="border-2 border-brand-text-primary text-brand-text-primary px-8 py-4 rounded-xl font-medium hover:bg-brand-text-primary hover:text-white transition-all duration-300 text-lg">
              View All Moroccan Crafts
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {featuredProducts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-brand-text-secondary text-lg mb-4">
              No featured products available
            </div>
            <p className="text-brand-text-secondary">
              Check back later for new traditional crafts!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default React.memo(FeaturedProducts);