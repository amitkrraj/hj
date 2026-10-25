import React from "react";
import HeroSection from "../components/HeroSection";
import Categories from "../components/Categories";
import BestSellerProducts from "../components/BestSellerProducts";
import WeddingSetSection from "../components/WeddingSetSection";
import WhyBuyFromUs from "../components/WhyBuyFromUs";
import LiveRateWidget from "../components/LiveRateWidget";
import SectionHeading from "../components/SectionHeading";
import { useSiteConfig } from "../context/SiteConfigContext";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const HomePage = () => {
  const { config } = useSiteConfig();

  return (
    <div className="flex flex-col bg-white">
      <HeroSection />

      {/* Live Rates Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <LiveRateWidget />
        </div>
      </section>

      <BestSellerProducts />

      <WeddingSetSection />

      <Categories />

      <WhyBuyFromUs />

      {/* Contact Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="Contact Us" subtitle="Visit our store or get in touch" />
          
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Contact Info */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="space-y-6">
                <a 
                  href={config.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-amber-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                    <FaMapMarkerAlt className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Address</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{config.contact.address}</p>
                  </div>
                </a>

                <a 
                  href={`tel:${config.contact.phone}`}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-amber-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                    <FaPhone className="text-amber-600" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Call Us</h4>
                    <p className="text-gray-600 text-sm">{config.contact.phone}</p>
                  </div>
                </a>

                <a 
                  href={`mailto:${config.contact.email}`}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-amber-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                    <FaEnvelope className="text-amber-600" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                    <p className="text-gray-600 text-sm">{config.contact.email}</p>
                  </div>
                </a>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Working Hours</p>
                <p className="font-medium text-gray-800">{config.workingHours}</p>
              </div>
            </div>
            
            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] md:h-full min-h-[400px]">
              <iframe
                src={config.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Store Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
