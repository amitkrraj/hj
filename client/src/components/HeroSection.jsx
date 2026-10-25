import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useSiteConfig } from "../context/SiteConfigContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ArrowLeft = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute z-10 left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center transition-all group"
      aria-label="Previous"
    >
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white group-hover:text-amber-400 transition-colors">
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

const ArrowRight = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute z-10 right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center transition-all group"
      aria-label="Next"
    >
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white group-hover:text-amber-400 transition-colors">
        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

const defaultHeroSlides = [
  {
    id: 1,
    image: "/images/banner/3713600.jpg",
    logo: "/images/logos/logo3.png",
    showLogo: true,
    title: "Hira Jewellers",
    subtitle: "आभूषण एक, खुशियां अनेक",
    ctaText: "View Collection",
    ctaLink: "/shop",
    ctaSecondary: "Contact Us",
    ctaSecondaryLink: "/about",
  },
  {
    id: 2,
    image: "/images/banner/3713553.jpg",
    title: "Wedding Collection",
    subtitle: "Make Your Special Day Memorable",
    ctaText: "Shop Now",
    ctaLink: "/shop?category=wedding-sets",
  },
  {
    id: 3,
    image: "/images/banner/3713990.jpg",
    title: "Gold Jewellery",
    subtitle: "Timeless Elegance, Pure Gold",
    ctaText: "Explore Gold",
    ctaLink: "/shop?material=gold",
  },
  {
    id: 4,
    image: "/images/banner/3714008.jpg",
    title: "Silver Collection",
    subtitle: "Stunning Silver Designs",
    ctaText: "View Silver",
    ctaLink: "/shop?material=silver",
  },
];

const HeroSection = () => {
  const { heroImages } = useSiteConfig();
  const [loading, setLoading] = useState(true);

  const slides = heroImages && heroImages.length > 0 ? heroImages : defaultHeroSlides;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <ArrowLeft />,
    nextArrow: <ArrowRight />,
    pauseOnHover: true,
    fade: true,
    cssEase: "ease-in-out",
    dotsClass: "slick-dots custom-dots",
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] md:h-[80vh] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <img src="/images/logos/logo5.png" alt="Loading" className="h-20 mx-auto mb-4 animate-pulse" />
          <p className="text-amber-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full relative">
      <style>{`
        .custom-dots {
          bottom: 20px !important;
        }
        .custom-dots li button:before {
          color: white !important;
          opacity: 0.5 !important;
          font-size: 10px !important;
        }
        .custom-dots li.slick-active button:before {
          color: #f59e0b !important;
          opacity: 1 !important;
        }
      `}</style>
      
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={slide.id || index} className="relative outline-none">
            <div className="relative h-[60vh] md:h-[80vh]">
              <img
                src={slide.image}
                alt={slide.title || `Banner ${index + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/banner/3713600.jpg";
                }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
              
              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-3xl">
                  {/* Logo for first slide */}
                  {slide.showLogo && (
                    <div className="mb-6 animate-fadeIn">
                      <img 
                        src={slide.logo || "/images/logos/logo3.png"} 
                        alt="Hira Jewellers" 
                        className="h-24 md:h-32 mx-auto drop-shadow-2xl"
                      />
                    </div>
                  )}
                  
                  {/* Glowing Title */}
                  {slide.title && (
                    <h2 
                      className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fadeIn"
                      style={{ 
                        textShadow: "0 0 10px rgba(245, 158, 11, 0.5), 0 0 20px rgba(245, 158, 11, 0.3)",
                        fontFamily: slide.showLogo ? "'Times New Roman', serif" : "inherit",
                        letterSpacing: slide.showLogo ? "0.1em" : "normal"
                      }}
                    >
                      {slide.showLogo ? (
                        <span className="text-gold-gradient">{slide.title}</span>
                      ) : (
                        slide.title
                      )}
                    </h2>
                  )}
                  
                  {slide.subtitle && (
                    <p 
                      className="text-lg md:text-2xl mb-8 animate-fadeIn"
                      style={{ 
                        animationDelay: "0.2s",
                        color: slide.showLogo ? "#fbbf24" : "#e5e7eb"
                      }}
                    >
                      {slide.subtitle}
                    </p>
                  )}
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
                    {slide.ctaText && slide.ctaLink && (
                      <Link
                        to={slide.ctaLink}
                        className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5"
                      >
                        {slide.ctaText}
                      </Link>
                    )}
                    {slide.ctaSecondary && slide.ctaSecondaryLink && (
                      <Link
                        to={slide.ctaSecondaryLink}
                        className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-full font-semibold hover:bg-white/20 transition-all"
                      >
                        {slide.ctaSecondary}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default HeroSection;
