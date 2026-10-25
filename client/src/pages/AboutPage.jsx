import React from "react";
import { FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useSiteConfig } from "../context/SiteConfigContext";
import SectionHeading from "../components/SectionHeading";

const AboutPage = () => {
  const { config } = useSiteConfig();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{config.shopName}</h1>
          <p className="text-amber-400 text-lg">{config.tagline}</p>
          <p className="text-gray-400 mt-2">{config.established}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <SectionHeading title="Our Story" />
            <div className="prose prose-gray max-w-none">
              {config.aboutText.split("\n\n").map((para, idx) => (
                <p key={idx} className="text-gray-600 mb-4 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Our Team</h3>
            <div className="space-y-6">
              {config.owners.map((owner, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {owner.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{owner.name}</h4>
                    <p className="text-amber-600 text-sm">{owner.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <SectionHeading title="Why Choose Us" subtitle="What makes us different" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.trustBadges.map((badge, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm text-center card-hover">
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <p className="font-medium text-gray-800">{badge.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h3>
            <div className="space-y-4">
              <a href={`tel:${config.contact.phone}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <FaPhone className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-800">{config.contact.phone}</p>
                </div>
              </a>

              <a href={`https://wa.me/${config.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaWhatsapp className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">WhatsApp</p>
                  <p className="font-semibold text-gray-800">+91 {config.contact.whatsapp.slice(-10)}</p>
                </div>
              </a>

              <a href={`mailto:${config.contact.email}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <FaEnvelope className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800 text-sm">{config.contact.email}</p>
                </div>
              </a>

              <a href={config.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <FaMapMarkerAlt className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold text-gray-800 text-sm">{config.contact.address}</p>
                </div>
              </a>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500 mb-1">Working Hours</p>
              <p className="font-semibold text-gray-800">{config.workingHours}</p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg h-[400px] md:h-full min-h-[400px]">
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
    </div>
  );
};

export default AboutPage;
