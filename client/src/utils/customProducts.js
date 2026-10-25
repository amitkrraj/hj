/**
 * Custom Products Manager - localStorage CRUD for admin-added products
 */

import { convertDriveUrlToDirectLink } from "../config/googleSheets";
import { sanitizeInput, sanitizeUrl, logAdminAction } from "./security";

const STORAGE_KEY = "hj_custom_products";

/**
 * Get all custom products from localStorage
 */
export function getCustomProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading custom products:", e);
    return [];
  }
}

/**
 * Save custom products to localStorage
 */
function saveCustomProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error("Error saving custom products:", e);
  }
}

/**
 * Build product ID from material, category, and name
 */
export function buildProductId(material, category, name) {
  if (!material || !category || !name) return null;
  
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  
  return `${material}-${category}-${slug}`;
}

/**
 * Add a new custom product
 */
export function addCustomProduct(product) {
  const products = getCustomProducts();
  
  const sanitizedProduct = {
    ...product,
    id: sanitizeInput(product.id),
    name: sanitizeInput(product.name),
    image: product.image ? convertDriveUrlToDirectLink(sanitizeUrl(product.image)) : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const existingIndex = products.findIndex(p => p.id === sanitizedProduct.id);
  
  if (existingIndex >= 0) {
    products[existingIndex] = { ...products[existingIndex], ...sanitizedProduct, updatedAt: new Date().toISOString() };
  } else {
    products.push(sanitizedProduct);
  }
  
  saveCustomProducts(products);
  logAdminAction("ADD_PRODUCT", { id: sanitizedProduct.id });
  
  return sanitizedProduct;
}

/**
 * Update an existing custom product
 */
export function updateCustomProduct(id, updates) {
  const products = getCustomProducts();
  const index = products.findIndex(p => p.id === id);
  
  if (index < 0) return null;
  
  const sanitizedUpdates = {
    ...updates,
    name: updates.name ? sanitizeInput(updates.name) : products[index].name,
    image: updates.image ? convertDriveUrlToDirectLink(sanitizeUrl(updates.image)) : products[index].image,
    updatedAt: new Date().toISOString(),
  };
  
  products[index] = { ...products[index], ...sanitizedUpdates };
  saveCustomProducts(products);
  logAdminAction("UPDATE_PRODUCT", { id });
  
  return products[index];
}

/**
 * Remove custom products by ID
 */
export function removeCustomProductsById(id) {
  const products = getCustomProducts();
  const filtered = products.filter(p => p.id !== id);
  
  if (filtered.length !== products.length) {
    saveCustomProducts(filtered);
    logAdminAction("DELETE_PRODUCT", { id });
    return true;
  }
  
  return false;
}

/**
 * Get custom product by ID
 */
export function getCustomProductById(id) {
  const products = getCustomProducts();
  return products.find(p => p.id === id) || null;
}

/**
 * Clear all custom products
 */
export function clearAllCustomProducts() {
  localStorage.removeItem(STORAGE_KEY);
  logAdminAction("CLEAR_ALL_PRODUCTS");
}
