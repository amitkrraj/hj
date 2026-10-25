/**
 * Site Config Context - Global state for site configuration
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getSiteConfig, updateSiteConfig as updateConfig, getHeroImages } from "../utils/siteConfigManager";

const SiteConfigContext = createContext(null);

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(getSiteConfig);
  const [heroImages, setHeroImages] = useState(getHeroImages);

  const refreshConfig = useCallback(() => {
    setConfig(getSiteConfig());
    setHeroImages(getHeroImages());
  }, []);

  const updateSiteConfig = useCallback((updates) => {
    const result = updateConfig(updates);
    if (result.success) {
      setConfig(result.config);
    }
    return result;
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key?.startsWith("hj_")) {
        refreshConfig();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshConfig]);

  const value = {
    config,
    heroImages,
    updateSiteConfig,
    refreshConfig,
  };

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error("useSiteConfig must be used within SiteConfigProvider");
  }
  return context;
}
