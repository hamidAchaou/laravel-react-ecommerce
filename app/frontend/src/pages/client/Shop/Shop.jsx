import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../features/products/productsThunks";
import { clearError } from "../../../features/products/productsSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ShoppingCart, Grid3x3, Grid2x2, Star, AlertCircle, RefreshCw } from "lucide-react";

const Shop = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);
  
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(true);

  // Load products on mount
  useEffect(() => {
    dispatch(fetchProducts());
    return () => dispatch(clearError());
  }, [dispatch]);

  // Ensure products is always an array
  const safeProducts = useMemo(() => {
    if (!products) return [];
    if (Array.isArray(products)) return products;
    if (products.data && Array.isArray(products.data)) return products.data;
    return [];
  }, [products]);

  // Extract unique categories from products
  const categories = useMemo(() => {
    if (!safeProducts.length) return [];
    
    // Try multiple possible category field names
    const cats = safeProducts.map(p => {
      return p.category?.name || p.category_name || p.category || null;
    }).filter(Boolean);
    
    return [...new Set(cats)];
  }, [safeProducts]);

  // Get price range from products
  const productPriceRange = useMemo(() => {
    if (!safeProducts.length) return { min: 0, max: 10000 };
    
    const prices = safeProducts
      .map(p => parseFloat(p.price) || 0)
      .filter(p => p > 0);
    
    if (!prices.length) return { min: 0, max: 10000 };
    
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [safeProducts]);

  // Update price range when products load
  useEffect(() => {
    if (productPriceRange.max > 0 && priceRange.max === 10000) {
      setPriceRange(productPriceRange);
    }
  }, [productPriceRange]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!safeProducts.length) return [];
    
    let filtered = safeProducts.filter(product => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        product.title?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower);
      
      // Category filter
      const productCategory = product.category?.name || product.category_name || product.category;
      const matchesCategory = selectedCategories.length === 0 || 
                             selectedCategories.includes(productCategory);
      
      // Price filter
      const productPrice = parseFloat(product.price) || 0;
      const matchesPrice = productPrice >= priceRange.min && productPrice <= priceRange.max;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sorting
    switch(sortBy) {
      case "price-low":
        filtered.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        break;
      case "name":
        filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      default:
        break;
    }

    return filtered;
  }, [safeProducts, searchQuery, selectedCategories, priceRange, sortBy]);

  const toggleCategory = useCallback((category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategories([]);
    setPriceRange(productPriceRange);
    setSortBy("featured");
  }, [productPriceRange]);

  const handleRetry = useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Helper to get image URL
  const getImageUrl = useCallback((product) => {
    const imagePath = product.primary_image_url || 
                     product.images?.[0]?.image_path || 
                     product.image_path ||
                     "/placeholder.png";
    
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}/${imagePath.replace(/^\/+/, "")}`;
  }, [BASE_URL]);

  // Helper to get category name
  const getCategoryName = useCallback((product) => {
    return product.category?.name || product.category_name || product.category || null;
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-background">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-brand-primary border-r-transparent mb-6"></div>
          <p className="text-brand-text-primary text-xl font-semibold mb-2">Loading Products</p>
          <p className="text-brand-text-secondary text-sm">Fetching amazing products for you...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-background p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-brand-surface p-8 rounded-2xl shadow-xl max-w-lg w-full"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-error/10 rounded-full">
              <AlertCircle className="w-12 h-12 text-error" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-brand-text-primary mb-3 text-center">Oops! Something went wrong</h2>
          <p className="text-error text-center mb-6">{error}</p>
          <button 
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl hover:bg-opacity-90 transition-all font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Empty products state
  if (!safeProducts.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-background p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-brand-surface p-8 rounded-2xl shadow-xl max-w-lg w-full text-center"
        >
          <div className="text-7xl mb-6">🛍️</div>
          <h2 className="text-2xl font-bold text-brand-text-primary mb-3">No Products Available</h2>
          <p className="text-brand-text-secondary mb-6">
            We couldn't find any products at the moment. Please check back later!
          </p>
          
          <button 
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl hover:bg-opacity-90 transition-all font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh Products
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-background via-brand-surface to-brand-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-brand-surface/80 backdrop-blur-xl border-b border-brand-gray-200 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Title & Results */}
            <div className="flex items-center gap-4">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent"
              >
                Discover Products
              </motion.h1>
              <span className="px-3 py-1 bg-brand-accent/20 text-brand-accent rounded-full text-sm font-medium">
                {filteredProducts.length} items
              </span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-secondary w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-brand-surface border-2 border-brand-gray-200 rounded-full focus:border-brand-primary focus:outline-none transition-all text-brand-text-primary placeholder-brand-text-secondary"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-primary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-full hover:bg-opacity-90 transition-all"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              
              <div className="flex items-center gap-1 bg-brand-surface border border-brand-gray-200 rounded-full p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-full transition-all ${viewMode === "grid" ? "bg-brand-primary text-white" : "text-brand-text-secondary hover:bg-brand-gray-100"}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("large")}
                  className={`p-2 rounded-full transition-all ${viewMode === "large" ? "bg-brand-primary text-white" : "text-brand-text-secondary hover:bg-brand-gray-100"}`}
                >
                  <Grid2x2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:sticky lg:top-24 lg:h-fit w-full lg:w-80 flex-shrink-0"
              >
                <div className="bg-brand-surface rounded-2xl shadow-lg p-6 space-y-6">
                  {/* Filter Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-brand-text-primary flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5 text-brand-primary" />
                      Filters
                    </h2>
                    {(selectedCategories.length > 0 || searchQuery) && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-brand-primary hover:underline font-medium"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Sort By */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-brand-text-primary">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2 bg-brand-background border-2 border-brand-gray-200 rounded-lg focus:border-brand-primary focus:outline-none text-brand-text-primary"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>

                  {/* Categories */}
                  {categories.length > 0 && (
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-brand-text-primary">Categories</label>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {categories.map((category) => {
                          const count = safeProducts.filter(p => getCategoryName(p) === category).length;
                          return (
                            <label
                              key={category}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-background cursor-pointer transition-all group"
                            >
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(category)}
                                onChange={() => toggleCategory(category)}
                                className="w-5 h-5 text-brand-primary border-brand-gray-300 rounded focus:ring-2 focus:ring-brand-primary cursor-pointer"
                              />
                              <span className="text-brand-text-primary group-hover:text-brand-primary transition-colors flex-1">
                                {category}
                              </span>
                              <span className="text-xs text-brand-text-secondary bg-brand-gray-100 px-2 py-1 rounded-full">
                                {count}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Price Range */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-brand-text-primary">Price Range</label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                          className="w-full px-3 py-2 bg-brand-background border-2 border-brand-gray-200 rounded-lg focus:border-brand-primary focus:outline-none text-brand-text-primary"
                          placeholder="Min"
                        />
                        <span className="text-brand-text-secondary">—</span>
                        <input
                          type="number"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                          className="w-full px-3 py-2 bg-brand-background border-2 border-brand-gray-200 rounded-lg focus:border-brand-primary focus:outline-none text-brand-text-primary"
                          placeholder="Max"
                        />
                      </div>
                      <input
                        type="range"
                        min={productPriceRange.min}
                        max={productPriceRange.max}
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        className="w-full h-2 bg-brand-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                      />
                      <div className="flex justify-between text-xs text-brand-text-secondary">
                        <span>{productPriceRange.min} MAD</span>
                        <span>{productPriceRange.max} MAD</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-surface rounded-2xl shadow-lg p-12 text-center"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-brand-text-primary mb-2">No products found</h3>
                <p className="text-brand-text-secondary mb-6">Try adjusting your filters or search query</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-brand-primary text-white rounded-full hover:bg-opacity-90 transition-all"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => {
                    const imageUrl = getImageUrl(product);
                    const categoryName = getCategoryName(product);

                    return (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="group bg-brand-surface rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer"
                      >
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden bg-brand-gray-100">
                          <img
                            src={imageUrl}
                            alt={product.title || "Product"}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => (e.target.src = "/placeholder.png")}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Stock Badge */}
                          {product.stock !== undefined && product.stock <= 10 && (
                            <div className="absolute top-4 left-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                product.stock === 0 
                                  ? "bg-error text-white" 
                                  : "bg-warning text-white"
                              }`}>
                                {product.stock === 0 ? "Out of Stock" : `Only ${product.stock} left`}
                              </span>
                            </div>
                          )}
                          
                          {/* Quick Actions */}
                          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-brand-primary hover:text-white transition-all">
                              <Star className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-3">
                          {categoryName && (
                            <span className="inline-block px-3 py-1 bg-brand-accent/20 text-brand-accent rounded-full text-xs font-semibold">
                              {categoryName}
                            </span>
                          )}
                          
                          <h3 className="text-lg font-bold text-brand-text-primary group-hover:text-brand-primary transition-colors line-clamp-1">
                            {product.title || "Untitled Product"}
                          </h3>
                          
                          <p className="text-sm text-brand-text-secondary line-clamp-2 min-h-[40px]">
                            {product.description || "Discover this amazing product"}
                          </p>

                          <div className="flex items-center justify-between pt-3 border-t border-brand-gray-200">
                            <div>
                              <span className="text-2xl font-bold text-brand-primary">
                                {product.price ? parseFloat(product.price).toFixed(2) : "—"}
                              </span>
                              <span className="text-sm text-brand-text-secondary ml-1">MAD</span>
                            </div>
                            
                            <button 
                              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-full hover:shadow-lg hover:scale-105 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={product.stock === 0}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              {product.stock === 0 ? "Unavailable" : "Add"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Shop);