// src/constants/heroConstants.js
import { Truck, Shield, Star } from "lucide-react";

export const HERO_FEATURES = [
  { 
    icon: Truck, 
    text: "Free Shipping", 
    subtext: "On orders over $50" 
  },
  { 
    icon: Shield, 
    text: "Secure Payment", 
    subtext: "100% protected" 
  },
  { 
    icon: Star, 
    text: "Premium Quality", 
    subtext: "Guaranteed" 
  },
];

export const PRODUCT_THUMBNAILS = [
  {
    id: "thumb-1",
    image: "/src/assets/images/hero/hero-section-1.webp",
    alt: "Featured Collection",
    fallback: "https://picsum.photos/200/200?fashion&1",
  },
  {
    id: "thumb-2",
    image: "/src/assets/images/hero/hero-section-2.webp",
    alt: "New Arrivals",
    fallback: "https://picsum.photos/200/200?fashion&2",
  },
  {
    id: "thumb-3", 
    image: "/src/assets/images/hero/hero-section-3.webp",
    alt: "Summer Styles",
    fallback: "https://picsum.photos/200/200?fashion&3",
  },
  {
    id: "thumb-4",
    image: "/src/assets/images/hero/hero-section-4.png",
    alt: "Premium Fashion",
    fallback: "https://picsum.photos/200/200?fashion&4",
  },
];

export const STATS_DATA = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Premium Products" },
  { value: "5★", label: "Customer Rating" },
];

export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, duration: 0.8 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  },
  image: {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.8, ease: "easeOut" } 
    },
  },
};