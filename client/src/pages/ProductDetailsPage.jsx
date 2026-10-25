import React from "react";
import { useParams, Link } from "react-router-dom";
import { FaWhatsapp, FaPhone, FaArrowLeft, FaWeight, FaGem } from "react-icons/fa";
import { useProduct } from "../hooks/useProducts";
import { useSiteConfig } from "../context/SiteConfigContext";
import { calculateVariantPrice, formatPrice, formatWeight } from "../utils/priceCalculator";
import { DEFAULTS } from "../config/defaults";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const { product, rates, loading, error } = useProduct(productId);
  const { config } = useSiteConfig();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-6 w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/shop" className="px-6 py-3 btn-gold rounded-full">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const mainVariant = product.variants[0];
  const priceDetails = calculateVariantPrice(mainVariant, rates);
  const productImage = product.image || mainVariant?.image || DEFAULTS.placeholderImage;

  const whatsappMessage = `Hi, I'm interested in ${product.name} (${product.materialDisplay}, ${mainVariant.weight}g, ${mainVariant.purity})`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link to="/shop" className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors">
            <FaArrowLeft size={14} />
            <span>Back to Shop</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm">
              <img
                src={productImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULTS.placeholderImage;
                }}
              />
            </div>

            {product.variants.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.variants.map((variant, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-amber-400 cursor-pointer"
                  >
                    <img
                      src={variant.image || productImage}
                      alt={`Variant ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                {product.materialDisplay}
              </span>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium ml-2">
                {product.categoryDisplay}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-800">{formatPrice(priceDetails.totalPrice)}</span>
                <span className="text-gray-500 text-sm">incl. GST</span>
              </div>
              <p className="text-sm text-gray-600">
                Rate: {formatPrice(priceDetails.ratePerGram)}/g ({mainVariant.purity})
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FaWeight className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Weight</p>
                    <p className="font-semibold text-gray-800">{formatWeight(mainVariant.weight)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FaGem className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Purity</p>
                    <p className="font-semibold text-gray-800">{mainVariant.purity}</p>
                  </div>
                </div>
              </div>

              {mainVariant.size && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500">Size: <span className="font-medium text-gray-800">{mainVariant.size}</span></p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Price Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Metal Value ({mainVariant.weight}g × {formatPrice(priceDetails.ratePerGram)})</span>
                  <span className="font-medium">{formatPrice(priceDetails.metalValue)}</span>
                </div>
                {priceDetails.makingCharge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Making Charge</span>
                    <span className="font-medium">{formatPrice(priceDetails.makingCharge)}</span>
                  </div>
                )}
                {priceDetails.otherCharge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Other Charges</span>
                    <span className="font-medium">{formatPrice(priceDetails.otherCharge)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (3%)</span>
                  <span className="font-medium">{formatPrice(priceDetails.gstAmount)}</span>
                </div>
                {priceDetails.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(priceDetails.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t font-bold text-base">
                  <span>Total</span>
                  <span className="text-amber-600">{formatPrice(priceDetails.totalPrice)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
              >
                <FaWhatsapp size={20} />
                Enquire on WhatsApp
              </a>
              <a
                href={`tel:${config.contact.phone}`}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
              >
                <FaPhone size={16} />
                Call Now
              </a>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              * Prices are indicative and may vary based on current gold rates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
