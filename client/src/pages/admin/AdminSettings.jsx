import React, { useState } from "react";
import { FaSave, FaUndo } from "react-icons/fa";
import { getSiteConfig, updateSiteConfig, resetSiteConfig } from "../../utils/siteConfigManager";
import { useSiteConfig } from "../../context/SiteConfigContext";
import { sanitizeInput, sanitizeUrl } from "../../utils/security";

const AdminSettings = () => {
  const { refreshConfig } = useSiteConfig();
  const [config, setConfig] = useState(getSiteConfig);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setSaved(false);
    setError("");
  };

  const handleContactChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
    setSaved(false);
  };

  const handleSocialChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      social: { ...prev.social, [field]: value },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    const result = updateSiteConfig(config);
    if (result.success) {
      refreshConfig();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result.error || "Failed to save");
    }
  };

  const handleReset = () => {
    if (!window.confirm("Reset all settings to default? This cannot be undone.")) return;
    const defaultConfig = resetSiteConfig();
    setConfig(defaultConfig);
    refreshConfig();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Site Settings</h1>
        <p className="text-gray-500">Customize your store information</p>
      </div>

      {saved && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl mb-6">
          Settings saved successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-amber-600 mb-4">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Shop Name</label>
            <input
              type="text"
              value={config.shopName}
              onChange={(e) => handleChange("shopName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tagline</label>
            <input
              type="text"
              value={config.tagline}
              onChange={(e) => handleChange("tagline", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Established</label>
            <input
              type="text"
              value={config.established}
              onChange={(e) => handleChange("established", e.target.value)}
              placeholder="e.g. Since 1990"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Working Hours</label>
            <input
              type="text"
              value={config.workingHours}
              onChange={(e) => handleChange("workingHours", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Announcement Bar</label>
          <input
            type="text"
            value={config.announcementBar}
            onChange={(e) => handleChange("announcementBar", e.target.value)}
            placeholder="e.g. Free Shipping on Orders Above ₹50,000"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-amber-600 mb-4">Contact Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
            <input
              type="tel"
              value={config.contact.phone}
              onChange={(e) => handleContactChange("phone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">WhatsApp (with country code)</label>
            <input
              type="tel"
              value={config.contact.whatsapp}
              onChange={(e) => handleContactChange("whatsapp", e.target.value)}
              placeholder="e.g. 917229842042"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={config.contact.email}
              onChange={(e) => handleContactChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
            <input
              type="text"
              value={config.contact.address}
              onChange={(e) => handleContactChange("address", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-amber-600 mb-4">Social Media Links</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Facebook</label>
            <input
              type="url"
              value={config.social.facebook}
              onChange={(e) => handleSocialChange("facebook", e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Instagram</label>
            <input
              type="url"
              value={config.social.instagram}
              onChange={(e) => handleSocialChange("instagram", e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Twitter</label>
            <input
              type="url"
              value={config.social.twitter}
              onChange={(e) => handleSocialChange("twitter", e.target.value)}
              placeholder="https://twitter.com/..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-amber-600 mb-4">Map Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Google Maps Link</label>
            <input
              type="url"
              value={config.mapUrl}
              onChange={(e) => handleChange("mapUrl", e.target.value)}
              placeholder="https://goo.gl/maps/..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Google Maps Embed URL</label>
            <input
              type="url"
              value={config.mapEmbed}
              onChange={(e) => handleChange("mapEmbed", e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get this from Google Maps → Share → Embed a map → Copy the src URL
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-amber-600 mb-4">About Us Text</h2>
        <textarea
          value={config.aboutText}
          onChange={(e) => handleChange("aboutText", e.target.value)}
          rows={8}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
          placeholder="Enter your store's story..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Use double line breaks to create paragraphs.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSave}
          className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
        >
          <FaSave /> Save Settings
        </button>
        <button
          onClick={handleReset}
          className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          <FaUndo /> Reset to Default
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
