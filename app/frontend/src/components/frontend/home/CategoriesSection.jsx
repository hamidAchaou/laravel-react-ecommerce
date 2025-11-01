import React, { useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { fetchCategories } from '../../../features/categories/categoriesThunks';
import AppButton from '../ui/Button/AppButton';
import Card from '../ui/Card/Card';

// Constants
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.8
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }
};

const CARD_HOVER_VARIANTS = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -5 }
};

const IMAGE_HOVER_VARIANTS = {
  rest: { scale: 1 },
  hover: { scale: 1.1 }
};

// Image URL helper function
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // Construct full URL (adjust base URL as needed)
  return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/storage/${cleanPath}`;
};

// Loading Skeleton Component
const CategorySkeleton = React.memo(() => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-2xl h-48 mb-4"></div>
    <div className="h-6 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  </div>
));

CategorySkeleton.displayName = 'CategorySkeleton';

// Main Component
const CategoriesSection = () => {
  const dispatch = useDispatch();
  const { items: categories, loading, error } = useSelector(state => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter and organize categories - parent categories only
  const parentCategories = useMemo(() => 
    categories.filter(category => category.parent_id === null),
    [categories]
  );

  // Get subcategories for a parent category
  const getSubcategories = useCallback((parentId) => 
    categories.filter(category => category.parent_id === parentId),
    [categories]
  );

  // Handle category click
  const handleCategoryClick = useCallback((category) => {
    console.log('Category clicked:', category);
    // Navigate to category page or filter products
    // history.push(`/categories/${category.slug || category.id}`);
  }, []);

  // Handle subcategory click
  const handleSubcategoryClick = useCallback((subcategory, e) => {
    e.stopPropagation();
    console.log('Subcategory clicked:', subcategory);
    // Navigate to subcategory page
    // history.push(`/categories/${subcategory.slug || subcategory.id}`);
  }, []);

  // Get fallback image URL
  const getFallbackImage = useCallback((categoryId, categoryName) => {
    // You can use category name or ID to generate consistent fallback images
    const searchTerm = encodeURIComponent(categoryName || 'moroccan craft');
    return `https://picsum.photos/400/300?random=${categoryId}&category=${searchTerm}`;
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRetry={() => dispatch(fetchCategories())} />;
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {parentCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              subcategories={getSubcategories(category.id)}
              onCategoryClick={handleCategoryClick}
              onSubcategoryClick={handleSubcategoryClick}
              getFallbackImage={getFallbackImage}
            />
          ))}
        </motion.div>

        <ViewAllButton show={parentCategories.length > 0} />
        <EmptyState show={parentCategories.length === 0 && !loading} />
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
      <Sparkles className="w-4 h-4 text-red-600" />
      <span className="text-sm font-medium text-red-600">
        Moroccan Crafts
      </span>
    </div>
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
      Explore Our Collections
    </h2>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
      Discover the rich heritage of Moroccan craftsmanship through our carefully curated categories of traditional arts and crafts
    </p>
  </motion.div>
));

const CategoryCard = React.memo(({ 
  category, 
  subcategories, 
  onCategoryClick, 
  onSubcategoryClick,
  getFallbackImage
}) => {
  // Get the primary image or first image from the category
  const getCategoryImage = useCallback(() => {
    // Assuming your Laravel category model has:
    // - image_url (string) for single image
    // - OR media relationship for multiple images
    // - OR image relationship for single image
    
    if (category.image_url) {
      return getImageUrl(category.image_url);
    }
    
    if (category.media && category.media.length > 0) {
      // Find primary image or use first image
      const primaryMedia = category.media.find(media => media.is_primary) || category.media[0];
      return getImageUrl(primaryMedia.file_path || primaryMedia.url);
    }
    
    if (category.image) {
      return getImageUrl(category.image.file_path || category.image.url);
    }
    
    // Fallback to generated image based on category
    return getFallbackImage(category.id, category.name);
  }, [category, getFallbackImage]);

  const categoryImage = getCategoryImage();

  return (
    <motion.div variants={ANIMATION_VARIANTS.item} className="group">
      <motion.div
        variants={CARD_HOVER_VARIANTS}
        initial="rest"
        whileHover="hover"
      >
        <Card
          hoverable
          padding="none"
          className="overflow-hidden cursor-pointer h-full flex flex-col"
          onClick={() => onCategoryClick(category)}
        >
          {/* Category Image */}
          <div className="relative overflow-hidden bg-gray-50 h-48">
            <motion.img
              variants={IMAGE_HOVER_VARIANTS}
              initial="rest"
              whileHover="hover"
              src={categoryImage}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                // If image fails to load, use fallback
                e.target.src = getFallbackImage(category.id, category.name);
              }}
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
              <span className="text-white text-sm font-medium">
                Explore Collection
              </span>
              <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform duration-200" />
            </div>

            {/* Items Count Badge */}
            {subcategories.length > 0 && (
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium px-2 py-1 rounded-full">
                {subcategories.length} styles
              </div>
            )}
          </div>

          {/* Category Info */}
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-red-600 transition-colors duration-200">
                {category.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {category.description || 'Discover authentic Moroccan craftsmanship'}
              </p>
            </div>

            {/* Subcategories */}
            {subcategories.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {subcategories.slice(0, 3).map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={(e) => onSubcategoryClick(subcategory, e)}
                      className="inline-flex items-center gap-1 bg-gray-100 hover:bg-red-600 hover:text-white text-gray-700 text-xs px-3 py-1 rounded-full transition-all duration-200 group/sub"
                    >
                      <span>{subcategory.name}</span>
                      <ChevronRight className="w-3 h-3 transform group-hover/sub:translate-x-0.5 transition-transform duration-200" />
                    </button>
                  ))}
                  {subcategories.length > 3 && (
                    <span className="text-gray-600 text-xs px-2 py-1">
                      +{subcategories.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* View Button */}
            <AppButton
              onClick={(e) => {
                e.stopPropagation();
                onCategoryClick(category);
              }}
              variant="primary"
              fullWidth
              size="md"
              endIcon={<ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-200" />}
              className="mt-4 group/btn"
            >
              Explore {category.name}
            </AppButton>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
});

CategoryCard.displayName = 'CategoryCard';

const LoadingState = React.memo(() => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <div className="h-8 bg-gray-200 rounded-lg w-48 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <CategorySkeleton key={index} />
        ))}
      </div>
    </div>
  </section>
));

const ErrorState = React.memo(({ onRetry }) => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4 text-center">
      <div className="text-red-600 text-lg mb-4">
        Failed to load categories
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
        View All Categories
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
        No categories available
      </div>
      <p className="text-gray-600">
        Categories will appear here once they are added to the system.
      </p>
    </motion.div>
  );
});

export default React.memo(CategoriesSection);