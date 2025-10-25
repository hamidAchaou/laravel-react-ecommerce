import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authThunks";
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Settings, 
  ChevronDown,
  Menu,
  X,
  Home,
  Shield,
  Package,
  BarChart3,
  Trash2,
  Plus,
  Minus,
  ArrowRight
} from "lucide-react";

// Navigation configuration
const NAVIGATION_ITEMS = {
  common: [
    { path: "/", label: "Home", icon: Home },
    { path: "/shop", label: "Shop", icon: Package }
  ],
  client: [
    { path: "/orders", label: "Orders", icon: Package }
  ],
  admin: [
    { path: "/admin", label: "Dashboard", icon: BarChart3 },
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/orders", label: "Orders", icon: Package },
    { path: "/admin/users", label: "Users", icon: User }
  ]
};

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: cartItems = [] } = useSelector((state) => state.cart || { items: [] });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const cartDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target)) {
        setIsCartDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCartDropdownOpen(false);
  }, [location.pathname]);

  // Calculate cart totals
  const cartSummary = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
    return { totalItems, totalPrice };
  }, [cartItems]);

  // Memoized navigation items based on user role
  const navigationItems = useMemo(() => {
    const items = [...NAVIGATION_ITEMS.common];
    
    if (isAuthenticated && user) {
      if (user.role === "client") {
        items.push(...NAVIGATION_ITEMS.client);
      } else if (user.role === "admin") {
        items.push(...NAVIGATION_ITEMS.admin);
      }
    }
    
    return items;
  }, [isAuthenticated, user]);

  // Optimized handlers
  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [dispatch, navigate]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
    setIsCartDropdownOpen(false);
  }, []);

  const toggleUserDropdown = useCallback(() => {
    setIsUserDropdownOpen(prev => !prev);
  }, []);

  const toggleCartDropdown = useCallback(() => {
    setIsCartDropdownOpen(prev => !prev);
  }, []);

  const getUserInitials = useCallback(() => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user]);

  const getUserDisplayName = useCallback(() => {
    if (!user?.name) return "User";
    return user.name.split(" ")[0];
  }, [user]);

  // Active link style
  const getNavLinkClass = useCallback((isActive) => 
    `relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium group ${
      isActive 
        ? "bg-white text-brand-primary shadow-lg shadow-white/20" 
        : "text-white/90 hover:bg-white/10 hover:text-white hover:shadow-md"
    }`, []);

  return (
    <>
      {/* Navigation Bar */}
      <nav 
        className="bg-gradient-to-r from-brand-primary via-brand-primary/95 to-brand-secondary shadow-2xl sticky top-0 z-50 backdrop-blur-sm border-b border-white/10"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo/Brand */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
              aria-label="Go to homepage"
            >
              <div className="relative p-2.5 bg-white rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Shield className="h-7 w-7 text-brand-primary" />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white tracking-tight block leading-none">
                  MyStore
                </span>
                <span className="text-xs text-white/70 font-medium">Premium Shopping</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => getNavLinkClass(isActive)}
                    aria-current={location.pathname === item.path ? "page" : undefined}
                  >
                    <IconComponent className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Cart Dropdown */}
              <div className="relative" ref={cartDropdownRef}>
                <button
                  onClick={toggleCartDropdown}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 hover:shadow-md group"
                  aria-expanded={isCartDropdownOpen}
                  aria-label={`Shopping cart with ${cartSummary.totalItems} items`}
                >
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    {cartSummary.totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-brand-accent text-brand-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                        {cartSummary.totalItems > 9 ? '9+' : cartSummary.totalItems}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">Cart</span>
                </button>

                {/* Cart Dropdown Menu */}
                {isCartDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    role="menu"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-brand-primary to-brand-secondary px-6 py-4">
                      <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Shopping Cart
                      </h3>
                      <p className="text-white/80 text-sm mt-1">
                        {cartSummary.totalItems} {cartSummary.totalItems === 1 ? 'item' : 'items'}
                      </p>
                    </div>

                    {/* Cart Items */}
                    <div className="max-h-96 overflow-y-auto">
                      {cartItems.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart className="h-10 w-10 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium mb-2">Your cart is empty</p>
                          <p className="text-gray-400 text-sm mb-4">Add items to get started</p>
                          <Link
                            to="/shop"
                            onClick={() => setIsCartDropdownOpen(false)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
                          >
                            Start Shopping
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {cartItems.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors group">
                              <div className="flex gap-4">
                                {/* Product Image */}
                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                  {item.image ? (
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 truncate mb-1">
                                    {item.name || 'Product'}
                                  </h4>
                                  <p className="text-brand-primary font-bold text-lg">
                                    ${(item.price || 0).toFixed(2)}
                                  </p>
                                  
                                  {/* Quantity Controls */}
                                  <div className="flex items-center gap-2 mt-2">
                                    <button className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                                      <Minus className="h-3 w-3 text-gray-600" />
                                    </button>
                                    <span className="w-10 text-center font-semibold text-gray-700">
                                      {item.quantity || 0}
                                    </span>
                                    <button className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                                      <Plus className="h-3 w-3 text-gray-600" />
                                    </button>
                                    <button className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-600 font-medium">Subtotal</span>
                          <span className="text-2xl font-bold text-gray-900">
                            ${cartSummary.totalPrice.toFixed(2)}
                          </span>
                        </div>
                        <Link
                          to="/cart"
                          onClick={() => setIsCartDropdownOpen(false)}
                          className="block w-full text-center px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                        >
                          View Cart & Checkout
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Section */}
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-2.5 text-white bg-white/10 backdrop-blur-sm rounded-xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/20 hover:shadow-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2.5 bg-white text-brand-primary rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                /* User Dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 group border border-white/20 hover:border-white/30"
                    aria-expanded={isUserDropdownOpen}
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                      {getUserInitials()}
                    </div>
                    <span className="font-medium max-w-32 truncate">
                      {getUserDisplayName()}
                    </span>
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isUserDropdownOpen ? "rotate-180" : ""
                      }`} 
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                      role="menu"
                    >
                      {/* User Info */}
                      <div className="bg-gradient-to-br from-brand-primary to-brand-secondary px-6 py-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                            {getUserInitials()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate">
                              {user?.name}
                            </p>
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white capitalize mt-1">
                              {user?.role}
                            </span>
                          </div>
                        </div>
                        <p className="text-white/80 text-sm truncate">
                          {user?.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                        >
                          <User className="h-5 w-5 text-gray-400 group-hover:text-brand-primary transition-colors" />
                          <span className="font-medium">My Profile</span>
                        </Link>
                        
                        {user?.role === "admin" && (
                          <Link
                            to="/admin/settings"
                            className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                          >
                            <Settings className="h-5 w-5 text-gray-400 group-hover:text-brand-primary transition-colors" />
                            <span className="font-medium">Settings</span>
                          </Link>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-6 py-3 text-red-600 hover:bg-red-50 transition-colors group"
                        >
                          <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2.5 rounded-xl text-white hover:bg-white/10 transition-all duration-300 border border-white/20"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl"
          >
            <div className="px-4 py-6 space-y-3 max-h-[calc(100vh-5rem)] overflow-y-auto">
              {/* Navigation Links */}
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-brand-primary text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}

              {/* Mobile Cart */}
              <Link
                to="/cart"
                className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-medium">Cart</span>
                </div>
                {cartSummary.totalItems > 0 && (
                  <span className="bg-brand-primary text-white text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {cartSummary.totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Auth */}
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      className="block w-full text-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center px-4 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-semibold shadow-lg"
                    >
                      Get Started
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl shadow-lg">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                        {getUserInitials()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">
                          {user?.name}
                        </p>
                        <p className="text-white/80 text-sm truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">My Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-24 focus:left-4 bg-brand-primary text-white px-6 py-3 rounded-xl z-50 font-semibold shadow-xl"
      >
        Skip to main content
      </a>
    </>
  );
}