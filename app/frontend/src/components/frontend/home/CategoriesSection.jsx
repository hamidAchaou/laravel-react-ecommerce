import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { fetchCategories } from '../../../features/categories/categoriesThunks';

const CategoriesSection = () => {
  const dispatch = useDispatch();
  const { items: categories, loading, error } = useSelector(state => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter and organize categories - parent categories only
  const parentCategories = useMemo(() => {
    return categories.filter(category => category.parent_id === null);
  }, [categories]);

  // Get subcategories for a parent category
  const getSubcategories = (parentId) => {
    return categories.filter(category => category.parent_id === parentId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -5 }
  };

  const imageHoverVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 }
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
    // Navigate to category page or filter products
    // history.push(`/categories/${category.id}`);
  };

  // Handle subcategory click
  const handleSubcategoryClick = (subcategory, e) => {
    e.stopPropagation();
    console.log('Subcategory clicked:', subcategory);
    // Navigate to subcategory page
    // history.push(`/categories/${subcategory.id}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-brand-gray-200 rounded-lg w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-brand-gray-200 rounded w-32 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-brand-gray-200 rounded-2xl h-64 mb-4"></div>
                <div className="h-6 bg-brand-gray-200 rounded mb-2"></div>
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
            Failed to load categories
          </div>
          <button 
            onClick={() => dispatch(fetchCategories())}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-brand-background/20">
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
            <Sparkles className="w-4 h-4 text-brand-primary" />
            <span className="text-sm font-medium text-brand-primary">
              Moroccan Crafts
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-text-primary mb-4">
            Explore Our Collections
          </h2>
          <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto">
            Discover the rich heritage of Moroccan craftsmanship through our carefully curated categories of traditional arts and crafts
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {parentCategories.map((category) => {
            const subcategories = getSubcategories(category.id);
            
            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                className="group"
              >
                <motion.div
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  onClick={() => handleCategoryClick(category)}
                  className="bg-white rounded-2xl shadow-sm border border-brand-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
                >
                  {/* Category Image */}
                  <div className="relative overflow-hidden bg-brand-gray-50 h-48">
                    <motion.img
                      variants={imageHoverVariants}
                      initial="rest"
                      whileHover="hover"
                      src={category.image_url || `https://picsum.photos/400/300?random=${category.id}`}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/400/300?random=${category.id}`;
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
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-brand-text-primary text-xs font-medium px-2 py-1 rounded-full">
                        {subcategories.length} styles
                      </div>
                    )}
                  </div>

                  {/* Category Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-bold text-brand-text-primary text-xl mb-2 group-hover:text-brand-primary transition-colors duration-200">
                        {category.name}
                      </h3>
                      <p className="text-brand-text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
                        {category.description || 'Discover authentic Moroccan craftsmanship'}
                      </p>
                    </div>

                    {/* Subcategories */}
                    {subcategories.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-brand-gray-100">
                        <div className="flex flex-wrap gap-2">
                          {subcategories.slice(0, 3).map((subcategory) => (
                            <button
                              key={subcategory.id}
                              onClick={(e) => handleSubcategoryClick(subcategory, e)}
                              className="inline-flex items-center gap-1 bg-brand-gray-100 hover:bg-brand-primary hover:text-white text-brand-text-secondary text-xs px-3 py-1 rounded-full transition-all duration-200 group/sub"
                            >
                              <span>{subcategory.name}</span>
                              <ChevronRight className="w-3 h-3 transform group-hover/sub:translate-x-0.5 transition-transform duration-200" />
                            </button>
                          ))}
                          {subcategories.length > 3 && (
                            <span className="text-brand-text-secondary text-xs px-2 py-1">
                              +{subcategories.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* View Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category);
                      }}
                      className="mt-4 w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                    >
                      Explore {category.name}
                      <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Categories Button */}
        {parentCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <button className="border-2 border-brand-text-primary text-brand-text-primary px-8 py-4 rounded-xl font-medium hover:bg-brand-text-primary hover:text-white transition-all duration-300 text-lg">
              View All Categories
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {parentCategories.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-brand-text-secondary text-lg mb-4">
              No categories available
            </div>
            <p className="text-brand-text-secondary">
              Categories will appear here once they are added to the system.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default React.memo(CategoriesSection);