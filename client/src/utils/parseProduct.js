/**
 * Parse Product utilities
 */

import { DEFAULTS } from "../config/defaults";

/**
 * Parse product ID to extract material, category, and name
 */
export function parseProductId(id) {
  if (!id) return null;
  
  const parts = id.split("-");
  if (parts.length < 3) return null;
  
  const material = parts[0];
  const category = parts[1];
  const name = parts.slice(2).join("-");
  
  return { material, category, name };
}

/**
 * Parse all products from raw data
 */
export function parseAllProducts(rawData, rates) {
  const productMap = new Map();
  
  rawData.forEach(row => {
    if (!row.id) return;
    
    const parsed = parseProductId(row.id);
    if (!parsed) return;
    
    const { material, category, name } = parsed;
    
    const variant = {
      weight: row.weight || 0,
      size: row.size || null,
      purity: row.purity || DEFAULTS.purity[material] || "22K",
      makingCharge: row.makingCharge || 0,
      otherCharge: row.otherCharge || 0,
      gst: row.gst ?? 3,
      discount: row.discount || 0,
      image: row.image || null,
    };
    
    const productKey = `${material}-${category}-${name}`;
    
    if (productMap.has(productKey)) {
      productMap.get(productKey).variants.push(variant);
    } else {
      productMap.set(productKey, {
        id: row.id,
        material,
        category,
        name: formatName(name),
        materialDisplay: DEFAULTS.materialNames[material] || material,
        categoryDisplay: DEFAULTS.categoryNames[category] || formatName(category),
        variants: [variant],
        image: row.image || null,
      });
    }
  });
  
  return Array.from(productMap.values());
}

/**
 * Format slug to display name
 */
function formatName(slug) {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Filter products by criteria
 */
export function filterProducts(products, { material, category, search }) {
  return products.filter(product => {
    if (material && product.material !== material) return false;
    if (category && product.category !== category) return false;
    
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(searchLower);
      const matchesMaterial = product.materialDisplay.toLowerCase().includes(searchLower);
      const matchesCategory = product.categoryDisplay.toLowerCase().includes(searchLower);
      
      if (!matchesName && !matchesMaterial && !matchesCategory) return false;
    }
    
    return true;
  });
}

/**
 * Get unique materials from products
 */
export function getUniqueMaterials(products) {
  const materials = new Set(products.map(p => p.material));
  return Array.from(materials);
}

/**
 * Get unique categories from products
 */
export function getUniqueCategories(products) {
  const categories = new Set(products.map(p => p.category));
  return Array.from(categories);
}

/**
 * Group products by category
 */
export function groupProductsByCategory(products) {
  const groups = {};
  
  products.forEach(product => {
    if (!groups[product.category]) {
      groups[product.category] = {
        category: product.category,
        categoryDisplay: product.categoryDisplay,
        products: [],
      };
    }
    groups[product.category].products.push(product);
  });
  
  return Object.values(groups);
}

/**
 * Group products by material
 */
export function groupProductsByMaterial(products) {
  const groups = {};
  
  products.forEach(product => {
    if (!groups[product.material]) {
      groups[product.material] = {
        material: product.material,
        materialDisplay: product.materialDisplay,
        products: [],
      };
    }
    groups[product.material].products.push(product);
  });
  
  return Object.values(groups);
}
