/**
 * Navigation Builder - Build dynamic navigation from products and categories
 */

import { getAllCategories } from "./categoryManager";
import { DEFAULTS } from "../config/defaults";

/**
 * Build navigation items from products
 */
export function buildNavigation(products) {
  const categories = getAllCategories();
  const productCategories = new Set(products.map(p => p.category));
  const productMaterials = new Set(products.map(p => p.material));
  
  const navItems = [
    { label: "Home", href: "/" },
    { label: "All Jewellery", href: "/shop" },
  ];
  
  DEFAULTS.materials.forEach(material => {
    if (!productMaterials.has(material)) return;
    
    const materialProducts = products.filter(p => p.material === material);
    const materialCategories = [...new Set(materialProducts.map(p => p.category))];
    
    const children = materialCategories
      .map(cat => {
        const category = categories.find(c => c.slug === cat || c.id === cat);
        return {
          label: `${DEFAULTS.materialNames[material]} ${category?.name || cat}`,
          href: `/shop?material=${material}&category=${cat}`,
        };
      })
      .slice(0, 6);
    
    navItems.push({
      label: DEFAULTS.materialNames[material],
      href: `/shop?material=${material}`,
      children: children.length > 0 ? children : undefined,
    });
  });
  
  if (productCategories.has("coins")) {
    navItems.push({
      label: "Coins",
      href: "/shop?category=coins",
      children: [
        { label: "Gold Coins", href: "/shop?material=gold&category=coins" },
        { label: "Silver Coins", href: "/shop?material=silver&category=coins" },
      ],
    });
  }
  
  navItems.push(
    { label: "About Us", href: "/about" }
  );
  
  return navItems;
}

/**
 * Get static navigation (fallback when no products)
 */
export function getStaticNavigation() {
  return [
    { label: "Home", href: "/" },
    { label: "All Jewellery", href: "/shop" },
    {
      label: "Gold",
      href: "/shop?material=gold",
      children: [
        { label: "Gold Rings", href: "/shop?material=gold&category=rings" },
        { label: "Gold Earrings", href: "/shop?material=gold&category=earrings" },
        { label: "Gold Bangles", href: "/shop?material=gold&category=bangles" },
        { label: "Gold Necklaces", href: "/shop?material=gold&category=necklaces" },
        { label: "Gold Chains", href: "/shop?material=gold&category=chains" },
      ],
    },
    {
      label: "Silver",
      href: "/shop?material=silver",
      children: [
        { label: "Silver Rings", href: "/shop?material=silver&category=rings" },
        { label: "Silver Earrings", href: "/shop?material=silver&category=earrings" },
        { label: "Silver Bangles", href: "/shop?material=silver&category=bangles" },
      ],
    },
    {
      label: "Coins",
      href: "/shop?category=coins",
      children: [
        { label: "Gold Coins", href: "/shop?material=gold&category=coins" },
        { label: "Silver Coins", href: "/shop?material=silver&category=coins" },
      ],
    },
    { label: "About Us", href: "/about" },
  ];
}
