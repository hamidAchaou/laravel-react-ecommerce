// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Play,
  Star,
  Shield,
  Truck,
  HeadphonesIcon,
  Award,
  Users,
  Globe,
  ShoppingBag,
  Package,
  Heart,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { fetchProducts } from "../../../features/products/productsThunks";
import { fetchCategories } from "../../../features/categories/categoriesThunks";

export default function Home() {
  const dispatch = useDispatch();
  const { items: products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { items: categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Hero carousel data
  const heroSlides = [
    {
      id: 1,
      title: "Moroccan Artisan Heritage",
      subtitle: "Discover Centuries of Craftsmanship",
      description:
        "Handcrafted treasures from the heart of Morocco, blending traditional techniques with contemporary design",
      image: "https://picsum.photos/200",
      color: "from-purple-600 via-pink-600 to-rose-600",
      buttonText: "Explore Collection",
      badge: "Featured",
    },
    {
      id: 2,
      title: "Sustainable Craftsmanship",
      subtitle: "Eco-Friendly Artisan Products",
      description:
        "Each piece tells a story of sustainability and ethical production practices",
      image: "https://picsum.photos/200/300",
      color: "from-emerald-600 via-teal-600 to-cyan-600",
      buttonText: "Learn More",
      badge: "Eco",
    },
    {
      id: 3,
      title: "Limited Edition Collection",
      subtitle: "Exclusive Handmade Pieces",
      description:
        "Unique creations available in limited quantities, crafted by master artisans",
      image: "https://picsum.photos/200",
      color: "from-amber-600 via-orange-600 to-red-600",
      buttonText: "Shop Now",
      badge: "Limited",
    },
  ];

  // Features data
  const features = [
    {
      icon: Shield,
      title: "Authentic Quality",
      description:
        "Every product verified for authenticity and craftsmanship standards",
      color: "text-blue-600",
    },
    {
      icon: Truck,
      title: "Global Shipping",
      description: "Free worldwide shipping on orders over $100",
      color: "text-green-600",
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Dedicated customer service for all your needs",
      color: "text-purple-600",
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized for excellence in artisan craftsmanship",
      color: "text-amber-600",
    },
  ];

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Process featured products when products load
  useEffect(() => {
    if (products.length > 0) {
      // Get 4 featured products (you can add a 'featured' flag to your products)
      const featured = products.slice(0, 4).map((product) => ({
        ...product,
        image: product.images?.[0]?.image_path || "/api/placeholder/400/400",
        price: parseFloat(product.price) || 0,
      }));
      setFeaturedProducts(featured);
    }
  }, [products]);

  // Process categories for display
  const displayCategories = categories.slice(0, 4).map((category) => ({
    ...category,
    image: category.image_url || "/api/placeholder/400/300",
    products: `${Math.floor(Math.random() * 100) + 50}+ Items`, // Fallback count
    color: getCategoryColor(category.name),
  }));

  // Auto-advance carousel
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, heroSlides.length]);

  // Helper function to get category colors
  function getCategoryColor(categoryName) {
    const colorMap = {
      "Textiles & Weaving": "from-purple-500 to-pink-500",
      "Pottery & Ceramics": "from-amber-500 to-orange-500",
      "Jewelry & Accessories": "from-blue-500 to-cyan-500",
      Leatherwork: "from-emerald-500 to-green-500",
      Woodwork: "from-yellow-500 to-red-500",
      Metalwork: "from-gray-500 to-blue-400",
      "Traditional Clothing": "from-red-500 to-rose-500",
    };

    const matchedKey = Object.keys(colorMap).find((key) =>
      categoryName.toLowerCase().includes(key.toLowerCase().split(" ")[0])
    );

    return colorMap[matchedKey] || "from-gray-500 to-slate-500";
  }

  // Get product image
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const primaryImage =
        product.images.find((img) => img.is_primary) || product.images[0];
      return primaryImage.image_path || primaryImage.url;
    }
    return "/api/placeholder/400/400";
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-40 right-20 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/3 w-48 h-48 bg-amber-200/20 rounded-full blur-2xl"
        />
      </div>

      {/* Hero Carousel Section */}
      <section className="relative h-screen min-h-[100vh] overflow-hidden">
        <AnimatePresence mode="wait">
          {heroSlides.map(
            (slide, index) =>
              index === currentSlide && (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute inset-0 h-[100vh] w-full"
                >
                  {/* Background Image with Overlay */}
                  <div className="absolute inset-0 h-[100vh] w-full">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-80 mix-blend-multiply`}
                    />
                    <div className="absolute inset-0 bg-black/25" />
                  </div>

                  {/* Content */}
                  <div className="relative h-[100vh] flex flex-col items-center justify-center text-center px-6">
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="max-w-5xl mx-auto text-white"
                    >
                      {/* Badge */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, type: "spring" }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6"
                      >
                        <Sparkles className="h-4 w-4" />
                        {slide.badge}
                      </motion.div>

                      {/* Title */}
                      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight drop-shadow-lg">
                        {slide.title}
                      </h1>

                      {/* Subtitle */}
                      <p className="text-xl md:text-2xl font-light mb-6 opacity-90">
                        {slide.subtitle}
                      </p>

                      {/* Description */}
                      <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-80 leading-relaxed">
                        {slide.description}
                      </p>

                      {/* CTA Buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                      >
                        <Link
                          to="/shop"
                          className="group px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
                        >
                          <span>{slide.buttonText}</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="group px-8 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center gap-3">
                          <Play className="h-5 w-5" />
                          <span>Watch Story</span>
                        </button>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>

        {/* Carousel Controls */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-20">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            {isPlaying ? (
              <div className="w-3 h-3 bg-white rounded-sm" />
            ) : (
              <Play className="h-4 w-4 text-white" />
            )}
          </button>

          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 right-8"
        >
          <div className="text-white text-sm font-medium rotate-90 origin-center whitespace-nowrap">
            Scroll to explore ↓
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Why Choose AtlasCraft?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to bringing you the finest Moroccan craftsmanship
              with modern convenience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-500 cursor-pointer"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center mb-6`}
                >
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="relative py-20 px-4 bg-gradient-to-br from-gray-50 to-purple-50/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Handpicked selections from our artisan collection
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 transition-all duration-500 cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={getProductImage(product)}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all duration-300">
                      <Heart className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description ||
                        "Traditional Moroccan craftsmanship"}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors text-sm">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12"
            >
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>View All Products</span>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Categories Showcase */}
      {displayCategories.length > 0 && (
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Explore Categories
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Dive into our curated collections of Moroccan artisan products
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 mix-blend-multiply`}
                    />

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-2">
                        {category.name}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {category.products}
                      </p>

                      {/* CTA Arrow */}
                      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <ArrowRight className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12"
            >
              <Link
                to="/categories"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <span>View All Categories</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                number: "10K+",
                label: "Happy Customers",
                color: "text-blue-600",
              },
              {
                icon: Award,
                number: "500+",
                label: "Artisan Partners",
                color: "text-green-600",
              },
              {
                icon: Globe,
                number: "50+",
                label: "Countries Served",
                color: "text-purple-600",
              },
              {
                icon: Star,
                number: "4.9/5",
                label: "Customer Rating",
                color: "text-amber-600",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Discover Moroccan Magic?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of customers who have brought authentic Moroccan
              craftsmanship into their homes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Start Shopping</span>
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span>Our Story</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Loading States */}
      {(productsLoading || categoriesLoading) && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full"
          />
        </div>
      )}
    </div>
  );
}
