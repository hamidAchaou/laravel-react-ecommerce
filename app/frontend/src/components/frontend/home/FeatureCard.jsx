import React from "react";
import { motion } from "framer-motion";

const FeatureCard = React.memo(({ icon: Icon, text, subtext }) => (
  <motion.div
    className="flex items-center gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-brand-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
    whileHover={{ scale: 1.02 }}
  >
    <Icon 
      className="w-6 h-6 text-brand-primary flex-shrink-0" 
      aria-hidden="true"
    />
    <div>
      <p className="font-semibold text-brand-text-primary text-sm">
        {text}
      </p>
      <p className="text-brand-text-secondary text-xs">{subtext}</p>
    </div>
  </motion.div>
));

FeatureCard.displayName = "FeatureCard";
export default FeatureCard;