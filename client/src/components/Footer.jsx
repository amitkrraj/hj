import React from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { useSiteConfig } from "../context/SiteConfigContext";

const Footer = () => {
  const { config } = useSiteConfig();

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Collection", href: "/shop" },
    { label: "Gold", href: "/shop?material=gold" },
    { label: "Silver", href: "/shop?material=silver" },
    { label: "Coins", href: "/shop?category=coins" },
    { label: "Live Rate", href: "/live-rate" },
    { label: "About Us", href: "/about" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logos/logo5.png" alt="Hira Jewellers" className="h-14 w-auto" />
              <div>
                <h3 className="text-xl font-bold" style={{ fontFamily: "Georgia, serif" }}>Hira Jewellers</h3>
                <p className="text-amber-400 text-sm">{config.tagline}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">{config.established}</p>
            
            <div className="flex gap-3 mt-6">
              {config.social.facebook && (
                <a 
                  href={config.social.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all"
                >
                  <FaFacebook size={18} />
                </a>
              )}
              {config.social.instagram && (
                <a 
                  href={config.social.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 transition-all"
                >
                  <FaInstagram size={18} />
                </a>
              )}
              {config.social.twitter && (
                <a 
                  href={config.social.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-400 transition-all"
                >
                  <FaTwitter size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-amber-500"></span>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-amber-500/50 rounded-full group-hover:bg-amber-400 transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Get in Touch
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-amber-500"></span>
            </h4>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${config.contact.phone}`} className="flex items-center gap-3 text-gray-400 hover:text-amber-400 transition-colors group">
                  <div className="w-9 h-9 bg-amber-500/20 rounded-lg flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                    <FaPhone className="text-amber-400" size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Call Us</p>
                    <p className="text-sm">{config.contact.phone}</p>
                  </div>
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${config.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors group">
                  <div className="w-9 h-9 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <FaWhatsapp className="text-green-400" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">WhatsApp</p>
                    <p className="text-sm">+91 {config.contact.whatsapp.slice(-10)}</p>
                  </div>
                </a>
              </li>
              <li>
                <a href={`mailto:${config.contact.email}`} className="flex items-center gap-3 text-gray-400 hover:text-amber-400 transition-colors group">
                  <div className="w-9 h-9 bg-amber-500/20 rounded-lg flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                    <FaEnvelope className="text-amber-400" size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm truncate max-w-[180px]">{config.contact.email}</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* Visit Us */}
          <div>
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Visit Us
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-amber-500"></span>
            </h4>
            <a href={config.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-gray-400 hover:text-amber-400 transition-colors group mb-4">
              <div className="w-9 h-9 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/30 transition-colors mt-0.5">
                <FaMapMarkerAlt className="text-amber-400" size={14} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm leading-relaxed">{config.contact.address}</p>
              </div>
            </a>
            <div className="mt-4 pl-12">
              <p className="text-xs text-gray-500 mb-1">Working Hours</p>
              <p className="text-sm text-gray-300">{config.workingHours}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} {config.shopName}. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs flex items-center gap-1">
              Made with <span className="text-amber-500">💛</span> by 
              <a href="https://github.com/bhavesh65321" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400">Bhavesh Soni</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
