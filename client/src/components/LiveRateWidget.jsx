import React from "react";
import { Link } from "react-router-dom";
import { FaArrowUp, FaArrowDown, FaSync } from "react-icons/fa";
import { useRatesContext } from "../context/RatesContext";
import { INDIAN_STATES } from "../config/liveRatesApi";

const LiveRateWidget = ({ compact = false }) => {
  const { liveRates, selectedState, changeState, loading, error, lastUpdated, refresh } = useRatesContext();

  if (loading && !liveRates) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !liveRates) {
    return (
      <div className="bg-red-50 rounded-2xl p-6 text-center border border-red-200">
        <p className="text-red-600 mb-2">Unable to load rates</p>
        <Link to="/live-rate" className="text-amber-600 text-sm underline">View details</Link>
      </div>
    );
  }

  const goldRate = liveRates?.gold?.buy || 0;
  const silverRate = liveRates?.silver?.buy || 0;
  const goldChange = liveRates?.gold?.change24h?.buy || 0;
  const silverChange = liveRates?.silver?.change24h?.buy || 0;
  const mcxGold10g = liveRates?.gold?.mcx10g || 0;
  const mcxSilverKg = liveRates?.silver?.mcxKg || 0;

  if (compact) {
    return (
      <Link 
        to="/live-rate" 
        className="inline-flex items-center gap-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-full px-5 py-2.5 hover:shadow-md transition-all border border-amber-200"
      >
        <div className="flex items-center gap-2">
          <span className="text-amber-700 font-medium text-sm">Gold</span>
          <span className="font-bold text-gray-900">₹{goldRate.toLocaleString('en-IN')}</span>
        </div>
        <div className="w-px h-5 bg-amber-300"></div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-medium text-sm">Silver</span>
          <span className="font-bold text-gray-900">₹{silverRate.toLocaleString('en-IN')}</span>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-white">Live Gold & Silver Rates</h3>
            <p className="text-gray-400 text-sm mt-0.5">
              MCX India • {lastUpdated ? new Date(lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : "—"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedState}
              onChange={(e) => changeState(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {INDIAN_STATES.map((state) => (
                <option key={state.code} value={state.code} className="bg-gray-800">
                  {state.name}
                </option>
              ))}
            </select>
            <button
              onClick={refresh}
              disabled={loading}
              className="p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all disabled:opacity-50"
            >
              <FaSync className={loading ? "animate-spin" : ""} size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Rate Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Gold Card */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-amber-800 font-semibold">Gold (24K)</span>
              </div>
              {goldChange !== 0 && (
                <span className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full ${goldChange > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {goldChange > 0 ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
                  {Math.abs(goldChange).toFixed(2)}%
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{goldRate.toLocaleString('en-IN')}
              <span className="text-base font-normal text-gray-500">/g</span>
            </p>
            {mcxGold10g > 0 && (
              <p className="text-sm text-amber-700 mt-2">
                MCX: ₹{mcxGold10g.toLocaleString('en-IN')}/10g
              </p>
            )}
            <div className="mt-3 pt-3 border-t border-amber-200 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">22K</span>
                <span className="ml-2 font-semibold text-gray-800">₹{Math.round(goldRate * 0.916).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-gray-500">18K</span>
                <span className="ml-2 font-semibold text-gray-800">₹{Math.round(goldRate * 0.75).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Silver Card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-gray-700 font-semibold">Silver (999)</span>
              </div>
              {silverChange !== 0 && (
                <span className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full ${silverChange > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {silverChange > 0 ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
                  {Math.abs(silverChange).toFixed(2)}%
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{silverRate.toLocaleString('en-IN')}
              <span className="text-base font-normal text-gray-500">/g</span>
            </p>
            {mcxSilverKg > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                MCX: ₹{mcxSilverKg.toLocaleString('en-IN')}/kg
              </p>
            )}
            <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">925</span>
                <span className="ml-2 font-semibold text-gray-800">₹{Math.round(silverRate * 0.925).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-gray-500">Per kg</span>
                <span className="ml-2 font-semibold text-gray-800">₹{(silverRate * 1000).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 text-center">
          <Link 
            to="/live-rate" 
            className="inline-flex items-center gap-2 text-amber-600 text-sm font-medium hover:text-amber-700 transition-colors"
          >
            View detailed rates & calculator
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LiveRateWidget;
