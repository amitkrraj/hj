import React, { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FaFilter, FaTimes, FaWhatsapp, FaSearch } from "react-icons/fa";
import { useFilteredProducts } from "../hooks/useProducts";
import { useSiteConfig } from "../context/SiteConfigContext";
import { getAllCategories } from "../utils/categoryManager";
import { DEFAULTS } from "../config/defaults";
import { formatPrice } from "../utils/priceCalculator";
import SectionHeading from "../components/SectionHeading";

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  const material = searchParams.get("material") || "";
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  
  const { products, materials, categories, loading, allProducts } = useFilteredProducts(material, category, search);
  const { config } = useSiteConfig();
  const allCategories = getAllCategories();

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = material || category || search;

  const pageTitle = useMemo(() => {
    if (search) return `Search: "${search}"`;
    if (material && category) {
      const matName = DEFAULTS.materialNames[material] || material;
      const catObj = allCategories.find(c => c.slug === category || c.id === category);
      return `${matName} ${catObj?.name || category}`;
    }
    if (material) return `${DEFAULTS.materialNames[material] || material} Jewellery`;
    if (category) {
      const catObj = allCategories.find(c => c.slug === category || c.id === category);
      return catObj?.name || category;
    }
    return "All Jewellery";
  }, [material, category, search, allCategories]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">{pageTitle}</h1>
          <p className="text-gray-400 text-center mt-2">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg shadow-sm border"
          >
            <FaFilter /> Filters {hasFilters && `(${[material, category, search].filter(Boolean).length})`}
          </button>

          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-sm text-amber-600 hover:underline">
                    Clear All
                  </button>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-2">Material</label>
                <select
                  value={material}
                  onChange={(e) => updateFilter("material", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">All Materials</option>
                  {DEFAULTS.materials.map((m) => (
                    <option key={m} value={m}>{DEFAULTS.materialNames[m]}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => updateFilter("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">All Categories</option>
                  {allCategories.map((c) => (
                    <option key={c.id} value={c.slug || c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {search && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Search</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg">
                    <FaSearch className="text-amber-600" size={14} />
                    <span className="text-sm text-gray-700 flex-1">{search}</span>
                    <button onClick={() => updateFilter("search", "")} className="text-gray-400 hover:text-gray-600">
                      <FaTimes size={14} />
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden w-full py-2 bg-amber-500 text-white rounded-lg font-medium"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <div className="aspect-square bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaSearch className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="px-6 py-2 btn-gold rounded-full">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm card-hover group">
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="aspect-square overflow-hidden bg-gray-100 img-zoom">
                        <img
                          src={product.image || product.variants[0]?.image || DEFAULTS.placeholderImage}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULTS.placeholderImage;
                          }}
                        />
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link to={`/product/${product.id}`}>
                        <p className="text-xs text-amber-600 font-medium mb-1">
                          {product.materialDisplay} • {product.categoryDisplay}
                        </p>
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1 group-hover:text-amber-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between">
                        <div>
                          {product.priceRange ? (
                            <p className="font-bold text-gray-800 text-sm md:text-base">
                              {product.priceRange.display}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500">
                              {product.variants[0]?.weight ? `${product.variants[0].weight}g` : "—"}
                            </p>
                          )}
                        </div>
                        <a
                          href={`https://wa.me/${config.contact.whatsapp}?text=Hi, I'm interested in ${product.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-green-50 rounded-full text-green-600 hover:bg-green-100 transition-colors"
                        >
                          <FaWhatsapp size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
