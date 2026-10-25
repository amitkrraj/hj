/**
 * Category Manager - Dynamic category CRUD
 */

import { DEFAULT_CATEGORIES } from "../config/defaults";
import { convertDriveUrlToDirectLink } from "../config/googleSheets";
import { sanitizeInput, sanitizeUrl, logAdminAction } from "./security";

const STORAGE_KEY = "hj_custom_categories";

/**
 * Get custom categories from localStorage
 */
function getCustomCategories() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading custom categories:", e);
    return [];
  }
}

/**
 * Save custom categories to localStorage
 */
function saveCustomCategories(categories) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error("Error saving custom categories:", e);
  }
}

/**
 * Get all categories (default + custom)
 */
export function getAllCategories() {
  const custom = getCustomCategories();
  const customIds = new Set(custom.map(c => c.id));
  
  const defaults = DEFAULT_CATEGORIES.filter(c => !customIds.has(c.id));
  
  return [...defaults, ...custom].sort((a, b) => (a.order || 999) - (b.order || 999));
}

/**
 * Get category by ID or slug
 */
export function getCategoryById(idOrSlug) {
  const all = getAllCategories();
  return all.find(c => c.id === idOrSlug || c.slug === idOrSlug) || null;
}

/**
 * Generate slug from name
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Add a new category
 */
export function addCategory(category) {
  const custom = getCustomCategories();
  const all = getAllCategories();
  
  const slug = generateSlug(category.name);
  const id = category.id || slug;
  
  if (all.some(c => c.id === id || c.slug === slug)) {
    return { success: false, error: "Category already exists" };
  }
  
  const newCategory = {
    id,
    name: sanitizeInput(category.name),
    slug,
    image: category.image ? convertDriveUrlToDirectLink(sanitizeUrl(category.image)) : null,
    order: category.order || all.length + 1,
    isDefault: false,
    createdAt: new Date().toISOString(),
  };
  
  custom.push(newCategory);
  saveCustomCategories(custom);
  logAdminAction("ADD_CATEGORY", { id: newCategory.id, name: newCategory.name });
  
  return { success: true, category: newCategory };
}

/**
 * Update a category
 */
export function updateCategory(id, updates) {
  const custom = getCustomCategories();
  const index = custom.findIndex(c => c.id === id);
  
  if (index < 0) {
    const defaultCat = DEFAULT_CATEGORIES.find(c => c.id === id);
    if (defaultCat) {
      const updatedDefault = {
        ...defaultCat,
        name: updates.name ? sanitizeInput(updates.name) : defaultCat.name,
        image: updates.image ? convertDriveUrlToDirectLink(sanitizeUrl(updates.image)) : defaultCat.image,
        order: updates.order ?? defaultCat.order,
        updatedAt: new Date().toISOString(),
      };
      custom.push(updatedDefault);
      saveCustomCategories(custom);
      logAdminAction("UPDATE_CATEGORY", { id });
      return { success: true, category: updatedDefault };
    }
    return { success: false, error: "Category not found" };
  }
  
  custom[index] = {
    ...custom[index],
    name: updates.name ? sanitizeInput(updates.name) : custom[index].name,
    image: updates.image !== undefined 
      ? (updates.image ? convertDriveUrlToDirectLink(sanitizeUrl(updates.image)) : null)
      : custom[index].image,
    order: updates.order ?? custom[index].order,
    updatedAt: new Date().toISOString(),
  };
  
  saveCustomCategories(custom);
  logAdminAction("UPDATE_CATEGORY", { id });
  
  return { success: true, category: custom[index] };
}

/**
 * Delete a category (only custom categories can be deleted)
 */
export function deleteCategory(id) {
  const defaultCat = DEFAULT_CATEGORIES.find(c => c.id === id);
  if (defaultCat) {
    return { success: false, error: "Cannot delete default category" };
  }
  
  const custom = getCustomCategories();
  const filtered = custom.filter(c => c.id !== id);
  
  if (filtered.length === custom.length) {
    return { success: false, error: "Category not found" };
  }
  
  saveCustomCategories(filtered);
  logAdminAction("DELETE_CATEGORY", { id });
  
  return { success: true };
}

/**
 * Reorder categories
 */
export function reorderCategories(orderedIds) {
  const custom = getCustomCategories();
  const all = getAllCategories();
  
  orderedIds.forEach((id, index) => {
    const customIndex = custom.findIndex(c => c.id === id);
    if (customIndex >= 0) {
      custom[customIndex].order = index + 1;
    } else {
      const defaultCat = DEFAULT_CATEGORIES.find(c => c.id === id);
      if (defaultCat) {
        custom.push({ ...defaultCat, order: index + 1 });
      }
    }
  });
  
  saveCustomCategories(custom);
  logAdminAction("REORDER_CATEGORIES");
  
  return { success: true };
}

/**
 * Get categories that have products
 */
export function getCategoriesWithProducts(products) {
  const all = getAllCategories();
  const productCategories = new Set(products.map(p => p.category));
  
  return all.filter(c => productCategories.has(c.slug) || productCategories.has(c.id));
}
