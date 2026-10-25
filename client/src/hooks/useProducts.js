/**
 * useProducts Hook - Load and manage product data
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { loadProductsCSV, clearCache } from "../utils/csvLoader";
import { parseAllProducts, filterProducts, getUniqueMaterials, getUniqueCategories } from "../utils/parseProduct";
import { getPriceRange } from "../utils/priceCalculator";
import { useRatesContext } from "../context/RatesContext";
import { getCustomProducts } from "../utils/customProducts";
import { convertDriveUrlToDirectLink } from "../config/googleSheets";

export function useProducts() {
  const { rates } = useRatesContext();
  const [rawCsvData, setRawCsvData] = useState([]);
  const [customProducts, setCustomProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const csvData = await loadProductsCSV();
      setRawCsvData(csvData);
    } catch (err) {
      console.error("Error loading product data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setCustomProducts(getCustomProducts());
  }, []);

  const refreshCustomProducts = useCallback(() => {
    setCustomProducts(getCustomProducts());
  }, []);

  const mergedRows = useMemo(() => {
    const customIds = new Set(customProducts.map(r => r.id));
    const csvFiltered = (rawCsvData || []).filter(r => r.id && !customIds.has(r.id));
    const customWithImages = customProducts.map(r => ({
      ...r,
      image: r.image ? convertDriveUrlToDirectLink(r.image) : r.image,
    }));
    return [...csvFiltered, ...customWithImages];
  }, [rawCsvData, customProducts]);

  const products = useMemo(() => {
    if (!mergedRows.length) return [];
    const parsed = parseAllProducts(mergedRows, rates);
    return parsed.map(product => ({
      ...product,
      priceRange: getPriceRange(product.variants, rates),
    }));
  }, [mergedRows, rates]);

  const refresh = useCallback(() => {
    clearCache();
    loadData();
    setCustomProducts(getCustomProducts());
  }, [loadData]);

  const customProductIds = useMemo(
    () => new Set(customProducts.map(r => r.id)),
    [customProducts]
  );

  return {
    products,
    rates,
    loading,
    error,
    refresh,
    refreshCustomProducts,
    customProductIds,
  };
}

const MATERIAL_ORDER = ["gold", "silver", "platinum"];
const CATEGORY_ORDER = ["rings", "earrings", "ear-tops", "pendants", "bangles", "bracelets", "necklaces", "chains", "nose-pins", "coins", "mangalsutra"];

function sortByPreferredOrder(items, preferredOrder) {
  return items.sort((a, b) => {
    const indexA = preferredOrder.indexOf(a);
    const indexB = preferredOrder.indexOf(b);
    
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });
}

export function useFilteredProducts(material, category, search) {
  const { products, rates, loading, error, refresh } = useProducts();

  const filtered = useMemo(() => {
    if (!products.length) return [];
    return filterProducts(products, { material, category, search });
  }, [products, material, category, search]);

  const materials = useMemo(() => {
    const unique = getUniqueMaterials(products);
    return sortByPreferredOrder(unique, MATERIAL_ORDER);
  }, [products]);

  const categories = useMemo(() => {
    const unique = getUniqueCategories(products);
    return sortByPreferredOrder(unique, CATEGORY_ORDER);
  }, [products]);

  return {
    products: filtered,
    allProducts: products,
    rates,
    materials,
    categories,
    loading,
    error,
    searchQuery: search,
    refresh,
  };
}

export function useProduct(productId) {
  const { products, rates, loading, error } = useProducts();

  const product = useMemo(() => {
    if (!products.length || !productId) return null;
    return products.find(p => p.id === productId);
  }, [products, productId]);

  return { product, rates, loading, error };
}

export function useRates() {
  const { rates } = useRatesContext();
  return {
    rates,
    loading: false,
    lastUpdated: rates?.lastUpdated ?? null,
  };
}

export function useRatesAdmin() {
  const { rates, setRates, resetRates } = useRatesContext();

  const saveRates = useCallback((newRates) => {
    setRates({
      ...newRates,
      lastUpdated: new Date().toISOString().split("T")[0],
    });
    return true;
  }, [setRates]);

  return {
    rates: rates ?? null,
    loading: false,
    saveRates,
    resetToDefault: resetRates,
  };
}
