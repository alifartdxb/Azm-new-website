import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Upload, Download, FileSpreadsheet, Image as ImageIcon, AlertCircle, Edit, Trash2, Copy, X } from 'lucide-react';
import { OptimizedImage } from '../../components/OptimizedImage';
import { PRODUCTS_DATA, BRANDS_DATA, CATEGORIES_DATA } from '../../data';
import { motion, AnimatePresence } from 'motion/react';
import { getCollection, createDocument, updateDocument, deleteDocument } from '../../services/db';
import { useAuth } from '../../contexts/AuthContext';

export function AdminProducts() {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit' | 'import' | 'images'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { role } = useAuth();
  
  const defaultProduct = {
    name: '', sku: '', brandId: '', categoryId: '', status: 'Draft',
    shortDescription: '', fullDescription: '', features: '', technicalSpecs: '',
    finish: '', color: '', material: '', dimensions: '', weight: '', warranty: '',
    seoTitle: '', metaDescription: '', slug: '',
    images: [],
    collection: '', series: ''
  };

  const [formData, setFormData] = useState(defaultProduct);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getCollection('products');
      setProducts(data.length > 0 ? data : PRODUCTS_DATA);
    } catch (e) {
      console.error("Failed to load products from DB", e);
      setProducts(PRODUCTS_DATA);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (addAnother = false) => {
    try {
      if (activeTab === 'edit' && editingId) {
        await updateDocument('products', editingId, formData);
        alert('Product updated successfully!');
      } else {
        await createDocument('products', { ...formData, createdAt: new Date().toISOString() });
        alert('Product created successfully!');
      }
      loadProducts();
      
      if (addAnother) {
        setFormData(defaultProduct);
        setActiveTab('add');
      } else {
        setActiveTab('list');
      }
    } catch (e) {
      console.error("Failed to save product", e);
      alert('Failed to save product.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDocument('products', id);
        alert('Product deleted');
        loadProducts();
      } catch (e) {
        console.error("Failed to delete", e);
      }
    }
  };

  const handleEdit = (product: any) => {
    setFormData(product);
    setEditingId(product.id || product.sku);
    setActiveTab('edit');
  };

  const handleDuplicate = (product: any) => {
    const duplicatedData = { ...product, sku: `${product.sku}-COPY`, name: `${product.name} (Copy)` };
    delete duplicatedData.id;
    setFormData(duplicatedData);
    setActiveTab('add');
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ProductForm = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-display text-brand-secondary">
          {activeTab === 'edit' ? 'Edit Product' : 'Create New Product'}
        </h2>
        <button onClick={() => setActiveTab('list')} className="text-stone-400 hover:text-stone-600">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-bold text-stone-800 mb-4 border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-full md:col-span-2">
              <label className="block text-sm font-bold text-stone-700 mb-2">Product Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="e.g. Individual Brushed Gold Basin Mixer" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">SKU Code</label>
              <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="e.g. VADO-IND-100" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Brand</label>
              <select value={formData.brandId} onChange={e => setFormData({...formData, brandId: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary">
                <option value="">Select Brand...</option>
                {BRANDS_DATA.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Category</label>
              <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary">
                <option value="">Select Category...</option>
                {CATEGORIES_DATA.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Collection</label>
              <input type="text" value={formData.collection || ''} onChange={e => setFormData({...formData, collection: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="e.g. Individual" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Series</label>
              <input type="text" value={formData.series || ''} onChange={e => setFormData({...formData, series: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="e.g. Round" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary">
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <h3 className="text-lg font-bold text-stone-800 mb-4 border-b pb-2">Description</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Short Description</label>
              <textarea value={formData.shortDescription || ''} onChange={e => setFormData({...formData, shortDescription: e.target.value})} rows={2} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Full Description</label>
              <textarea value={formData.fullDescription || ''} onChange={e => setFormData({...formData, fullDescription: e.target.value})} rows={4} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary"></textarea>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h3 className="text-lg font-bold text-stone-800 mb-4 border-b pb-2">Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Finish</label>
              <input type="text" value={formData.finish || ''} onChange={e => setFormData({...formData, finish: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Material</label>
              <input type="text" value={formData.material || ''} onChange={e => setFormData({...formData, material: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Dimensions</label>
              <input type="text" value={formData.dimensions || ''} onChange={e => setFormData({...formData, dimensions: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Warranty</label>
              <input type="text" value={formData.warranty || ''} onChange={e => setFormData({...formData, warranty: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="e.g. 15 Years" />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div>
          <h3 className="text-lg font-bold text-stone-800 mb-4 border-b pb-2">SEO</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">SEO Title</label>
              <input type="text" value={formData.seoTitle || ''} onChange={e => setFormData({...formData, seoTitle: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Slug</label>
              <input type="text" value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" />
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-bold text-stone-700 mb-2">Meta Description</label>
              <textarea value={formData.metaDescription || ''} onChange={e => setFormData({...formData, metaDescription: e.target.value})} rows={2} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary"></textarea>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t border-stone-100 mt-8 pt-6">
        <button onClick={() => setActiveTab('list')} className="px-6 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50">Cancel</button>
        {activeTab === 'add' && (
          <button onClick={() => handleSaveProduct(true)} className="px-6 py-2 border border-brand-primary text-brand-primary rounded-lg text-sm font-bold hover:bg-brand-primary hover:text-white transition-colors">
            Save & Add Another
          </button>
        )}
        <button onClick={() => handleSaveProduct(false)} className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors">
          {activeTab === 'edit' ? 'Save Changes' : 'Save Product'}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Product Management</h1>
          <p className="text-stone-500 text-sm">Manage products, variants, documents, and media.</p>
        </div>
        
        <div className="flex bg-stone-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-brand-secondary' : 'text-stone-500 hover:text-brand-secondary'}`}
          >
            All Products
          </button>
          {role !== 'viewer' && (
            <>
              <button 
                onClick={() => { setFormData(defaultProduct); setActiveTab('add'); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'add' ? 'bg-white shadow-sm text-brand-secondary' : 'text-stone-500 hover:text-brand-secondary'}`}
              >
                Add New
              </button>
              <button 
                onClick={() => setActiveTab('import')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'import' ? 'bg-white shadow-sm text-brand-secondary' : 'text-stone-500 hover:text-brand-secondary'}`}
              >
                Bulk Import
              </button>
            </>
          )}
        </div>
      </div>

      {activeTab === 'list' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-stone-50">
            <div className="relative w-full sm:w-96">
              <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-stone-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by SKU, Name, or Attribute..." 
                className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 flex-1 sm:flex-none justify-center">
                <Filter size={16} /> Filters
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 flex-1 sm:flex-none justify-center">
                <Download size={16} /> Export
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
                  <th className="px-6 py-4 font-bold">Product</th>
                  <th className="px-6 py-4 font-bold">SKU</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-stone-500">Loading products...</td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-stone-500">No products found.</td>
                  </tr>
                ) : filteredProducts.map((product) => {
                  const category = CATEGORIES_DATA.find(c => c.id === product.categoryId)?.name || product.categoryId || 'Unknown';
                  const brand = BRANDS_DATA.find(b => b.id === product.brandId)?.name || product.brandId || 'Unknown';
                  return (
                    <tr key={product.id || product.sku} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0">
                            {product.images?.[0] ? (
                              <OptimizedImage src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-400">
                                <ImageIcon size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-stone-800 text-sm max-w-[250px] truncate" title={product.name}>{product.name}</p>
                            <p className="text-xs text-stone-500 mt-0.5">{brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs font-mono bg-stone-100 px-2 py-1 rounded text-stone-700">{product.sku}</code>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-stone-600">{category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase rounded ${
                          product.status === 'Active' || product.status === 'Published' ? 'bg-green-100 text-green-700' : 
                          product.status === 'Production' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {product.status || 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(product)} className="p-2 text-stone-400 hover:text-brand-primary hover:bg-stone-100 rounded-lg transition-colors" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDuplicate(product)} className="p-2 text-stone-400 hover:text-blue-600 hover:bg-stone-100 rounded-lg transition-colors" title="Duplicate">
                            <Copy size={16} />
                          </button>
                          <button onClick={() => handleDelete(product.id || product.sku)} className="p-2 text-stone-400 hover:text-red-600 hover:bg-stone-100 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {(activeTab === 'add' || activeTab === 'edit') && <ProductForm />}

      {activeTab === 'import' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold font-display text-brand-secondary">Bulk Product Import</h2>
              <p className="text-stone-500 text-sm mt-1">Upload a CSV or Excel file to bulk create or update products.</p>
            </div>
            <button className="flex items-center gap-2 text-brand-primary text-sm font-bold hover:underline">
              <Download size={16} /> Download Template
            </button>
          </div>
          <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-xl p-12 text-center hover:bg-stone-100 transition-colors cursor-pointer mb-8">
            <FileSpreadsheet className="mx-auto text-brand-primary mb-4" size={48} />
            <h3 className="font-bold text-lg text-stone-700 mb-2">Upload Data File</h3>
            <p className="text-stone-500 text-sm mb-4">Drag and drop your .csv or .xlsx file here, or click to browse</p>
            <input type="file" className="hidden" id="file-upload" accept=".csv, .xlsx" />
            <label htmlFor="file-upload" className="px-6 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50 shadow-sm cursor-pointer inline-block">
              Select File
            </label>
          </div>
        </motion.div>
      )}
    </div>
  );
}
