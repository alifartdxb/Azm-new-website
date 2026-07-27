import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { BRANDS_DATA } from '../../data';
import { OptimizedImage } from '../../components/OptimizedImage';
import { getCollection, createDocument, updateDocument, deleteDocument } from '../../services/db';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';

export function AdminBrands() {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { role } = useAuth();

  const defaultBrand = {
    id: '', name: '', slug: '', description: '', country: '', 
    logo: '', bannerImage: '', isFeatured: false,
    seoTitle: '', seoDescription: ''
  };

  const [formData, setFormData] = useState(defaultBrand);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const data = await getCollection('brands');
      setBrands(data.length > 0 ? data : BRANDS_DATA);
    } catch (e) {
      console.error("Failed to load brands from DB", e);
      setBrands(BRANDS_DATA);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBrand = async () => {
    try {
      const idToSave = formData.id || formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const dataToSave = { ...formData, id: idToSave };

      if (activeTab === 'edit' && editingId) {
        await updateDocument('brands', editingId, dataToSave);
        alert('Brand updated successfully!');
      } else {
        await createDocument('brands', { ...dataToSave, createdAt: new Date().toISOString() }, idToSave);
        alert('Brand created successfully!');
      }
      loadBrands();
      setActiveTab('list');
    } catch (e) {
      console.error("Failed to save brand", e);
      alert('Failed to save brand.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await deleteDocument('brands', id);
        alert('Brand deleted');
        loadBrands();
      } catch (e) {
        console.error("Failed to delete", e);
      }
    }
  };

  const handleEdit = (brand: any) => {
    setFormData(brand);
    setEditingId(brand.id);
    setActiveTab('edit');
  };

  const filteredBrands = brands.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Brand Management</h1>
          <p className="text-stone-500 text-sm">Manage partner brands and their landing pages.</p>
        </div>
        {activeTab === 'list' && role !== 'viewer' && (
          <button onClick={() => { setFormData(defaultBrand); setActiveTab('add'); }} className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-secondary transition-colors">
            <Plus size={16} /> Add Brand
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
                placeholder="Search brands..." 
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
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Country</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-stone-500">Loading brands...</td></tr>
                ) : filteredBrands.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-stone-500">No brands found.</td></tr>
                ) : filteredBrands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 rounded border border-stone-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 p-1">
                          <OptimizedImage src={brand.logo} alt={brand.name} className="w-full h-full object-contain" fallbackSrc={`https://via.placeholder.com/150x50?text=${brand.name}`} />
                        </div>
                        <div>
                          <div className="font-bold text-brand-secondary">{brand.name}</div>
                          <div className="text-xs text-stone-500 mt-1">/{brand.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-600">{brand.country}</td>
                    <td className="px-6 py-4">
                      {brand.isFeatured ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-bold uppercase tracking-wider">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {role !== 'viewer' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(brand)} className="p-2 text-stone-400 hover:text-brand-primary transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(brand.id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
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
              {activeTab === 'edit' ? 'Edit Brand' : 'Create New Brand'}
            </h2>
            <button onClick={() => setActiveTab('list')} className="text-stone-400 hover:text-stone-600">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Brand Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Slug</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Country</label>
                <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-stone-700 mb-2 mt-8">
                  <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-4 h-4 text-brand-primary focus:ring-brand-primary border-stone-300 rounded" />
                  Is Featured Brand
                </label>
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-bold text-stone-700 mb-2">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary"></textarea>
              </div>
            </div>

            <h3 className="text-lg font-bold text-stone-800 border-b pb-2 mt-6">SEO & Meta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">SEO Title</label>
                <input type="text" value={formData.seoTitle} onChange={e => setFormData({...formData, seoTitle: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-bold text-stone-700 mb-2">SEO Description</label>
                <textarea value={formData.seoDescription} onChange={e => setFormData({...formData, seoDescription: e.target.value})} rows={2} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary"></textarea>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-stone-800 border-b pb-2 mt-6">Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Logo URL</label>
                <input type="text" value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Banner Image URL</label>
                <input type="text" value={formData.bannerImage} onChange={e => setFormData({...formData, bannerImage: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-4 border-t border-stone-100 mt-8 pt-6">
            <button onClick={() => setActiveTab('list')} className="px-6 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50">Cancel</button>
            <button onClick={handleSaveBrand} className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors">
              {activeTab === 'edit' ? 'Save Changes' : 'Save Brand'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
