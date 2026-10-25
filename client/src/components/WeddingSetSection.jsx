import React from "react";
import { Link } from "react-router-dom";

const WeddingSetSection = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Wedding Set</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-12 h-0.5 bg-amber-400"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <div className="w-12 h-0.5 bg-amber-400"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-amber-400 rounded-tl-3xl"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-amber-400 rounded-br-3xl"></div>
            <img 
              src="/images/bride.png" 
              alt="Wedding Jewellery" 
              className="w-full rounded-2xl shadow-2xl relative z-10"
            />
          </div>

          {/* Content */}
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-semibold text-amber-600 dark:text-amber-400 mb-4" style={{ fontFamily: "'Times New Roman', serif" }}>
              Jewellery adds sparkle to the special moments of a bride.
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              A bride of any country remains incomplete without the exquisite touch of some jewelry pieces which gives her entire get up a majestic look. Bridal jewelry is of such a great significance as it not only enhances the beauty of the bride's attire, but also takes her beauty to another level.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              The makeup of an Indian bride is considered to be incomplete without her solah shringar which consists of all the jewelry pieces considered essential to be adorned by a bride.
            </p>
            <Link
              to="/shop?category=wedding-sets"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-amber-500/30 group"
            >
              Shop Now
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeddingSetSection;
