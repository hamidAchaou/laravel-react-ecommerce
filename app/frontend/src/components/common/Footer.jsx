import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Heart,
  ArrowUp,
  Shield,
  Truck,
  HeadphonesIcon
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'New Arrivals', href: '/new-arrivals' },
        { name: 'Best Sellers', href: '/best-sellers' },
        { name: 'Traditional Carpets', href: '/carpets' },
        { name: 'Pottery & Ceramics', href: '/pottery' },
        { name: 'Leather Goods', href: '/leather' },
        { name: 'Jewelry', href: '/jewelry' }
      ]
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'Shipping Policy', href: '/shipping' },
        { name: 'Returns & Exchanges', href: '/returns' },
        { name: 'Size Guide', href: '/size-guide' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Track Order', href: '/track-order' }
      ]
    },
    {
      title: 'About Us',
      links: [
        { name: 'Our Story', href: '/about' },
        { name: 'Artisan Partners', href: '/artisans' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Press', href: '/press' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Policies',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Accessibility', href: '/accessibility' },
        { name: 'Modern Slavery Act', href: '/modern-slavery' },
        { name: 'Supplier Code', href: '/supplier-code' }
      ]
    }
  ];

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over $50'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% protected'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Dedicated support'
    },
    {
      icon: Heart,
      title: 'Authentic Crafts',
      description: 'Direct from artisans'
    }
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: 'https://facebook.com',
      name: 'Facebook'
    },
    {
      icon: Instagram,
      href: 'https://instagram.com',
      name: 'Instagram'
    },
    {
      icon: Twitter,
      href: 'https://twitter.com',
      name: 'Twitter'
    },
    {
      icon: Youtube,
      href: 'https://youtube.com',
      name: 'YouTube'
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-brand-dark to-brand-gray-900 text-white">
      {/* Features Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-brand-surface border-b border-brand-gray-200"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 text-center md:text-left"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-text-primary text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-brand-text-secondary text-xs">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12"
        >
          {/* Brand Column */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                MoroccanArtisans
              </h2>
              <p className="text-brand-gray-300 mt-2 text-sm leading-relaxed">
                Preserving centuries of Moroccan craftsmanship through authentic, 
                handcrafted products made by skilled artisans across the Kingdom.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-primary flex-shrink-0" />
                <span className="text-brand-gray-300 text-sm">
                  Artisan District, Medina, Marrakech, Morocco
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-primary flex-shrink-0" />
                <span className="text-brand-gray-300 text-sm">
                  +212 6 12 34 56 78
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-primary flex-shrink-0" />
                <span className="text-brand-gray-300 text-sm">
                  contact@moroccanartisans.com
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-brand-gray-800 rounded-full flex items-center justify-center hover:bg-brand-primary transition-all duration-300 group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4 text-brand-gray-300 group-hover:text-white" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="font-semibold text-white mb-4 text-lg">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      className="text-brand-gray-300 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block transform"
                      whileHover={{ x: 5 }}
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter Subscription */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-brand-gray-800"
        >
          <div className="max-w-md">
            <h3 className="font-semibold text-white mb-4">
              Stay Updated with Moroccan Crafts
            </h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-brand-gray-800 border border-brand-gray-700 rounded-lg text-white placeholder-brand-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
              <button className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200">
                Subscribe
              </button>
            </div>
            <p className="text-brand-gray-400 text-xs mt-2">
              Get updates on new collections and artisan stories
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t border-brand-gray-800 bg-brand-gray-900/50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-brand-gray-400 text-sm text-center md:text-left">
              <p>
                © {currentYear} MoroccanArtisans. Crafted with{' '}
                <Heart className="w-3 h-3 text-brand-primary inline" />{' '}
                in Morocco. All rights reserved.
              </p>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-brand-gray-400 text-sm">We accept:</span>
              <div className="flex gap-2">
                {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((method) => (
                  <div
                    key={method}
                    className="bg-brand-gray-800 px-3 py-1 rounded text-xs text-brand-gray-300"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>

            {/* Back to Top */}
            <motion.button
              onClick={scrollToTop}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white p-2 rounded-full transition-all duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Trust Seals */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-brand-gray-900 border-t border-brand-gray-800"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center items-center gap-6 text-brand-gray-400 text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-green-400" />
              <span>SSL Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-3 h-3 text-blue-400" />
              <span>Worldwide Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-3 h-3 text-red-400" />
              <span>Supporting Local Artisans</span>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default React.memo(Footer);