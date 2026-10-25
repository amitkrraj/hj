import React, { useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { getAllCategories, addCategory, updateCategory, deleteCategory } from "../../utils/categoryManager";
import { isValidImageUrl, sanitizeInput } from "../../utils/security";

const AdminCategories = () => {
  const [categories, setCategories] = useState(getAllCategories);
  const [newCategory, setNewCategory] = useState({ name: "", image: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", image: "" });
  const [message, setMessage] = useState({ type: "", text: "" });

  const refreshCategories = () => {
    setCategories(getAllCategories());
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      showMessage("error", "Please enter a category name");
      return;
    }

    if (newCategory.image && !isValidImageUrl(newCategory.image)) {
      showMessage("error", "Please enter a valid Google Drive image URL");
      return;
    }

    const result = addCategory({
      name: sanitizeInput(newCategory.name),
      image: newCategory.image.trim() || null,
    });

    if (result.success) {
      refreshCategories();
      setNewCategory({ name: "", image: "" });
      showMessage("success", "Category added successfully!");
    } else {
      showMessage("error", result.error);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setEditForm({ name: category.name, image: category.image || "" });
  };

  const handleSaveEdit = (id) => {
    if (!editForm.name.trim()) {
      showMessage("error", "Category name cannot be empty");
      return;
    }

    if (editForm.image && !isValidImageUrl(editForm.image)) {
      showMessage("error", "Please enter a valid Google Drive image URL");
      return;
    }

    const result = updateCategory(id, {
      name: sanitizeInput(editForm.name),
      image: editForm.image.trim() || null,
    });

    if (result.success) {
      refreshCategories();
      setEditingId(null);
      showMessage("success", "Category updated!");
    } else {
      showMessage("error", result.error);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    const result = deleteCategory(id);
    
    if (result.success) {
      refreshCategories();
      showMessage("success", "Category deleted!");
    } else {
      showMessage("error", result.error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
        <p className="text-gray-500">Create and manage product categories</p>
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
          <FaPlus size={14} /> Add New Category
        </h2>

        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Category Name *</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Anklets, Waist Belts"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Image (Google Drive Link)</label>
            <input
              type="url"
              value={newCategory.image}
              onChange={(e) => setNewCategory(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="px-6 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          All Categories ({categories.length})
        </h2>

        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No img
                  </div>
                )}
              </div>

              {editingId === category.id ? (
                <div className="flex-1 flex flex-col md:flex-row gap-2">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    type="url"
                    value={editForm.image}
                    onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Image URL"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(category.id)}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      <FaSave size={14} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{category.name}</h3>
                    <p className="text-xs text-gray-500">
                      Slug: {category.slug || category.id}
                      {category.isDefault && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded">Default</span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
                      title="Edit"
                    >
                      <FaEdit size={14} />
                    </button>
                    {!category.isDefault && (
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <p className="text-gray-500 py-8 text-center">No categories found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
