import React from "react";
import { useSiteConfig } from "../context/SiteConfigContext";
import SectionHeading from "./SectionHeading";

const WhyBuyFromUs = () => {
  const { config } = useSiteConfig();

  const iconImages = {
    certificate: "/icons/certificate.png",
    exchange: "https://img.icons8.com/wired/62/ffffff/connection-sync.png",
    shop: "https://img.icons8.com/dotty/67/ffffff/shop.png",
    hallmark: "https://img.icons8.com/dotty/64/ffffff/certificate.png",
  };

  return (
    <section 
      className="py-16 md:py-20 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <SectionHeading 
          title="Why Buy From Us" 
          subtitle="Trust, Quality & Service"
          light
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {config.trustBadges.map((badge, index) => (
            <div
              key={index}
              className="group text-center p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-500"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                  <img 
                    src={iconImages[badge.icon]} 
                    alt={badge.text}
                    className="w-8 h-8 md:w-10 md:h-10 object-contain filter brightness-0 invert"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
              <p className="text-white font-medium text-sm md:text-base leading-relaxed">
                {badge.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBuyFromUs;
