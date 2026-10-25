import React, { useState } from "react";
import { FaSave, FaUndo, FaPlus, FaTrash } from "react-icons/fa";
import { useRatesAdmin } from "../../hooks/useProducts";

const AdminRates = () => {
  const { rates, saveRates, resetToDefault } = useRatesAdmin();
  const [formData, setFormData] = useState(rates);
  const [saved, setSaved] = useState(false);

  const handleRateChange = (material, purity, value) => {
    setFormData(prev => ({
      ...prev,
      [material]: {
        ...prev[material],
        [purity]: Number(value) || 0,
      },
    }));
    setSaved(false);
  };

  const handleAddPurity = (material) => {
    const purityName = prompt(`Enter new purity for ${material.toUpperCase()} (e.g., 18K, 999):`);
    if (purityName && purityName.trim()) {
      setFormData(prev => ({
        ...prev,
        [material]: {
          ...prev[material],
          [purityName.trim().toUpperCase()]: 0,
        },
      }));
      setSaved(false);
    }
  };

  const handleRemovePurity = (material, purity) => {
    if (window.confirm(`Remove ${purity} from ${material}?`)) {
      setFormData(prev => {
        const updated = { ...prev };
        const materialRates = { ...updated[material] };
        delete materialRates[purity];
        updated[material] = materialRates;
        return updated;
      });
      setSaved(false);
    }
  };

  const handleSave = () => {
    saveRates(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Reset to live API rates? This will clear manual overrides.")) {
      resetToDefault();
      setFormData(rates);
      setSaved(false);
    }
  };

  if (!formData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Rate Management</h1>
        <p className="text-gray-500">Override live rates with manual values (for fallback)</p>
      </div>

      {saved && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl mb-6">
          Rates saved! Product prices will use these rates.
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-amber-800 text-sm">
          <strong>Note:</strong> By default, rates are fetched from the live API. 
          Use this page only if you need to override rates manually (e.g., when API is down).
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-amber-600">🥇 Gold Rates (₹ per gram)</h2>
          <button
            onClick={() => handleAddPurity("gold")}
            className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <FaPlus size={12} /> Add Purity
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(formData.gold || {}).map(([purity, rate]) => (
            <div key={purity} className="relative group">
              <label className="block text-sm font-medium text-gray-600 mb-1">{purity}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => handleRateChange("gold", purity, e.target.value)}
                  className="w-full pl-8 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  onClick={() => handleRemovePurity("gold", purity)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-500">🥈 Silver Rates (₹ per gram)</h2>
          <button
            onClick={() => handleAddPurity("silver")}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <FaPlus size={12} /> Add Purity
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(formData.silver || {}).map(([purity, rate]) => (
            <div key={purity} className="relative group">
              <label className="block text-sm font-medium text-gray-600 mb-1">{purity}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => handleRateChange("silver", purity, e.target.value)}
                  className="w-full pl-8 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <button
                  onClick={() => handleRemovePurity("silver", purity)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-blue-600">💎 Platinum Rates (₹ per gram)</h2>
          <button
            onClick={() => handleAddPurity("platinum")}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FaPlus size={12} /> Add Purity
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(formData.platinum || {}).map(([purity, rate]) => (
            <div key={purity} className="relative group">
              <label className="block text-sm font-medium text-gray-600 mb-1">{purity}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => handleRateChange("platinum", purity, e.target.value)}
                  className="w-full pl-8 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => handleRemovePurity("platinum", purity)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSave}
          className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
        >
          <FaSave /> Save Rates
        </button>
        <button
          onClick={handleReset}
          className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          <FaUndo /> Reset to Live Rates
        </button>
      </div>
    </div>
  );
};

export default AdminRates;
