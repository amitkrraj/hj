import React from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaEye } from "react-icons/fa";
import { useProducts } from "../hooks/useProducts";
import { useSiteConfig } from "../context/SiteConfigContext";
import { DEFAULTS } from "../config/defaults";
import SectionHeading from "./SectionHeading";

const defaultProducts = [
  { id: "gold-bracelets-bracelet", name: "Bracelet", image: "/images/products/22.jpg", weight: "15.25g", material: "Gold" },
  { id: "gold-necklaces-necklace", name: "Necklace", image: "/images/products/31.jpg", weight: "7.1g", material: "Gold" },
  { id: "gold-rings-wedding-ring", name: "Wedding Ring", image: "/images/products/36.jpg", weight: "2g", material: "Gold" },
  { id: "gold-bangles-kangan", name: "Kangan", image: "/images/products/28.jpg", weight: "18.45g", material: "Gold" },
];

const BestSellerProducts = () => {
  const { products, loading } = useProducts();
  const { config } = useSiteConfig();

  const featuredProducts = products.length > 0 ? products.slice(0, 8) : [];

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="Speciality" subtitle="Our most loved pieces" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const displayProducts = featuredProducts.length > 0 ? featuredProducts : defaultProducts;

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeading title="Speciality" subtitle="Our most loved pieces" />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product, idx) => (
            <div
              key={product.id || idx}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl dark:shadow-gray-900/50 transition-all duration-500 border border-gray-100 dark:border-gray-700"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
                <img
                  src={product.image || product.variants?.[0]?.image || DEFAULTS.placeholderImage}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULTS.placeholderImage;
                  }}
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <div className="text-center text-white p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-amber-400 font-semibold mb-3">{product.name}</h4>
                    <table className="text-xs mx-auto mb-4">
                      <tbody>
                        <tr>
                          <td className="pr-3 text-gray-400">Material</td>
                          <td className="text-white">{product.materialDisplay || product.material || "Gold"}</td>
                        </tr>
                        <tr>
                          <td className="pr-3 text-gray-400">Weight</td>
                          <td className="text-white">{product.variants?.[0]?.weight ? `${product.variants[0].weight}g` : product.weight || "—"}</td>
                        </tr>
                      </tbody>
                    </table>
                    <Link
                      to={`/product/${product.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-medium hover:bg-amber-600 transition-colors"
                    >
                      <FaEye size={12} /> View Details
                    </Link>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-center mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-3">
                    {product.variants?.[0]?.weight ? `${product.variants[0].weight}g` : product.weight || "—"}
                  </p>

                  <div className="flex justify-center">
                    <a
                      href={`https://wa.me/${config.contact.whatsapp}?text=Hi, I'm interested in ${product.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-green-500 hover:text-white transition-all"
                    >
                      <FaWhatsapp size={14} />
                      <span>Enquire</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-amber-500/30 group"
          >
            More Items
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellerProducts;
