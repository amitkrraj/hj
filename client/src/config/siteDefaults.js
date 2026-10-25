/**
 * Default Site Configuration for Hira Jewellers
 * All values can be edited via Admin Panel
 */

export const DEFAULT_SITE_CONFIG = {
  shopName: "Hira Jewellers",
  tagline: "आभूषण एक, खुशियां अनेक",
  established: "Since Generations",
  
  contact: {
    phone: "7229842042",
    whatsapp: "917229842042",
    email: "hirajewllers77@gmail.com",
    address: "Subhash Chowk, Sabji Mandi, Sanchore, Rajasthan - 343041",
  },
  
  mapUrl: "https://goo.gl/maps/FoKBKjVyjnTpKYuLA",
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d452.90504546659326!2d71.7731983!3d24.7529466!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3944a515d246ec6d%3A0x5dec4bccfae50847!2sHira%20jewellers!5e0!3m2!1sen!2sin!4v1628085065124!5m2!1sen!2sin",
  
  defaultState: "RJ",
  workingHours: "10:00 AM - 9:00 PM (All Days)",
  announcementBar: "",
  
  social: {
    facebook: "https://www.facebook.com/111096518083488",
    instagram: "https://www.instagram.com/_hirajewellers/",
    twitter: "https://twitter.com/HiraJewellers",
  },
  
  owners: [
    { name: "Hiralal Ji", title: "Founder", image: "/images/hirajipic.jpeg" },
    { name: "Tarun Ji", title: "Owner", image: null },
  ],
  
  trustBadges: [
    { icon: "certificate", text: "100% Certified Jewellery" },
    { icon: "exchange", text: "Lifetime Exchange & Repairing" },
    { icon: "shop", text: "Physical Store" },
    { icon: "hallmark", text: "BIS Hallmarked" },
  ],
  
  aboutText: `ऐसा कहा जाता है कि सुंदरता देखने वाले की आंखों में होती है और आभूषण अनादि काल से उस देखने वाले के रूप और भाव को बढ़ाते हैं। इस प्रकार यदि आप पहले से तय किए गए गहनों की तलाश कर रहे हैं, तो हीरा ज्वैलर्स आपका प्राकृतिक गंतव्य होना चाहिए।

बिना समझौता गुणवत्ता, शिल्प कौशल और नवीन आभूषण डिजाइनों के साथ हीरा ज्वैलर्स के विकल्पों के लिए आप निश्चित रूप से इच्छुक हो जाएंगे। रिश्ता यहीं खत्म नहीं होता है, यदि आपके मन में कोई डिज़ाइन है, तो हीरा ज्वैलर्स में आप निश्चिंत हो सकते हैं कि उस डिज़ाइन को जीवन में लाया जाएगा।

यह उल्लेख करने की आवश्यकता नहीं है कि सभी आभूषण हॉलमार्क हैं ताकि आपको न केवल मन की पूर्ण शांति मिले बल्कि यह भी आश्वासन मिले कि आप भविष्य में कभी भी अपने उत्पाद का आदान-प्रदान कर सकते हैं।`,
};

export const DEFAULT_HERO_IMAGES = [
  {
    id: 1,
    image: "/images/banner/3713600.jpg",
    logo: "/images/logos/logo3.png",
    showLogo: true,
    title: "Hira Jewellers",
    subtitle: "आभूषण एक, खुशियां अनेक",
    ctaText: "View Collection",
    ctaLink: "/shop",
    ctaSecondary: "Contact Us",
    ctaSecondaryLink: "/about",
  },
  {
    id: 2,
    image: "/images/banner/3713553.jpg",
    title: "Wedding Collection",
    subtitle: "Make Your Special Day Memorable",
    ctaText: "Shop Now",
    ctaLink: "/shop?category=wedding-sets",
  },
  {
    id: 3,
    image: "/images/banner/3713990.jpg",
    title: "Gold Jewellery",
    subtitle: "Timeless Elegance, Pure Gold",
    ctaText: "Explore Gold",
    ctaLink: "/shop?material=gold",
  },
  {
    id: 4,
    image: "/images/banner/3714008.jpg",
    title: "Silver Collection",
    subtitle: "Stunning Silver Designs",
    ctaText: "View Silver",
    ctaLink: "/shop?material=silver",
  },
];
