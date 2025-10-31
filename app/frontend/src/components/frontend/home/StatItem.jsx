import React from "react";

const StatItem = React.memo(({ value, label, showDivider = true }) => (
  <>
    <div className="text-center">
      <p 
        className="text-2xl font-bold text-brand-text-primary"
        aria-label={value}
      >
        {value}
      </p>
      <p className="text-brand-text-secondary text-sm">{label}</p>
    </div>
    {showDivider && (
      <div 
        className="h-8 w-px bg-brand-gray-200" 
        aria-hidden="true"
      />
    )}
  </>
));

StatItem.displayName = "StatItem";
export default StatItem;