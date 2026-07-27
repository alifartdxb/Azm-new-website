import React, { useState } from 'react';
import { Package, Plus, Search, Filter, Upload, Download, FileSpreadsheet, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { OptimizedImage } from '../../components/OptimizedImage';
import { PRODUCTS_DATA, BRANDS_DATA, CATEGORIES_DATA } from '../../data';
import { motion, AnimatePresence } from 'motion/react';

export function AdminProducts() {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'import' | 'images'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = PRODUCTS_DATA.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
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
          <button 
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'images' ? 'bg-white shadow-sm text-brand-secondary' : 'text-stone-500 hover:text-brand-secondary'}`}
          >
            Bulk Images
          </button>
        </div>
      </div>

      {activeTab === 'list' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-stone-50">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <input 
                type="text" 
                placeholder="Search products by SKU or Name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors w-full sm:w-auto justify-center">
                <Filter size={16} /> Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors w-full sm:w-auto justify-center">
                <Download size={16} /> Export
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((product) => {
                  const brand = BRANDS_DATA.find(b => b.id === product.brandId);
                  const cat = CATEGORIES_DATA.find(c => c.id === product.categoryId);
                  
                  return (
                    <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded border border-stone-200 overflow-hidden bg-white flex-shrink-0">
                            <OptimizedImage src={product.thumbnail} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                          </div>
                          <div>
                            <div className="font-bold text-brand-secondary">{product.name}</div>
                            <div className="font-mono text-xs text-stone-500 mt-1">{product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-stone-100 text-stone-700 text-xs font-medium">
                          {brand?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-stone-600">{cat?.name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                          product.status === 'Available' ? 'bg-green-100 text-green-700' : 
                          product.status === 'Coming Soon' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {product.status}
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
              <input type="text" className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" placeholder="e.g. Individual Brushed Gold Basin Mixer" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">SKU Code</label>
              <input type="text" className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" placeholder="e.g. VADO-IND-100" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Brand</label>
              <select className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary">
                <option value="">Select Brand...</option>
                {BRANDS_DATA.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Category</label>
              <select className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary">
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
            <button className="px-6 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50">Cancel</button>
            <button className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors">Save Product</button>
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

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4">
            <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-blue-900 text-sm">Required Columns</h4>
              <p className="text-blue-700 text-sm mt-1 leading-relaxed">
                Your import file must include: <code className="bg-blue-100 px-1 rounded">SKU</code>, <code className="bg-blue-100 px-1 rounded">Name</code>, <code className="bg-blue-100 px-1 rounded">Brand</code>, <code className="bg-blue-100 px-1 rounded">Category</code>. Products with existing SKUs will be updated.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'images' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
           <div className="mb-6">
            <h2 className="text-xl font-bold font-display text-brand-secondary">Bulk Image Upload</h2>
            <p className="text-stone-500 text-sm mt-1">Upload multiple images. Files named with SKU codes (e.g. VADO-100.jpg) will be automatically assigned to the matching product.</p>
          </div>

          <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-xl p-12 text-center hover:bg-stone-100 transition-colors cursor-pointer mb-8">
            <ImageIcon className="mx-auto text-brand-primary mb-4" size={48} />
            <h3 className="font-bold text-lg text-stone-700 mb-2">Upload Images</h3>
            <p className="text-stone-500 text-sm mb-4">Drag and drop multiple images here. They will be compressed and converted to WebP automatically.</p>
            <button className="px-6 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50 shadow-sm">
              Select Images
            </button>
          </div>

           <div className="bg-stone-50 rounded-xl p-6 border border-stone-200">
            <h4 className="font-bold text-stone-700 text-sm mb-4">Recent Uploads Processing...</h4>
            <div className="space-y-3">
              {[
                { name: 'VADO-IND-100_1.jpg', status: 'Converted to WebP', progress: 100 },
                { name: 'VADO-IND-100_2.jpg', status: 'Compressing...', progress: 65 },
                { name: 'JAQ-ART-400.png', status: 'Pending', progress: 0 },
              ].map((file, i) => (
                <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border border-stone-100">
                  <span className="text-sm font-mono text-stone-600">{file.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-stone-400">{file.status}</span>
                    <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-primary" style={{ width: `${file.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
