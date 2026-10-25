/**
 * CSV Loader - Fetches and parses Google Sheets CSV data
 */

import { GOOGLE_SHEETS_CONFIG, getProductsCSVUrl, isGoogleSheetsConfigured, convertDriveUrlToDirectLink } from "../config/googleSheets";

const cache = {
  products: { data: null, timestamp: 0 },
};

function isCacheValid(cacheKey) {
  const cached = cache[cacheKey];
  if (!cached.data) return false;
  
  const now = Date.now();
  return now - cached.timestamp < GOOGLE_SHEETS_CONFIG.cacheDuration;
}

/**
 * Load products from Google Sheets CSV
 */
export async function loadProductsCSV() {
  if (isCacheValid("products")) {
    return cache.products.data;
  }
  
  if (!isGoogleSheetsConfigured()) {
    return [];
  }
  
  const url = getProductsCSVUrl();
  const data = await loadCSV(url, true);
  
  cache.products = { data, timestamp: Date.now() };
  
  return data;
}

/**
 * Load and parse CSV file
 */
export async function loadCSV(url, processImages = false) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.statusText}`);
    }
    
    const text = await response.text();
    const data = parseCSV(text);
    
    if (processImages) {
      return data.map(row => ({
        ...row,
        image: row.image ? convertDriveUrlToDirectLink(row.image) : null,
      }));
    }
    
    return data;
  } catch (error) {
    console.error("Error loading CSV:", error);
    return [];
  }
}

/**
 * Parse CSV string into array of objects
 */
export function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    const entry = {};
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim() || "";
      const normalizedHeader = header.toLowerCase().replace(/\s+/g, "");
      
      const numericFields = {
        weight: "weight",
        rate: "rate",
        makingcharge: "makingCharge",
        othercharge: "otherCharge",
        gst: "gst",
        discount: "discount",
        stonecharge: "stoneCharge",
      };
      
      if (numericFields[normalizedHeader]) {
        entry[numericFields[normalizedHeader]] = value ? parseFloat(value) : null;
      } else if (normalizedHeader === "size") {
        entry.size = value || null;
      } else {
        entry[normalizedHeader] = value || null;
      }
    });
    
    if (entry.id) {
      data.push(entry);
    }
  }
  
  return data;
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  
  values.push(current);
  return values;
}

/**
 * Clear cache to force refresh
 */
export function clearCache() {
  cache.products = { data: null, timestamp: 0 };
}
