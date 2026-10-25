import React from "react";

const SectionHeading = ({ title, subtitle, light = false }) => {
  return (
    <div className="text-center mb-8 md:mb-12">
      <h2 className={`text-2xl md:text-3xl font-bold ${
        light 
          ? "text-white" 
          : "text-gray-800 dark:text-white"
      }`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2 ${
          light 
            ? "text-gray-300" 
            : "text-gray-500 dark:text-gray-400"
        }`}>
          {subtitle}
        </p>
      )}
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="w-12 h-0.5 bg-amber-400"></div>
        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
        <div className="w-12 h-0.5 bg-amber-400"></div>
      </div>
    </div>
  );
};

export default SectionHeading;
