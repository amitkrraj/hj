/**
 * Default configuration for Hira Jewellers
 */

export const DEFAULTS = {
  purity: {
    gold: "22K",
    silver: "925",
    platinum: "950",
  },

  purities: {
    gold: ["18K", "22K", "24K"],
    silver: ["925", "999"],
    platinum: ["950"],
  },

  materials: ["gold", "silver", "platinum"],

  materialNames: {
    gold: "Gold",
    silver: "Silver",
    platinum: "Platinum",
  },

  categoryNames: {
    rings: "Rings",
    earrings: "Earrings",
    "ear-tops": "Ear Tops",
    pendants: "Pendants",
    bangles: "Bangles",
    bracelets: "Bracelets",
    necklaces: "Necklaces",
    chains: "Chains",
    "nose-pins": "Nose Pins",
    coins: "Coins",
    mangalsutra: "Mangalsutra",
    anklets: "Anklets",
    "waist-belts": "Waist Belts",
    "wedding-sets": "Wedding Sets",
  },

  placeholderImage: "https://via.placeholder.com/300x300?text=No+Image",
};

export const DEFAULT_CATEGORIES = [
  { id: "rings", name: "Rings", slug: "rings", image: null, order: 1, isDefault: true },
  { id: "earrings", name: "Earrings", slug: "earrings", image: null, order: 2, isDefault: true },
  { id: "ear-tops", name: "Ear Tops", slug: "ear-tops", image: null, order: 3, isDefault: true },
  { id: "pendants", name: "Pendants", slug: "pendants", image: null, order: 4, isDefault: true },
  { id: "bangles", name: "Bangles", slug: "bangles", image: null, order: 5, isDefault: true },
  { id: "bracelets", name: "Bracelets", slug: "bracelets", image: null, order: 6, isDefault: true },
  { id: "necklaces", name: "Necklaces", slug: "necklaces", image: null, order: 7, isDefault: true },
  { id: "chains", name: "Chains", slug: "chains", image: null, order: 8, isDefault: true },
  { id: "nose-pins", name: "Nose Pins", slug: "nose-pins", image: null, order: 9, isDefault: true },
  { id: "coins", name: "Coins", slug: "coins", image: null, order: 10, isDefault: true },
  { id: "mangalsutra", name: "Mangalsutra", slug: "mangalsutra", image: null, order: 11, isDefault: true },
  { id: "anklets", name: "Anklets", slug: "anklets", image: null, order: 12, isDefault: true },
  { id: "wedding-sets", name: "Wedding Sets", slug: "wedding-sets", image: null, order: 13, isDefault: true },
];

export const DEFAULT_RATES = {
  gold: {
    "24K": 14215,
    "22K": 13021,
    "18K": 10661,
  },
  silver: {
    "999": 196,
    "925": 181,
  },
  platinum: {
    "950": 3200,
  },
  lastUpdated: null,
};
