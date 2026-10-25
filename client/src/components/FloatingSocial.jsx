import React from "react";
import { FaWhatsapp, FaPhone } from "react-icons/fa";
import { useSiteConfig } from "../context/SiteConfigContext";

const FloatingSocial = () => {
  const { config } = useSiteConfig();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <a
        href={`tel:${config.contact.phone}`}
        className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-amber-600 transition-all hover:scale-110 float-btn"
        title="Call Us"
        style={{ animationDelay: "0.5s" }}
      >
        <FaPhone size={20} />
      </a>
      <a
        href={`https://wa.me/${config.contact.whatsapp}?text=Hi, I'm interested in your jewellery collection.`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 transition-all hover:scale-110 float-btn"
        title="WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>
    </div>
  );
};

export default FloatingSocial;
