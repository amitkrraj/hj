/**
 * Live Gold/Silver Rates API Configuration
 * Using OroPocket free public API
 */

export const LIVE_RATES_CONFIG = {
  apiUrl: "https://api.oropocket.com/public/prices",
  cacheDuration: 300000, // 5 minutes
  timeout: 10000, // 10 seconds
};

/**
 * Indian States with local premium percentages
 * Premium is added to base rate to get local rate
 */
export const INDIAN_STATES = [
  { code: "RJ", name: "Rajasthan", premium: 1.5 },
  { code: "MH", name: "Maharashtra", premium: 1.0 },
  { code: "GJ", name: "Gujarat", premium: 1.2 },
  { code: "DL", name: "Delhi", premium: 1.0 },
  { code: "KA", name: "Karnataka", premium: 1.3 },
  { code: "TN", name: "Tamil Nadu", premium: 1.5 },
  { code: "KL", name: "Kerala", premium: 2.0 },
  { code: "UP", name: "Uttar Pradesh", premium: 1.8 },
  { code: "WB", name: "West Bengal", premium: 2.5 },
  { code: "AP", name: "Andhra Pradesh", premium: 1.5 },
  { code: "TS", name: "Telangana", premium: 1.3 },
  { code: "MP", name: "Madhya Pradesh", premium: 1.6 },
  { code: "BR", name: "Bihar", premium: 2.0 },
  { code: "PB", name: "Punjab", premium: 1.4 },
  { code: "HR", name: "Haryana", premium: 1.2 },
  { code: "JH", name: "Jharkhand", premium: 1.8 },
  { code: "CG", name: "Chhattisgarh", premium: 1.7 },
  { code: "OD", name: "Odisha", premium: 1.6 },
  { code: "AS", name: "Assam", premium: 2.2 },
  { code: "JK", name: "Jammu & Kashmir", premium: 2.5 },
  { code: "UK", name: "Uttarakhand", premium: 1.5 },
  { code: "HP", name: "Himachal Pradesh", premium: 1.8 },
  { code: "GA", name: "Goa", premium: 1.3 },
  { code: "TR", name: "Tripura", premium: 2.3 },
  { code: "MN", name: "Manipur", premium: 2.5 },
  { code: "ML", name: "Meghalaya", premium: 2.4 },
  { code: "MZ", name: "Mizoram", premium: 2.5 },
  { code: "NL", name: "Nagaland", premium: 2.5 },
  { code: "AR", name: "Arunachal Pradesh", premium: 2.8 },
  { code: "SK", name: "Sikkim", premium: 2.3 },
  { code: "AN", name: "Andaman & Nicobar", premium: 3.0 },
  { code: "CH", name: "Chandigarh", premium: 1.2 },
  { code: "DN", name: "Dadra & Nagar Haveli", premium: 1.5 },
  { code: "DD", name: "Daman & Diu", premium: 1.5 },
  { code: "LD", name: "Lakshadweep", premium: 3.5 },
  { code: "PY", name: "Puducherry", premium: 1.5 },
];

export function getStateByCode(code) {
  return INDIAN_STATES.find(s => s.code === code);
}

export function getStatePremium(stateCode) {
  const state = getStateByCode(stateCode);
  return state ? state.premium : 1.5; // Default to Rajasthan premium
}

/**
 * Calculate state-wise rate
 * @param {number} baseRate - Base rate from API
 * @param {string} stateCode - State code
 * @returns {number} - Rate with state premium applied
 */
export function calculateStateRate(baseRate, stateCode) {
  const premium = getStatePremium(stateCode);
  return Math.round(baseRate * (1 + premium / 100));
}
