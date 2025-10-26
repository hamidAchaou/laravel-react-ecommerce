// src/pages/client/Categories/Categories.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../features/categories/categoriesThunks";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Compass, 
  Palette,
  Gem,
  Shirt,
  Hammer,
  Leaf,
  Zap,
  ArrowRight,
  Play,
  Pause,
  Grid3x3,
  Hexagon
} from "lucide-react";

const Categories = () => {
  const dispatch = useDispatch();
  const { items: categories, loading, error } = useSelector(
    (state) => state.categories
  );

  const [activeCategory, setActiveCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Category icons with colors
  const categoryConfig = {
    "Textiles & Weaving": { icon: Shirt, color: "from-purple-500 to-pink-500", bg: "bg-purple-50", text: "text-purple-700" },
    "Pottery & Ceramics": { icon: Palette, color: "from-amber-500 to-orange-500", bg: "bg-amber-50", text: "text-amber-700" },
    "Jewelry & Accessories": { icon: Gem, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50", text: "text-blue-700" },
    "Leatherwork": { icon: Leaf, color: "from-emerald-500 to-green-500", bg: "bg-emerald-50", text: "text-emerald-700" },
    "Woodwork": { icon: Hammer, color: "from-brown-500 to-amber-700", bg: "bg-amber-50", text: "text-brown-700" },
    "Metalwork": { icon: Zap, color: "from-gray-600 to-blue-400", bg: "bg-gray-50", text: "text-gray-700" },
    "Traditional Clothing": { icon: Shirt, color: "from-red-500 to-rose-500", bg: "bg-rose-50", text: "text-rose-700" }
  };

  const getCategoryConfig = (categoryName) => {
    const matchedKey = Object.keys(categoryConfig).find(key => 
      categoryName.toLowerCase().includes(key.toLowerCase().split(' ')[0])
    );
    return categoryConfig[matchedKey] || { 
      icon: Sparkles, 
      color: "from-gray-500 to-slate-500", 
      bg: "bg-gray-50", 
      text: "text-gray-700" 
    };
  };

  // Floating animation variants
  const floatVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Grid animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotateY: 90 
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const featuredCategories = categories.slice(0, 4);
  const otherCategories = categories.slice(4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30">
      {/* SEO */}
      <Helmet>
        <title>Artisan Categories | AtlasCraft - Moroccan Heritage</title>
        <meta
          name="description"
          content="Immerse yourself in Moroccan craftsmanship. Explore our artisan categories featuring traditional textiles, pottery, jewelry, and heritage crafts."
        />
      </Helmet>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-amber-200/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Header Section */}
      <div className="relative pt-20 pb-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Badge */}
          <motion.div
            variants={floatVariants}
            animate="float"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-8"
          >
            <Compass className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-semibold text-gray-700">Explore Moroccan Heritage</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Artisan Worlds
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Journey through the rich tapestry of Moroccan craftsmanship. 
            Each category is a gateway to centuries of tradition and artistry.
          </p>
        </motion.div>
      </div>

      {/* Featured Categories - Circular Layout */}
      {!loading && featuredCategories.length > 0 && (
        <section className="relative py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Crafts</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
            </motion.div>

            <div className="relative h-96 md:h-[500px] flex items-center justify-center">
              {featuredCategories.map((category, index) => {
                const { icon: Icon, color, bg, text } = getCategoryConfig(category.name);
                const angle = (index / featuredCategories.length) * 2 * Math.PI;
                const radius = 160;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: x,
                      y: y
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 100,
                      delay: index * 0.2,
                      duration: 1 
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      z: 20
                    }}
                    className={`absolute cursor-pointer group ${
                      activeCategory === category.id ? 'z-10' : ''
                    }`}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                  >
                    {/* Category Orb */}
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${color} shadow-2xl group-hover:shadow-3xl transition-all duration-500 flex items-center justify-center relative overflow-hidden`}>
                      <Icon className="h-8 w-8 text-white" />
                      
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent transform rotate-45 translate-x-12 group-hover:translate-x-24 transition-transform duration-700"></div>
                    </div>

                    {/* Label */}
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-4 px-3 py-1 rounded-full ${bg} ${text} text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap`}>
                      {category.name}
                    </div>
                  </motion.div>
                );
              })}

              {/* Center Element */}
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 1 }}
                className="absolute w-32 h-32 bg-white/80 backdrop-blur-sm rounded-full shadow-2xl border border-white/40 flex items-center justify-center"
              >
                <div className="text-center">
                  <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <span className="text-sm font-bold text-gray-700">Explore</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* All Categories - Hexagonal Grid */}
      {!loading && otherCategories.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">All Craft Categories</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Discover the full spectrum of Moroccan artisan traditions
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {otherCategories.map((category, index) => {
                const { icon: Icon, color, bg, text } = getCategoryConfig(category.name);
                
                return (
                  <motion.div
                    key={category.id}
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.05,
                      rotateZ: [0, -2, 2, 0],
                      transition: { duration: 0.3 }
                    }}
                    className="group cursor-pointer"
                  >
                    {/* Hexagon Card */}
                    <div className="relative h-48 bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500">
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                      
                      {/* Content */}
                      <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                        {/* Icon */}
                        <div className={`w-16 h-16 rounded-2xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`h-8 w-8 ${text}`} />
                        </div>
                        
                        {/* Title */}
                        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
                          {category.name}
                        </h3>
                        
                        {/* Description Preview */}
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {category.description?.substring(0, 60) || "Traditional Moroccan craftsmanship"}
                        </p>
                        
                        {/* Hover Arrow */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      {/* Corner Accent */}
                      <div className={`absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-2xl`}></div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* Active Category Detail Panel */}
      {activeCategory && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed inset-x-6 bottom-6 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 z-50 max-w-4xl mx-auto p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {categories.find(c => c.id === activeCategory)?.name}
            </h3>
            <button
              onClick={() => setActiveCategory(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600">
            {categories.find(c => c.id === activeCategory)?.description || 
             "Explore the rich tradition and craftsmanship of this category."}
          </p>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity }
            }}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4"
          >
            <Compass className="h-8 w-8 text-white" />
          </motion.div>
          <p className="text-gray-600 font-medium">Discovering artisan categories...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-8 text-center my-16"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Lost</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchCategories())}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !error && categories.length === 0 && (
        <div className="text-center py-32">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Compass className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Categories Yet</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Our artisan categories are being prepared. Check back soon to explore Moroccan craftsmanship.
          </p>
        </div>
      )}

      {/* Floating Controls */}
      <div className="fixed bottom-8 right-8 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </motion.button>
      </div>
    </div>
  );
};

export default Categories;