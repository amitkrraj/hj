/**
 * Site Config Manager - Manage site-wide configuration
 */

import { DEFAULT_SITE_CONFIG, DEFAULT_HERO_IMAGES } from "../config/siteDefaults";
import { convertDriveUrlToDirectLink } from "../config/googleSheets";
import { sanitizeInput, sanitizeUrl, logAdminAction } from "./security";

const STORAGE_KEYS = {
  SITE_CONFIG: "hj_site_config",
  HERO_IMAGES: "hj_hero_images",
};

/**
 * Get site configuration
 */
export function getSiteConfig() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SITE_CONFIG);
    if (data) {
      return { ...DEFAULT_SITE_CONFIG, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error("Error reading site config:", e);
  }
  return DEFAULT_SITE_CONFIG;
}

/**
 * Update site configuration
 */
export function updateSiteConfig(updates) {
  try {
    const current = getSiteConfig();
    
    const sanitized = {
      ...updates,
      shopName: updates.shopName ? sanitizeInput(updates.shopName) : current.shopName,
      tagline: updates.tagline ? sanitizeInput(updates.tagline) : current.tagline,
      established: updates.established ? sanitizeInput(updates.established) : current.established,
      workingHours: updates.workingHours ? sanitizeInput(updates.workingHours) : current.workingHours,
      announcementBar: updates.announcementBar ? sanitizeInput(updates.announcementBar) : current.announcementBar,
      aboutText: updates.aboutText ? sanitizeInput(updates.aboutText) : current.aboutText,
    };
    
    if (updates.contact) {
      sanitized.contact = {
        phone: sanitizeInput(updates.contact.phone || current.contact.phone),
        whatsapp: sanitizeInput(updates.contact.whatsapp || current.contact.whatsapp),
        email: sanitizeInput(updates.contact.email || current.contact.email),
        address: sanitizeInput(updates.contact.address || current.contact.address),
      };
    }
    
    if (updates.social) {
      sanitized.social = {
        facebook: sanitizeUrl(updates.social.facebook || current.social.facebook),
        instagram: sanitizeUrl(updates.social.instagram || current.social.instagram),
        twitter: sanitizeUrl(updates.social.twitter || current.social.twitter),
      };
    }
    
    if (updates.mapUrl) {
      sanitized.mapUrl = sanitizeUrl(updates.mapUrl);
    }
    
    if (updates.mapEmbed) {
      sanitized.mapEmbed = sanitizeUrl(updates.mapEmbed);
    }
    
    const merged = { ...current, ...sanitized };
    localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify(merged));
    logAdminAction("UPDATE_SITE_CONFIG");
    
    return { success: true, config: merged };
  } catch (e) {
    console.error("Error updating site config:", e);
    return { success: false, error: e.message };
  }
}

/**
 * Reset site configuration to defaults
 */
export function resetSiteConfig() {
  localStorage.removeItem(STORAGE_KEYS.SITE_CONFIG);
  logAdminAction("RESET_SITE_CONFIG");
  return DEFAULT_SITE_CONFIG;
}

/**
 * Get hero images
 */
export function getHeroImages() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HERO_IMAGES);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading hero images:", e);
  }
  return DEFAULT_HERO_IMAGES;
}

/**
 * Add hero image
 */
export function addHeroImage(image) {
  const images = getHeroImages();
  
  const newImage = {
    id: Date.now(),
    image: convertDriveUrlToDirectLink(sanitizeUrl(image.image)),
    title: sanitizeInput(image.title || ""),
    subtitle: sanitizeInput(image.subtitle || ""),
    ctaText: sanitizeInput(image.ctaText || ""),
    ctaLink: sanitizeUrl(image.ctaLink || ""),
    order: images.length + 1,
    createdAt: new Date().toISOString(),
  };
  
  images.push(newImage);
  localStorage.setItem(STORAGE_KEYS.HERO_IMAGES, JSON.stringify(images));
  logAdminAction("ADD_HERO_IMAGE", { id: newImage.id });
  
  return { success: true, image: newImage };
}

/**
 * Update hero image
 */
export function updateHeroImage(id, updates) {
  const images = getHeroImages();
  const index = images.findIndex(img => img.id === id);
  
  if (index < 0) {
    return { success: false, error: "Image not found" };
  }
  
  images[index] = {
    ...images[index],
    image: updates.image ? convertDriveUrlToDirectLink(sanitizeUrl(updates.image)) : images[index].image,
    title: updates.title !== undefined ? sanitizeInput(updates.title) : images[index].title,
    subtitle: updates.subtitle !== undefined ? sanitizeInput(updates.subtitle) : images[index].subtitle,
    ctaText: updates.ctaText !== undefined ? sanitizeInput(updates.ctaText) : images[index].ctaText,
    ctaLink: updates.ctaLink !== undefined ? sanitizeUrl(updates.ctaLink) : images[index].ctaLink,
    order: updates.order ?? images[index].order,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEYS.HERO_IMAGES, JSON.stringify(images));
  logAdminAction("UPDATE_HERO_IMAGE", { id });
  
  return { success: true, image: images[index] };
}

/**
 * Delete hero image
 */
export function deleteHeroImage(id) {
  const images = getHeroImages();
  const filtered = images.filter(img => img.id !== id);
  
  if (filtered.length === images.length) {
    return { success: false, error: "Image not found" };
  }
  
  localStorage.setItem(STORAGE_KEYS.HERO_IMAGES, JSON.stringify(filtered));
  logAdminAction("DELETE_HERO_IMAGE", { id });
  
  return { success: true };
}

/**
 * Reorder hero images
 */
export function reorderHeroImages(orderedIds) {
  const images = getHeroImages();
  
  const reordered = orderedIds.map((id, index) => {
    const img = images.find(i => i.id === id);
    return img ? { ...img, order: index + 1 } : null;
  }).filter(Boolean);
  
  localStorage.setItem(STORAGE_KEYS.HERO_IMAGES, JSON.stringify(reordered));
  logAdminAction("REORDER_HERO_IMAGES");
  
  return { success: true, images: reordered };
}

/**
 * Reset hero images to defaults
 */
export function resetHeroImages() {
  localStorage.removeItem(STORAGE_KEYS.HERO_IMAGES);
  logAdminAction("RESET_HERO_IMAGES");
  return DEFAULT_HERO_IMAGES;
}
