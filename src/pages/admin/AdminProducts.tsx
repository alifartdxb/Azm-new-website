import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Upload, Download, FileSpreadsheet, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { OptimizedImage } from '../../components/OptimizedImage';
import { PRODUCTS_DATA, BRANDS_DATA, CATEGORIES_DATA } from '../../data';
import { motion, AnimatePresence } from 'motion/react';
import { getCollection, createDocument } from '../../services/db';
import { useAuth } from '../../contexts/AuthContext';

export function AdminProducts() {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'import' | 'images'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { role } = useAuth();
  
  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    brandId: '',
    categoryId: '',
    status: 'Draft',
    price: 0
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getCollection('products');
      if (data.length > 0) {
        setProducts(data);
      } else {
        // Fallback to local data if firestore is empty
        setProducts(PRODUCTS_DATA);
      }
    } catch (e) {
      console.error("Failed to load products from DB", e);
      setProducts(PRODUCTS_DATA);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      await createDocument('products', {
        ...newProduct,
        createdAt: new Date().toISOString()
      });
      alert('Product created successfully!');
      setActiveTab('list');
      loadProducts();
    } catch (e) {
      console.error("Failed to create product", e);
      alert('Failed to create product.');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Product Information Management</h1>
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
                onClick={() => setActiveTab('add')}
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
                ) : filteredProducts.map((product) => {
                  const category = CATEGORIES_DATA.find(c => c.id === product.categoryId)?.name || product.categoryId || 'Unknown';
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
                            <p className="font-bold text-stone-800 text-sm">{product.name}</p>
                            <p className="text-xs text-stone-500 mt-0.5">{product.brandId}</p>
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
                        <button className="text-brand-primary hover:text-brand-secondary font-medium text-xs uppercase tracking-wider">Edit</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'add' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold font-display text-brand-secondary mb-6">Create New Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="col-span-full">
              <label className="block text-sm font-bold text-stone-700 mb-2">Product Name</label>
              <input 
                type="text" 
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                placeholder="e.g. Individual Brushed Gold Basin Mixer" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">SKU Code</label>
              <input 
                type="text" 
                value={newProduct.sku}
                onChange={e => setNewProduct({...newProduct, sku: e.target.value})}
                className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                placeholder="e.g. VADO-IND-100" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Brand</label>
              <select 
                value={newProduct.brandId}
                onChange={e => setNewProduct({...newProduct, brandId: e.target.value})}
                className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
              >
                <option value="">Select Brand...</option>
                {BRANDS_DATA.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Category</label>
              <select 
                value={newProduct.categoryId}
                onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})}
                className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
              >
                <option value="">Select Category...</option>
                {CATEGORIES_DATA.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="border-t border-stone-100 pt-8 mb-8">
            <h3 className="text-lg font-bold text-brand-secondary mb-4">Product Images</h3>
            <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer">
              <ImageIcon className="mx-auto text-stone-400 mb-4" size={32} />
              <p className="font-medium text-stone-700 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-stone-500">SVG, PNG, JPG or WebP (max. 800x400px)</p>
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-stone-100 pt-6">
            <button onClick={() => setActiveTab('list')} className="px-6 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50">Cancel</button>
            <button onClick={handleCreateProduct} className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors">Save Product</button>
          </div>
        </motion.div>
      )}

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
            <button className="px-6 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50 shadow-sm">
              Select File
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
