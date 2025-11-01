// app/frontend/src/components/frontend/ui/Card/ProductCard.jsx
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import Card from './Card';
import AppButton from '../Button/AppButton';

const ProductCard = React.forwardRef(({
  product,
  onAddToCart,
  onQuickView,
  onAddToWishlist,
  className = '',
  ...props
}, ref) => {
  const {
    id,
    title,
    price,
    images = [],
    category,
    stock = 0,
    rating = 4,
    review_count = 0,
    description
  } = product;

  const primaryImage = images.find(img => img.is_primary)?.image_path || images[0]?.image_path;
  const discount = id > 10 ? 20 : 0;

  const handleAddToCart = useCallback((e) => {
    e.stopPropagation();
    onAddToCart?.(product);
  }, [product, onAddToCart]);

  const handleQuickView = useCallback((e) => {
    e.stopPropagation();
    onQuickView?.(product);
  }, [product, onQuickView]);

  const handleAddToWishlist = useCallback((e) => {
    e.stopPropagation();
    onAddToWishlist?.(product);
  }, [product, onAddToWishlist]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(price));
  };

  return (
    <Card
      ref={ref}
      hoverable
      padding="none"
      className={`overflow-hidden group ${className}`}
      {...props}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden bg-gray-50">
        <motion.img
          src={primaryImage}
          alt={title}
          className="w-full h-64 object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
          onError={(e) => {
            e.target.src = `https://picsum.photos/300/300?random=${id}`;
          }}
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex gap-2">
            <button
              onClick={handleQuickView}
              className="bg-white text-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-900 hover:text-white transition-all duration-200"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              onClick={handleAddToWishlist}
              className="bg-white text-gray-700 p-3 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-200"
              title="Add to Wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stock Status */}
        <div className="absolute bottom-3 left-3">
          {stock > 0 ? (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              In Stock
            </span>
          ) : (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">
          {category?.name || 'Traditional Moroccan'}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors duration-200 h-12">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
          {description || 'Authentic Moroccan handcrafted product'}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${
                  star <= rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({review_count})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-red-600">
            {formatPrice(price)}
          </span>
          {discount > 0 && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(parseFloat(price) * 1.2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <AppButton
          onClick={handleAddToCart}
          disabled={stock === 0}
          fullWidth
          size="md"
          startIcon={<ShoppingCart className="w-4 h-4" />}
        >
          {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </AppButton>
      </div>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;