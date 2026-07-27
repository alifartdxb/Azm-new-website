import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import { CATEGORIES_DATA } from '../../data';
import { OptimizedImage } from '../../components/OptimizedImage';
import { getCollection, createDocument, updateDocument, deleteDocument } from '../../services/db';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';

export function AdminCategories() {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { role } = useAuth();

  const defaultCategory = {
    id: '', name: '', slug: '', description: '', image: '',
    seoTitle: '', seoDescription: ''
  };

  const [formData, setFormData] = useState(defaultCategory);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCollection('categories');
      setCategories(data.length > 0 ? data : CATEGORIES_DATA);
    } catch (e) {
      console.error("Failed to load categories from DB", e);
      setCategories(CATEGORIES_DATA);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    try {
      const idToSave = formData.id || formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const dataToSave = { ...formData, id: idToSave };

      if (activeTab === 'edit' && editingId) {
        await updateDocument('categories', editingId, dataToSave);
        alert('Category updated successfully!');
      } else {
        await createDocument('categories', { ...dataToSave, createdAt: new Date().toISOString() }, idToSave);
        alert('Category created successfully!');
      }
      loadCategories();
      setActiveTab('list');
    } catch (e) {
      console.error("Failed to save category", e);
      alert('Failed to save category.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteDocument('categories', id);
        alert('Category deleted');
        loadCategories();
      } catch (e) {
        console.error("Failed to delete", e);
      }
    }
  };

  const handleEdit = (category: any) => {
    setFormData(category);
    setEditingId(category.id);
    setActiveTab('edit');
  };

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Category Management</h1>
          <p className="text-stone-500 text-sm">Manage product categories and taxonomy.</p>
        </div>
        {activeTab === 'list' && role !== 'viewer' && (
          <button onClick={() => { setFormData(defaultCategory); setActiveTab('add'); }} className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-secondary transition-colors">
            <Plus size={16} /> Add Category
          </button>
        )}
      </div>

      {activeTab === 'list' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-50">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <input 
                type="text" 
                placeholder="Search categories..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-stone-500">Loading categories...</td></tr>
                ) : filteredCategories.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-stone-500">No categories found.</td></tr>
                ) : filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded border border-stone-200 bg-stone-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          <OptimizedImage src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="font-bold text-brand-secondary">{cat.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-500 font-mono text-xs">{cat.slug}</td>
                    <td className="px-6 py-4 text-right">
                      {role !== 'viewer' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(cat)} className="p-2 text-stone-400 hover:text-brand-primary transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(cat.id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(activeTab === 'add' || activeTab === 'edit') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-display text-brand-secondary">
              {activeTab === 'edit' ? 'Edit Category' : 'Create New Category'}
            </h2>
            <button onClick={() => setActiveTab('list')} className="text-stone-400 hover:text-stone-600">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Category Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Slug</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-bold text-stone-700 mb-2">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary"></textarea>
              </div>
            </div>

            <h3 className="text-lg font-bold text-stone-800 border-b pb-2 mt-6">SEO & Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">SEO Title</label>
                <input type="text" value={formData.seoTitle} onChange={e => setFormData({...formData, seoTitle: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Image URL</label>
                <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-bold text-stone-700 mb-2">SEO Description</label>
                <textarea value={formData.seoDescription} onChange={e => setFormData({...formData, seoDescription: e.target.value})} rows={2} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary"></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-stone-100 mt-8 pt-6">
            <button onClick={() => setActiveTab('list')} className="px-6 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50">Cancel</button>
            <button onClick={handleSaveCategory} className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors">
              {activeTab === 'edit' ? 'Save Changes' : 'Save Category'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
