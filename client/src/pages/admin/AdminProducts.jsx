import React, { useState, useMemo } from "react";
import { FaPlus, FaTrash, FaEdit, FaImage } from "react-icons/fa";
import { useProducts } from "../../hooks/useProducts";
import { addCustomProduct, removeCustomProductsById, buildProductId } from "../../utils/customProducts";
import { getAllCategories, addCategory } from "../../utils/categoryManager";
import { DEFAULTS } from "../../config/defaults";
import { isValidImageUrl, sanitizeInput } from "../../utils/security";

const PURITY_OPTIONS = {
  gold: ["18K", "22K", "24K"],
  silver: ["925", "999"],
  platinum: ["950"],
};

const initialForm = () => ({
  material: "gold",
  category: "",
  newCategory: "",
  name: "",
  weight: "",
  size: "",
  purity: "22K",
  makingCharge: "0",
  otherCharge: "0",
  gst: "3",
  discount: "0",
  image: "",
});

const AdminProducts = () => {
  const { products, refreshCustomProducts, customProductIds } = useProducts();
  const [form, setForm] = useState(initialForm);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const categories = getAllCategories();

  const categoryValue = form.category === "__new__" 
    ? form.newCategory.trim().toLowerCase().replace(/\s+/g, "-") 
    : form.category;

  const productId = useMemo(
    () => buildProductId(form.material, categoryValue, form.name),
    [form.material, categoryValue, form.name]
  );

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError("");
    
    if (field === "material") {
      const purities = PURITY_OPTIONS[value] || [];
      setForm(prev => ({ ...prev, purity: purities[0] || prev.purity }));
    }
    
    if (field === "image") {
      if (value && isValidImageUrl(value)) {
        setImagePreview(value);
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.category && !form.newCategory) {
      setError("Please select or create a category");
      return;
    }

    if (form.category === "__new__" && !form.newCategory.trim()) {
      setError("Please enter a category name");
      return;
    }

    if (!form.name.trim()) {
      setError("Please enter a product name");
      return;
    }

    if (!form.weight || parseFloat(form.weight) <= 0) {
      setError("Please enter a valid weight");
      return;
    }

    if (form.image && !isValidImageUrl(form.image)) {
      setError("Please enter a valid Google Drive image URL");
      return;
    }

    if (form.category === "__new__") {
      const result = addCategory({ name: form.newCategory.trim() });
      if (!result.success) {
        setError(result.error);
        return;
      }
    }

    const product = {
      id: productId,
      weight: parseFloat(form.weight) || 0,
      size: form.size.trim() || null,
      purity: form.purity,
      makingCharge: parseFloat(form.makingCharge) || 0,
      otherCharge: parseFloat(form.otherCharge) || 0,
      gst: parseFloat(form.gst) || 3,
      discount: parseFloat(form.discount) || 0,
      image: form.image.trim() || null,
    };

    addCustomProduct(product);
    refreshCustomProducts();
    setForm(initialForm());
    setImagePreview(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRemove = (id) => {
    if (!customProductIds.has(id)) return;
    if (window.confirm(`Remove product "${id}"?`)) {
      removeCustomProductsById(id);
      refreshCustomProducts();
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
        <p className="text-gray-500">Add products with Google Drive image links</p>
      </div>

      {saved && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl mb-6">
          Product added successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-amber-600 mb-4 flex items-center gap-2">
          <FaPlus size={14} /> Add Product
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Material *</label>
            <select
              value={form.material}
              onChange={(e) => handleChange("material", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            >
              {DEFAULTS.materials.map(m => (
                <option key={m} value={m}>{DEFAULTS.materialNames[m]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Category *</label>
            <select
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            >
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.slug || c.id}>{c.name}</option>
              ))}
              <option value="__new__">+ Create New Category</option>
            </select>
            {form.category === "__new__" && (
              <input
                type="text"
                value={form.newCategory}
                onChange={(e) => handleChange("newCategory", e.target.value)}
                placeholder="e.g. Anklets"
                className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
              />
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", sanitizeInput(e.target.value))}
              placeholder="e.g. Royal Diamond Ring"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
            {productId && (
              <p className="text-xs text-gray-500 mt-1">ID: {productId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Weight (grams) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Size (optional)</label>
            <input
              type="text"
              value={form.size}
              onChange={(e) => handleChange("size", e.target.value)}
              placeholder="e.g. 10, M, Free Size"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Purity</label>
            <select
              value={form.purity}
              onChange={(e) => handleChange("purity", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            >
              {(PURITY_OPTIONS[form.material] || []).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Making Charge (₹)</label>
            <input
              type="number"
              min="0"
              value={form.makingCharge}
              onChange={(e) => handleChange("makingCharge", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Other Charges (₹)</label>
            <input
              type="number"
              min="0"
              value={form.otherCharge}
              onChange={(e) => handleChange("otherCharge", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">GST (%)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.gst}
              onChange={(e) => handleChange("gst", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Discount (₹)</label>
            <input
              type="number"
              min="0"
              value={form.discount}
              onChange={(e) => handleChange("discount", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              <FaImage className="inline mr-1" /> Image (Google Drive Link)
            </label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              Paste the share link from Google Drive. Make sure the file is shared publicly.
            </p>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview.replace(/\/file\/d\/([^/]+)\/.*/, "/uc?export=view&id=$1").replace("drive.google.com", "lh3.googleusercontent.com/d").replace("/uc?export=view&id=", "/")}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Products ({products.length})
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th className="pb-3 pr-4">Product</th>
                <th className="pb-3 pr-4">Material</th>
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 pr-4">Weight</th>
                <th className="pb-3 pr-4">Source</th>
                <th className="pb-3 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium">{p.name}</td>
                  <td className="py-3 pr-4">{p.materialDisplay}</td>
                  <td className="py-3 pr-4">{p.categoryDisplay}</td>
                  <td className="py-3 pr-4">{p.variants[0]?.weight}g</td>
                  <td className="py-3 pr-4">
                    {customProductIds.has(p.id) ? (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs">Admin</span>
                    ) : (
                      <span className="text-gray-400 text-xs">Sheet</span>
                    )}
                  </td>
                  <td className="py-3">
                    {customProductIds.has(p.id) && (
                      <button
                        onClick={() => handleRemove(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <p className="text-gray-500 py-8 text-center">
            No products yet. Add from the form above or configure Google Sheets.
          </p>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Tip: Bulk Import</h4>
        <p className="text-sm text-blue-700">
          For adding many products at once, use Google Sheets. Create a spreadsheet with columns: 
          id, weight, size, purity, makingCharge, otherCharge, gst, discount, image. 
          Then publish it as CSV and add the URL in Site Settings.
        </p>
      </div>
    </div>
  );
};

export default AdminProducts;
