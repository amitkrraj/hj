import React, { useState, useMemo, useEffect } from "react";
import { FaSearch, FaWhatsapp, FaPhone, FaChevronDown, FaBars, FaTimes, FaMapMarkerAlt, FaCaretUp, FaCaretDown } from "react-icons/fa";
import { Drawer } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useRatesContext } from "../context/RatesContext";
import { buildNavigation, getStaticNavigation } from "../utils/navigationBuilder";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  
  const { config } = useSiteConfig();
  const { products, loading: productsLoading } = useProducts();
  const { liveRates, loading: ratesLoading } = useRatesContext();
  
  const navItems = useMemo(() => {
    if (productsLoading || !products || products.length === 0) {
      return getStaticNavigation();
    }
    return buildNavigation(products);
  }, [products, productsLoading]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = (idx) => {
    setExpandedMenus(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
      setIsDrawerOpen(false);
    }
  };

  const goldRate = liveRates?.gold?.buy || 0;
  const silverRate = liveRates?.silver?.buy || 0;
  const goldChange = liveRates?.gold?.change24h?.buy || 0;
  const silverChange = liveRates?.silver?.change24h?.buy || 0;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-xl" : ""}`}>
      {/* Top Strip */}
      <div className={`bg-white border-b border-gray-100 transition-all duration-300 ${scrolled ? "py-1" : "py-2"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-end">
            {/* Live Rates - Right Aligned */}
            <Link 
              to="/live-rate" 
              className="flex items-center gap-3 sm:gap-5 hover:opacity-80 transition-all"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 text-xs font-medium">Gold:</span>
                <span className="font-bold text-amber-600 text-sm">
                  {ratesLoading ? "..." : `₹${goldRate.toLocaleString('en-IN')}`}
                </span>
                {goldChange !== 0 && (
                  goldChange > 0 ? (
                    <FaCaretUp className="text-green-500" size={14} />
                  ) : (
                    <FaCaretDown className="text-red-500" size={14} />
                  )
                )}
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 text-xs font-medium">Silver:</span>
                <span className="font-bold text-gray-700 text-sm">
                  {ratesLoading ? "..." : `₹${silverRate.toLocaleString('en-IN')}`}
                </span>
                {silverChange !== 0 && (
                  silverChange > 0 ? (
                    <FaCaretUp className="text-green-500" size={14} />
                  ) : (
                    <FaCaretDown className="text-red-500" size={14} />
                  )
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header with Background */}
      <div 
        className={`relative bg-cover bg-center bg-no-repeat transition-all duration-300 ${scrolled ? "py-2" : "py-3 lg:py-4"}`}
        style={{ backgroundImage: "url('/images/banner/Like-Stars-edit.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Left: Menu Button (Mobile/Tablet) */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="lg:hidden w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <FaBars size={18} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 lg:flex-shrink-0">
              <img 
                src="/images/logos/logo5.png" 
                alt="Hira Jewellers" 
                className={`transition-all duration-300 ${scrolled ? "h-9 lg:h-10" : "h-10 lg:h-14"}`}
              />
              <div className="hidden sm:block">
                <h1 className={`font-bold text-white tracking-wide transition-all duration-300 ${scrolled ? "text-base lg:text-lg" : "text-lg lg:text-xl"}`} style={{ fontFamily: "Georgia, serif" }}>
                  Hira Jewellers
                </h1>
                <p className="text-amber-400 text-xs">{config.tagline}</p>
              </div>
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Bar - Desktop (Right Side) */}
              <form onSubmit={handleSearch} className="hidden lg:flex relative">
                <input
                  type="text"
                  placeholder="Search jewellery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-4 pr-10 py-2 bg-white/95 rounded-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-lg"
                />
                <button 
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
                >
                  <FaSearch size={12} />
                </button>
              </form>

              {/* Search (Mobile/Tablet) */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="lg:hidden w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <FaSearch size={16} />
              </button>

              {/* Call */}
              <a
                href={`tel:${config.contact.phone}`}
                className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white hover:bg-amber-600 transition-colors shadow-lg"
                title="Call Us"
              >
                <FaPhone size={14} />
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${config.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors shadow-lg"
                title="WhatsApp"
              >
                <FaWhatsapp size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Desktop */}
      <nav className={`hidden lg:block bg-white shadow-md transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center">
            {navItems.map((item, idx) => (
              <li key={idx} className="relative group">
                <Link
                  to={item.href}
                  className="flex items-center gap-1 px-5 py-3 text-gray-700 hover:text-amber-600 transition-colors text-sm font-medium"
                >
                  {item.label}
                  {item.children && item.children.length > 0 && (
                    <FaChevronDown className="text-[9px] opacity-50 group-hover:rotate-180 transition-transform duration-200" />
                  )}
                </Link>
                
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-amber-500 group-hover:w-3/4 transition-all duration-300"></span>
                
                {item.children && item.children.length > 0 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-2 min-w-[180px]">
                      {item.children.map((child, cIdx) => (
                        <Link
                          key={cIdx}
                          to={child.href}
                          className="block px-4 py-2 text-gray-600 hover:bg-amber-50 hover:text-amber-700 transition-colors text-sm"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40 p-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search for gold, silver, rings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); setExpandedMenus({}); }}
      >
        <div className="w-80 h-full flex flex-col bg-white">
          {/* Drawer Header */}
          <div 
            className="p-5 bg-cover bg-center relative"
            style={{ backgroundImage: "url('/images/banner/Like-Stars-edit.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/70"></div>
            <div className="relative">
              <div className="flex justify-between items-center">
                <Link to="/" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3">
                  <img src="/images/logos/logo5.png" alt="Logo" className="h-10 w-auto" />
                  <div>
                    <h2 className="text-lg font-bold text-white">{config.shopName}</h2>
                    <p className="text-xs text-amber-400">{config.tagline}</p>
                  </div>
                </Link>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Mobile Live Rates */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link 
                  to="/live-rate" 
                  onClick={() => setIsDrawerOpen(false)}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/20 transition-colors"
                >
                  <p className="text-xs text-amber-300">24K Gold</p>
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-lg font-bold text-white">₹{goldRate.toLocaleString('en-IN')}</p>
                    {goldChange !== 0 && (
                      goldChange > 0 ? <FaCaretUp className="text-green-400" size={14} /> : <FaCaretDown className="text-red-400" size={14} />
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400">per gram</p>
                </Link>
                <Link 
                  to="/live-rate" 
                  onClick={() => setIsDrawerOpen(false)}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/20 transition-colors"
                >
                  <p className="text-xs text-gray-300">999 Silver</p>
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-lg font-bold text-white">₹{silverRate.toLocaleString('en-IN')}</p>
                    {silverChange !== 0 && (
                      silverChange > 0 ? <FaCaretUp className="text-green-400" size={14} /> : <FaCaretDown className="text-red-400" size={14} />
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400">per gram</p>
                </Link>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mt-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search jewellery..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                  />
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                </div>
              </form>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto">
            {navItems.map((item, idx) => (
              <div key={idx} className="border-b border-gray-100">
                {item.children && item.children.length > 0 ? (
                  <>
                    <button
                      onClick={() => toggleMenu(idx)}
                      className="w-full flex items-center justify-between px-5 py-4 text-gray-800 hover:bg-amber-50 transition-colors"
                    >
                      <span className="font-medium">{item.label}</span>
                      <FaChevronDown className={`text-xs text-gray-400 transition-transform duration-200 ${expandedMenus[idx] ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-200 ${expandedMenus[idx] ? 'max-h-96' : 'max-h-0'}`}>
                      <div className="bg-gray-50 py-1">
                        <Link
                          to={item.href}
                          className="block px-8 py-2.5 text-amber-600 text-sm font-medium"
                          onClick={() => setIsDrawerOpen(false)}
                        >
                          View All
                        </Link>
                        {item.children.map((child, cIdx) => (
                          <Link
                            key={cIdx}
                            to={child.href}
                            className="block px-8 py-2.5 text-gray-600 hover:text-amber-600 text-sm"
                            onClick={() => setIsDrawerOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className="block px-5 py-4 text-gray-800 hover:bg-amber-50 font-medium transition-colors"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <a
              href={config.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 mb-3"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaMapMarkerAlt className="text-amber-600" size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Visit Store</p>
                <p className="text-xs text-gray-500">Sanchore, Rajasthan</p>
              </div>
            </a>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${config.contact.phone}`}
                className="flex items-center justify-center gap-2 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors"
              >
                <FaPhone size={14} />
                <span>Call</span>
              </a>
              <a
                href={`https://wa.me/${config.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                <FaWhatsapp size={16} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
