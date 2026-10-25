import React, { useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { getHeroImages, addHeroImage, updateHeroImage, deleteHeroImage, resetHeroImages } from "../../utils/siteConfigManager";
import { isValidImageUrl, sanitizeInput, sanitizeUrl } from "../../utils/security";

const AdminHeroImages = () => {
  const [images, setImages] = useState(getHeroImages);
  const [newImage, setNewImage] = useState({ image: "", title: "", subtitle: "", ctaText: "", ctaLink: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  const refreshImages = () => {
    setImages(getHeroImages());
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleAdd = (e) => {
    e.preventDefault();

    if (!newImage.image.trim()) {
      showMessage("error", "Please enter an image URL");
      return;
    }

    if (!isValidImageUrl(newImage.image)) {
      showMessage("error", "Please enter a valid Google Drive or image URL");
      return;
    }

    const result = addHeroImage({
      image: newImage.image.trim(),
      title: sanitizeInput(newImage.title),
      subtitle: sanitizeInput(newImage.subtitle),
      ctaText: sanitizeInput(newImage.ctaText),
      ctaLink: sanitizeUrl(newImage.ctaLink),
    });

    if (result.success) {
      refreshImages();
      setNewImage({ image: "", title: "", subtitle: "", ctaText: "", ctaLink: "" });
      showMessage("success", "Hero image added!");
    } else {
      showMessage("error", result.error || "Failed to add image");
    }
  };

  const handleEdit = (image) => {
    setEditingId(image.id);
    setEditForm({ ...image });
  };

  const handleSaveEdit = () => {
    if (!editForm.image?.trim()) {
      showMessage("error", "Image URL cannot be empty");
      return;
    }

    const result = updateHeroImage(editingId, {
      image: editForm.image.trim(),
      title: sanitizeInput(editForm.title || ""),
      subtitle: sanitizeInput(editForm.subtitle || ""),
      ctaText: sanitizeInput(editForm.ctaText || ""),
      ctaLink: sanitizeUrl(editForm.ctaLink || ""),
    });

    if (result.success) {
      refreshImages();
      setEditingId(null);
      showMessage("success", "Image updated!");
    } else {
      showMessage("error", result.error);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this hero image?")) return;

    const result = deleteHeroImage(id);
    if (result.success) {
      refreshImages();
      showMessage("success", "Image deleted!");
    } else {
      showMessage("error", result.error);
    }
  };

  const handleReset = () => {
    if (!window.confirm("Reset to default hero images? This will remove all custom images.")) return;
    resetHeroImages();
    refreshImages();
    showMessage("success", "Reset to default images!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hero Images</h1>
          <p className="text-gray-500">Manage homepage slider images</p>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
        >
          Reset to Default
        </button>
      </div>

      {message.text && (
        <div className={`px-4 py-3 rounded-xl mb-6 ${
          message.type === "success" 
            ? "bg-green-100 border border-green-300 text-green-700" 
            : "bg-red-100 border border-red-300 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-amber-600 mb-4 flex items-center gap-2">
          <FaPlus size={14} /> Add Hero Image
        </h2>

        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Image URL (Google Drive) *</label>
            <input
              type="url"
              value={newImage.image}
              onChange={(e) => setNewImage(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
              <input
                type="text"
                value={newImage.title}
                onChange={(e) => setNewImage(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. New Collection"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Subtitle</label>
              <input
                type="text"
                value={newImage.subtitle}
                onChange={(e) => setNewImage(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="e.g. Discover our latest designs"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Button Text</label>
              <input
                type="text"
                value={newImage.ctaText}
                onChange={(e) => setNewImage(prev => ({ ...prev, ctaText: e.target.value }))}
                placeholder="e.g. Shop Now"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Button Link</label>
              <input
                type="text"
                value={newImage.ctaLink}
                onChange={(e) => setNewImage(prev => ({ ...prev, ctaLink: e.target.value }))}
                placeholder="e.g. /shop or /shop?category=rings"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
          >
            Add Image
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Current Images ({images.length})
        </h2>

        <div className="space-y-4">
          {images.map((image, index) => (
            <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {editingId === image.id ? (
                <div className="p-4 space-y-3">
                  <input
                    type="url"
                    value={editForm.image}
                    onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Image URL"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={editForm.title || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Title"
                      className="px-3 py-2 border border-gray-200 rounded-lg"
                    />
                    <input
                      type="text"
                      value={editForm.subtitle || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Subtitle"
                      className="px-3 py-2 border border-gray-200 rounded-lg"
                    />
                    <input
                      type="text"
                      value={editForm.ctaText || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, ctaText: e.target.value }))}
                      placeholder="Button Text"
                      className="px-3 py-2 border border-gray-200 rounded-lg"
                    />
                    <input
                      type="text"
                      value={editForm.ctaLink || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, ctaLink: e.target.value }))}
                      placeholder="Button Link"
                      className="px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                    >
                      <FaSave size={14} /> Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 flex items-center gap-2"
                    >
                      <FaTimes size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex">
                  <div className="w-40 h-24 bg-gray-100 flex-shrink-0">
                    <img
                      src={image.image}
                      alt={image.title || `Slide ${index + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/160x96?text=Error";
                      }}
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {image.title || `Slide ${index + 1}`}
                        </h3>
                        {image.subtitle && (
                          <p className="text-sm text-gray-500">{image.subtitle}</p>
                        )}
                        {image.ctaText && (
                          <p className="text-xs text-amber-600 mt-1">
                            Button: {image.ctaText} → {image.ctaLink || "/"}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(image)}
                          className="p-2 text-gray-400 hover:text-amber-500"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(image.id)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <p className="text-gray-500 py-8 text-center">No hero images. Add one above.</p>
        )}
      </div>
    </div>
  );
};

export default AdminHeroImages;
