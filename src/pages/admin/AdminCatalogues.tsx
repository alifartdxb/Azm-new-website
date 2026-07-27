import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash, X, UploadCloud, Copy, FileText, Download } from 'lucide-react';
import { getCollection, createDocument, updateDocument, deleteDocument } from '../../services/db';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';

export function AdminCatalogues() {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [catalogues, setCatalogues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { role } = useAuth();

  const defaultCatalogue = {
    id: '', title: '', brand: '', category: 'Bathroom', product_type: '',
    thumbnail: '', pdf_url: '', description: '', year: new Date().getFullYear().toString(),
    language: 'English', pages: 0, file_size: '', tags: '', seo_title: '', seo_description: ''
  };

  const [formData, setFormData] = useState(defaultCatalogue);

  useEffect(() => {
    loadCatalogues();
  }, []);

  const loadCatalogues = async () => {
    try {
      setLoading(true);
      const data = await getCollection('catalogues');
      setCatalogues(data);
    } catch (e) {
      console.error("Failed to load catalogues from DB", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCatalogue = async () => {
    try {
      const idToSave = formData.id || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const dataToSave = { ...formData, id: idToSave };

      if (activeTab === 'edit' && editingId) {
        await updateDocument('catalogues', editingId, dataToSave);
        alert('Catalogue updated successfully!');
      } else {
        await createDocument('catalogues', { ...dataToSave, createdAt: new Date().toISOString() }, idToSave);
        alert('Catalogue created successfully!');
      }
      loadCatalogues();
      setActiveTab('list');
    } catch (e) {
      console.error("Failed to save catalogue", e);
      alert('Failed to save catalogue.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this catalogue?')) {
      try {
        await deleteDocument('catalogues', id);
        alert('Catalogue deleted');
        loadCatalogues();
      } catch (e) {
        console.error("Failed to delete", e);
      }
    }
  };

  const handleEdit = (cat: any) => {
    setFormData(cat);
    setEditingId(cat.id);
    setActiveTab('edit');
  };
  
  const handleDuplicate = (cat: any) => {
    setFormData({ ...cat, id: '', title: cat.title + ' (Copy)' });
    setActiveTab('add');
  };

  const filteredCatalogues = catalogues.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || (c.brand && c.brand.toLowerCase().includes(searchQuery.toLowerCase())));

  // Calculate stats
  const totalCatalogues = catalogues.length;
  const uniqueBrands = new Set(catalogues.map(c => c.brand).filter(Boolean)).size;
  const uniqueCategories = new Set(catalogues.map(c => c.category).filter(Boolean)).size;

  return (
    <div className="space-y-6">
      
      {/* CMS Dashboard Stats */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
             <div>
               <p className="text-stone-500 text-sm font-medium">Total Catalogues</p>
               <h3 className="text-2xl font-bold text-stone-900">{totalCatalogues}</h3>
             </div>
             <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
               <FileText size={20} />
             </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
             <div>
               <p className="text-stone-500 text-sm font-medium">Total Brands</p>
               <h3 className="text-2xl font-bold text-stone-900">{uniqueBrands}</h3>
             </div>
             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
               <Copy size={20} />
             </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
             <div>
               <p className="text-stone-500 text-sm font-medium">Categories</p>
               <h3 className="text-2xl font-bold text-stone-900">{uniqueCategories}</h3>
             </div>
             <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
               <Search size={20} />
             </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
             <div>
               <p className="text-stone-500 text-sm font-medium">Downloads</p>
               <h3 className="text-2xl font-bold text-stone-900">0</h3>
             </div>
             <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
               <Download size={20} />
             </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Catalogue Management</h1>
          <p className="text-stone-500 text-sm">Upload and organize product PDF catalogues.</p>
        </div>
        {activeTab === 'list' && role !== 'viewer' && (
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-white border border-stone-200 text-stone-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-stone-50 transition-colors">
              <UploadCloud size={16} /> Bulk Import
            </button>
            <button onClick={() => { setFormData(defaultCatalogue); setActiveTab('add'); }} className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-secondary transition-colors">
              <Plus size={16} /> Add Catalogue
            </button>
          </div>
        )}
      </div>

      {activeTab === 'list' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-50">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <input 
                type="text" 
                placeholder="Search catalogues by name or brand..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-4">Catalogue Title</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Year</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-stone-500">Loading catalogues...</td></tr>
                ) : filteredCatalogues.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-stone-500">No catalogues found.</td></tr>
                ) : filteredCatalogues.map((cat) => (
                  <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-stone-100 overflow-hidden flex-shrink-0">
                          {cat.thumbnail ? <img src={cat.thumbnail} alt="" className="w-full h-full object-cover" /> : <FileText className="m-auto text-stone-400" size={16} />}
                        </div>
                        <span className="font-bold text-stone-800">{cat.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-600 font-medium">{cat.brand}</td>
                    <td className="px-6 py-4 text-stone-600">{cat.category}</td>
                    <td className="px-6 py-4 text-stone-600">{cat.year}</td>
                    <td className="px-6 py-4 text-right">
                      {role !== 'viewer' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleDuplicate(cat)} className="p-2 text-stone-400 hover:text-brand-primary transition-colors" title="Duplicate"><Copy size={16} /></button>
                          <button onClick={() => handleEdit(cat)} className="p-2 text-stone-400 hover:text-brand-primary transition-colors" title="Edit"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(cat.id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors" title="Delete"><Trash size={16} /></button>
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-stone-200">
            <h2 className="text-xl font-bold font-display text-brand-secondary">
              {activeTab === 'edit' ? 'Edit Catalogue' : 'Create New Catalogue'}
            </h2>
            <button onClick={() => setActiveTab('list')} className="text-stone-400 hover:text-stone-600">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Primary Details */}
            <div>
              <h3 className="text-lg font-bold text-stone-800 mb-4 border-b border-stone-100 pb-2">Primary Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full">
                  <label className="block text-sm font-bold text-stone-700 mb-2">Catalogue Name *</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="e.g. VADO Life Collection Catalogue" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Brand</label>
                  <input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="e.g. VADO" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary">
                    <option value="Bathroom">Bathroom</option>
                    <option value="Tiles">Tiles</option>
                    <option value="Marble">Marble</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Hardware">Hardware</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Product Type</label>
                  <input type="text" value={formData.product_type} onChange={e => setFormData({...formData, product_type: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="e.g. Mixer, Shower, Tile" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Year</label>
                  <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
                </div>
              </div>
            </div>

            {/* Media Details */}
            <div>
              <h3 className="text-lg font-bold text-stone-800 mb-4 border-b border-stone-100 pb-2">Media & Files</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">PDF File URL *</label>
                  <input type="text" value={formData.pdf_url} onChange={e => setFormData({...formData, pdf_url: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="https://..." required />
                  <p className="text-xs text-stone-500 mt-1">Direct link to the PDF file.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Thumbnail URL *</label>
                  <input type="text" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="https://..." required />
                  <p className="text-xs text-stone-500 mt-1">Cover image for the catalogue.</p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div>
              <h3 className="text-lg font-bold text-stone-800 mb-4 border-b border-stone-100 pb-2">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Language</label>
                  <input type="text" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Number of Pages</label>
                  <input type="number" value={formData.pages} onChange={e => setFormData({...formData, pages: parseInt(e.target.value) || 0})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">File Size (e.g. 15MB)</label>
                  <input type="text" value={formData.file_size} onChange={e => setFormData({...formData, file_size: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Tags / Keywords (comma separated)</label>
                  <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="e.g. Luxury, Italian, Matt finish" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary"></textarea>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div>
              <h3 className="text-lg font-bold text-stone-800 mb-4 border-b border-stone-100 pb-2">SEO Optimization</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">SEO Title</label>
                  <input type="text" value={formData.seo_title} onChange={e => setFormData({...formData, seo_title: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">SEO Description</label>
                  <textarea value={formData.seo_description} onChange={e => setFormData({...formData, seo_description: e.target.value})} rows={2} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 p-6 bg-stone-50 border-t border-stone-200">
            <button onClick={() => setActiveTab('list')} className="px-6 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-white bg-transparent">Cancel</button>
            {activeTab === 'add' && (
              <button onClick={() => { handleSaveCatalogue(); setFormData(defaultCatalogue); setActiveTab('add'); }} className="px-6 py-2 border border-brand-primary text-brand-primary rounded-lg text-sm font-bold hover:bg-brand-primary/10 transition-colors">
                Save & Add Another
              </button>
            )}
            <button onClick={handleSaveCatalogue} className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors">
              {activeTab === 'edit' ? 'Save Changes' : 'Save Catalogue'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
