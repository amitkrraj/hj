/**
 * Google Sheets Configuration for Hira Jewellers
 * 
 * HOW TO SET UP:
 * 1. Create a Google Sheet with your product data
 * 2. Go to File → Share → Publish to web
 * 3. Select the specific tab and "Comma-separated values (.csv)"
 * 4. Click "Publish" and copy the link
 * 5. Paste the URL below
 */

export const GOOGLE_SHEETS_CONFIG = {
  enabled: true,
  
  // Products tab - columns: id, weight, size, purity, makingCharge, otherCharge, gst, discount, image
  productsUrl: "",
  
  // Cache duration in milliseconds (5 minutes)
  cacheDuration: 300000,
};

export function getProductsCSVUrl() {
  return GOOGLE_SHEETS_CONFIG.productsUrl;
}

export function isGoogleSheetsConfigured() {
  return (
    GOOGLE_SHEETS_CONFIG.enabled &&
    GOOGLE_SHEETS_CONFIG.productsUrl &&
    GOOGLE_SHEETS_CONFIG.productsUrl.includes("docs.google.com")
  );
}

/**
 * Convert Google Drive share link to direct image URL
 * Input: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * Output: https://lh3.googleusercontent.com/d/FILE_ID
 */
export function convertDriveUrlToDirectLink(driveUrl) {
  if (!driveUrl) return null;
  
  if (driveUrl.includes("lh3.googleusercontent.com")) {
    return driveUrl;
  }
  
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
    /uc\?export=view&id=([a-zA-Z0-9_-]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = driveUrl.match(pattern);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }
  
  return driveUrl;
}

/**
 * Validate if URL is a valid Google Drive link
 */
export function isValidGoogleDriveUrl(url) {
  if (!url) return false;
  const pattern = /^https:\/\/(drive\.google\.com|lh3\.googleusercontent\.com)\//;
  return pattern.test(url);
}
