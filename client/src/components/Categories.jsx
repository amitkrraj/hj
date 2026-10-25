import React from "react";
import { Link } from "react-router-dom";
import { getAllCategories, getCategoriesWithProducts } from "../utils/categoryManager";
import { useProducts } from "../hooks/useProducts";
import SectionHeading from "./SectionHeading";

const Categories = () => {
  const { products, loading } = useProducts();
  
  const categories = loading 
    ? getAllCategories().slice(0, 8) 
    : getCategoriesWithProducts(products).slice(0, 8);

  const defaultImages = {
    rings: "/images/products/36.jpg",
    earrings: "/images/gold/1.jpg",
    "ear-tops": "/images/gold/2.jpg",
    bangles: "/images/products/28.jpg",
    necklaces: "/images/products/31.jpg",
    pendants: "/images/gold/3.jpg",
    chains: "/images/gold/4.jpg",
    coins: "/images/coin/1.jpg",
    bracelets: "/images/products/22.jpg",
    mangalsutra: "/images/gold/5.jpg",
    "wedding-sets": "/images/weeding_set.jpg",
    anklets: "/images/silver/1.jpg",
  };

  const fallbackImages = [
    "/images/fancy items/1.jpg",
    "/images/fancy items/2.webp",
    "/images/fancy items/3.jpg",
    "/images/fancy items/4.jpg",
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeading 
          title="Shop by Category" 
          subtitle="Explore our wide range of jewellery collections"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, idx) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.slug || category.id}`}
              className="group relative overflow-hidden rounded-2xl aspect-square shadow-lg hover:shadow-2xl dark:shadow-gray-900/50 transition-all duration-500"
            >
              <img
                src={category.image || defaultImages[category.slug] || defaultImages[category.id] || fallbackImages[idx % fallbackImages.length]}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackImages[idx % fallbackImages.length];
                }}
              />
              
              {/* Elegant Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/20 transition-all duration-500"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="text-white font-bold text-lg md:text-xl mb-1 group-hover:text-amber-300 transition-colors">
                  {category.name}
                </h3>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-amber-400 text-sm font-medium">View Collection</span>
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
              
              {/* Corner Accent */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/30 group-hover:border-amber-400 transition-colors duration-300"></div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-amber-500 text-amber-600 dark:text-amber-400 rounded-full font-semibold hover:bg-amber-500 hover:text-white transition-all duration-300 group"
          >
            View All Categories
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
