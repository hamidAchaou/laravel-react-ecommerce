import React from "react";
import { motion } from "framer-motion";

const ProductThumbnail = React.memo(({ 
  product, 
  onImageError, 
  getImageSource 
}) => {
  const { id, image, alt, fallback } = product;
  
  const handleError = (event) => {
    onImageError(id, fallback);
    event.target.src = fallback;
  };

  return (
    <motion.div
      className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
      whileHover={{ scale: 1.15, y: -5 }}
      whileTap={{ scale: 0.95 }}
      role="button"
      tabIndex={0}
      aria-label={`View ${alt}`}
    >
      <img
        src={getImageSource(id, image, fallback)}
        alt={alt}
        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        loading="lazy"
        onError={handleError}
      />
    </motion.div>
  );
});

ProductThumbnail.displayName = "ProductThumbnail";
export default ProductThumbnail;