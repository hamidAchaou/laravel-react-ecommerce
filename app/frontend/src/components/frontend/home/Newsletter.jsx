import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Gift, Shield, CheckCircle, Send } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const benefits = [
    {
      icon: Gift,
      title: 'Exclusive Offers',
      description: 'Get special discounts and early access to new collections'
    },
    {
      icon: Send,
      title: 'Latest Updates',
      description: 'Be the first to know about new arrivals and trends'
    },
    {
      icon: Shield,
      title: 'No Spam',
      description: 'We respect your privacy and only send valuable content'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with your actual newsletter service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically call your newsletter API
      // await api.post('/api/newsletter/subscribe', { email });
      
      setIsSubscribed(true);
      setEmail('');
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubscribed(false);
    setError('');
    setEmail('');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-brand-primary/5 via-brand-secondary/5 to-brand-accent/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Content */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Visual & Form */}
              <div className="bg-gradient-to-br from-brand-primary to-brand-secondary p-8 lg:p-12 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                </div>

                <motion.div
                  variants={itemVariants}
                  className="relative z-10 text-center lg:text-left"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full border border-white/30 mb-6">
                    <Mail className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">
                      Stay Connected
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Join Our
                    <span className="block">Community</span>
                  </h2>

                  <p className="text-white/90 text-lg mb-8 max-w-md">
                    Subscribe to our newsletter and never miss updates on new collections, exclusive offers, and traditional Moroccan crafts.
                  </p>

                  {/* Subscription Form */}
                  {!isSubscribed ? (
                    <motion.form
                      variants={itemVariants}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-brand-text-secondary" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                          disabled={isSubmitting}
                        />
                      </div>

                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-200 text-sm text-center lg:text-left"
                        >
                          {error}
                        </motion.p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-white text-brand-primary py-4 rounded-xl font-semibold hover:bg-brand-gray-50 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                            Subscribing...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Subscribe Now
                          </>
                        )}
                      </button>

                      <p className="text-white/70 text-xs text-center lg:text-left">
                        By subscribing, you agree to our Privacy Policy and consent to receive updates.
                      </p>
                    </motion.form>
                  ) : (
                    /* Success State */
                    <motion.div
                      variants={successVariants}
                      initial="hidden"
                      animate="visible"
                      className="text-center lg:text-left"
                    >
                      <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm border border-white/30">
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">Welcome Aboard!</h3>
                            <p className="text-white/90">You've successfully subscribed</p>
                          </div>
                        </div>
                        
                        <p className="text-white/80 text-sm mb-6">
                          Thank you for joining our community! We've sent a confirmation email to <strong>{email}</strong>.
                        </p>

                        <button
                          onClick={handleReset}
                          className="bg-white text-brand-primary py-3 px-6 rounded-xl font-semibold hover:bg-brand-gray-50 transition-all duration-200"
                        >
                          Subscribe Another Email
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Right Side - Benefits */}
              <div className="p-8 lg:p-12 bg-white">
                <motion.div
                  variants={itemVariants}
                  className="h-full flex flex-col justify-center"
                >
                  <h3 className="text-2xl font-bold text-brand-text-primary mb-8">
                    Why Subscribe?
                  </h3>

                  <div className="space-y-6">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="flex items-start gap-4 group"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <benefit.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-brand-text-primary mb-2 group-hover:text-brand-primary transition-colors duration-300">
                            {benefit.title}
                          </h4>
                          <p className="text-brand-text-secondary text-sm">
                            {benefit.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Stats */}
                  <motion.div
                    variants={itemVariants}
                    className="mt-8 pt-8 border-t border-brand-gray-200"
                  >
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-brand-primary">10K+</div>
                        <div className="text-xs text-brand-text-secondary">Subscribers</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-brand-secondary">24h</div>
                        <div className="text-xs text-brand-text-secondary">Quick Updates</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-brand-accent">0%</div>
                        <div className="text-xs text-brand-text-secondary">Spam</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <motion.div
            variants={itemVariants}
            className="mt-8 text-center"
          >
            <p className="text-brand-text-secondary text-sm">
              Trusted by artisans and craft lovers worldwide • 100% Privacy Protected • Easy Unsubscribe
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(Newsletter);