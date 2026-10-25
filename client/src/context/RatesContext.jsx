/**
 * Rates Context - Global state for live gold/silver rates
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchLiveRates, convertToProductRates, saveManualRates, clearManualRates, clearRatesCache } from "../utils/liveRatesLoader";
import { DEFAULT_RATES } from "../config/defaults";
import { getSiteConfig } from "../utils/siteConfigManager";

const RatesContext = createContext(null);

export function RatesProvider({ children }) {
  const [liveRates, setLiveRates] = useState(null);
  const [productRates, setProductRates] = useState(DEFAULT_RATES);
  const [selectedState, setSelectedState] = useState(() => {
    const saved = localStorage.getItem("hj_selected_state");
    return saved || getSiteConfig().defaultState || "RJ";
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchLiveRates();
      
      if (result.success && result.data) {
        setLiveRates(result.data);
        setLastUpdated(result.data.fetchedAt || new Date().toISOString());
        
        const converted = convertToProductRates(result.data, selectedState);
        setProductRates(converted);
        setError(null);
      } else {
        setError(result.error || "Failed to load rates");
        setProductRates(DEFAULT_RATES);
      }
    } catch (e) {
      console.error("Error in loadRates:", e);
      setError(e.message);
      setProductRates(DEFAULT_RATES);
    } finally {
      setLoading(false);
    }
  }, [selectedState]);

  useEffect(() => {
    loadRates();
    
    const interval = setInterval(loadRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadRates]);

  useEffect(() => {
    if (liveRates) {
      const converted = convertToProductRates(liveRates, selectedState);
      setProductRates(converted);
    }
  }, [selectedState, liveRates]);

  const changeState = useCallback((stateCode) => {
    setSelectedState(stateCode);
    localStorage.setItem("hj_selected_state", stateCode);
  }, []);

  const setManualRatesOverride = useCallback((rates) => {
    if (rates) {
      const formattedRates = {
        gold: {
          buy: rates.gold?.["24K"] || rates.gold?.buy || 7300,
          sell: Math.round((rates.gold?.["24K"] || rates.gold?.buy || 7300) * 0.98),
          gst: Math.round((rates.gold?.["24K"] || rates.gold?.buy || 7300) * 0.03),
          change24h: { buy: 0 },
        },
        silver: {
          buy: rates.silver?.["999"] || rates.silver?.buy || 90,
          sell: Math.round((rates.silver?.["999"] || rates.silver?.buy || 90) * 0.98),
          gst: Math.round((rates.silver?.["999"] || rates.silver?.buy || 90) * 0.03),
          change24h: { buy: 0 },
        },
        timestamp: new Date().toISOString(),
      };
      
      saveManualRates(formattedRates);
      setLiveRates(formattedRates);
      setProductRates(rates);
      setLastUpdated(new Date().toISOString());
    }
  }, []);

  const resetRates = useCallback(() => {
    clearManualRates();
    clearRatesCache();
    loadRates();
  }, [loadRates]);

  const value = {
    liveRates,
    rates: productRates,
    selectedState,
    changeState,
    loading,
    error,
    lastUpdated,
    refresh: loadRates,
    setRates: setManualRatesOverride,
    resetRates,
  };

  return (
    <RatesContext.Provider value={value}>
      {children}
    </RatesContext.Provider>
  );
}

export function useRatesContext() {
  const context = useContext(RatesContext);
  if (!context) {
    throw new Error("useRatesContext must be used within RatesProvider");
  }
  return context;
}
