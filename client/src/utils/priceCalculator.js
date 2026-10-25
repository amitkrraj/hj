/**
 * Price Calculator - Calculate product prices based on weight and rates
 */

import { DEFAULT_RATES } from "../config/defaults";

/**
 * Calculate price for a single variant
 */
export function calculateVariantPrice(variant, rates) {
  const { weight, purity, makingCharge, otherCharge, gst, discount } = variant;
  const material = getMaterialFromPurity(purity);
  
  const ratePerGram = rates?.[material]?.[purity] || DEFAULT_RATES[material]?.[purity] || 0;
  
  const metalValue = weight * ratePerGram;
  const totalBeforeGst = metalValue + (makingCharge || 0) + (otherCharge || 0);
  const gstAmount = totalBeforeGst * ((gst || 3) / 100);
  const totalPrice = totalBeforeGst + gstAmount - (discount || 0);
  
  return {
    metalValue: Math.round(metalValue),
    makingCharge: makingCharge || 0,
    otherCharge: otherCharge || 0,
    gstAmount: Math.round(gstAmount),
    discount: discount || 0,
    totalPrice: Math.round(totalPrice),
    ratePerGram,
    weight,
    purity,
  };
}

/**
 * Get material type from purity
 */
function getMaterialFromPurity(purity) {
  if (["18K", "22K", "24K"].includes(purity)) return "gold";
  if (["925", "999"].includes(purity)) return "silver";
  if (["950"].includes(purity)) return "platinum";
  return "gold";
}

/**
 * Get price range for a product with multiple variants
 */
export function getPriceRange(variants, rates) {
  if (!variants || variants.length === 0) {
    return null;
  }
  
  const prices = variants.map(v => calculateVariantPrice(v, rates).totalPrice);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  
  return {
    min,
    max,
    display: min === max ? formatPrice(min) : `${formatPrice(min)} - ${formatPrice(max)}`,
    single: min === max,
  };
}

/**
 * Format price in Indian Rupees
 */
export function formatPrice(price) {
  if (price === null || price === undefined) return "—";
  
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format weight in grams
 */
export function formatWeight(weight) {
  if (!weight) return "—";
  return `${weight.toFixed(2)} g`;
}

/**
 * Calculate making charge percentage
 */
export function calculateMakingChargePercent(makingCharge, metalValue) {
  if (!metalValue || metalValue === 0) return 0;
  return ((makingCharge / metalValue) * 100).toFixed(1);
}
