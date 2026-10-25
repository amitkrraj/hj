import React from "react";
import { FaArrowUp, FaArrowDown, FaSync } from "react-icons/fa";
import { useRatesContext } from "../context/RatesContext";
import { INDIAN_STATES, getStateByCode } from "../config/liveRatesApi";
import { formatPrice } from "../utils/priceCalculator";
import SectionHeading from "../components/SectionHeading";

const LiveRatePage = () => {
  const { liveRates, rates, selectedState, changeState, loading, error, lastUpdated, refresh } = useRatesContext();
  
  const currentState = getStateByCode(selectedState);

  const goldPurities = [
    { purity: "24K", factor: 1 },
    { purity: "22K", factor: 0.916 },
    { purity: "18K", factor: 0.75 },
  ];

  const silverPurities = [
    { purity: "999", factor: 1 },
    { purity: "925", factor: 0.925 },
  ];

  const goldBaseRate = liveRates?.gold?.buy || 0;
  const silverBaseRate = liveRates?.silver?.buy || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Live Gold & Silver Rates</h1>
          <p className="text-amber-100">Real-time prices updated every 5 minutes</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Select Your State</label>
              <select
                value={selectedState}
                onChange={(e) => changeState(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 min-w-[200px]"
              >
                {INDIAN_STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Local premium: +{currentState?.premium || 0}%
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">
                Last Updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "—"}
              </p>
              <button
                onClick={refresh}
                disabled={loading}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <FaSync className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {error && !liveRates && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 text-center">
            <p className="text-red-600 mb-2">Unable to fetch live rates</p>
            <p className="text-sm text-gray-500">Showing manual rates. Please try again later.</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Gold (24K)</h2>
              {liveRates?.gold?.change24h?.buy !== 0 && (
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  liveRates?.gold?.change24h?.buy > 0 ? "bg-green-500" : "bg-red-500"
                }`}>
                  {liveRates?.gold?.change24h?.buy > 0 ? <FaArrowUp /> : <FaArrowDown />}
                  {Math.abs(liveRates?.gold?.change24h?.buy || 0).toFixed(2)}%
                </span>
              )}
            </div>
            <p className="text-4xl font-bold mb-2">{formatPrice(goldBaseRate)}</p>
            <p className="text-amber-100">per gram (excl. GST)</p>
            <div className="mt-4 pt-4 border-t border-amber-300/30">
              <p className="text-sm text-amber-100">
                GST (3%): {formatPrice(liveRates?.gold?.gst || 0)}
              </p>
              <p className="text-sm text-amber-100">
                With GST: {formatPrice(goldBaseRate + (liveRates?.gold?.gst || 0))}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Silver (999)</h2>
              {liveRates?.silver?.change24h?.buy !== 0 && (
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  liveRates?.silver?.change24h?.buy > 0 ? "bg-green-500" : "bg-red-500"
                }`}>
                  {liveRates?.silver?.change24h?.buy > 0 ? <FaArrowUp /> : <FaArrowDown />}
                  {Math.abs(liveRates?.silver?.change24h?.buy || 0).toFixed(2)}%
                </span>
              )}
            </div>
            <p className="text-4xl font-bold mb-2">{formatPrice(silverBaseRate)}</p>
            <p className="text-gray-200">per gram (excl. GST)</p>
            <div className="mt-4 pt-4 border-t border-gray-300/30">
              <p className="text-sm text-gray-200">
                GST (3%): {formatPrice(liveRates?.silver?.gst || 0)}
              </p>
              <p className="text-sm text-gray-200">
                With GST: {formatPrice(silverBaseRate + (liveRates?.silver?.gst || 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Gold Rates by Purity</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Purity</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium">Per Gram</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium">Per 10 Gram</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium">Per Tola (11.66g)</th>
                </tr>
              </thead>
              <tbody>
                {goldPurities.map(({ purity, factor }) => {
                  const rate = Math.round(goldBaseRate * factor);
                  return (
                    <tr key={purity} className="border-b last:border-b-0">
                      <td className="py-3 px-4 font-medium text-amber-600">{purity}</td>
                      <td className="py-3 px-4 text-right">{formatPrice(rate)}</td>
                      <td className="py-3 px-4 text-right">{formatPrice(rate * 10)}</td>
                      <td className="py-3 px-4 text-right">{formatPrice(Math.round(rate * 11.66))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Silver Rates by Purity</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Purity</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium">Per Gram</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium">Per 100 Gram</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium">Per KG</th>
                </tr>
              </thead>
              <tbody>
                {silverPurities.map(({ purity, factor }) => {
                  const rate = Math.round(silverBaseRate * factor);
                  return (
                    <tr key={purity} className="border-b last:border-b-0">
                      <td className="py-3 px-4 font-medium text-gray-600">{purity}</td>
                      <td className="py-3 px-4 text-right">{formatPrice(rate)}</td>
                      <td className="py-3 px-4 text-right">{formatPrice(rate * 100)}</td>
                      <td className="py-3 px-4 text-right">{formatPrice(rate * 1000)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h4 className="font-semibold text-amber-800 mb-2">Disclaimer</h4>
          <p className="text-sm text-amber-700">
            The rates displayed are indicative and sourced from OroPocket. Actual rates at our store may vary slightly 
            based on market conditions. For exact pricing, please visit our store or contact us directly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveRatePage;
