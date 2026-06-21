import { useState, useRef } from 'react';
import { Plus, Download, Upload, Search, Filter, MoreHorizontal, Image as ImageIcon, FileSpreadsheet, X } from 'lucide-react';

export function AdminProducts() {
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockProducts = [
    { id: '1', sku: 'VADO-IND-100', name: 'Individual Basin Mixer', brand: 'VADO UK', category: 'Basin Mixers', stock: 'In Stock', price: 'AED 1,250' },
    { id: '2', sku: 'VADO-STB-200', name: 'Omika Thermostatic Valve', brand: 'VADO UK', category: 'Shower Valves', stock: 'Low Stock', price: 'AED 2,800' },
    { id: '3', sku: 'RCR-P-02', name: 'Roca Inspira Toilet', brand: 'Roca', category: 'Sanitaryware', stock: 'In Stock', price: 'AED 1,850' },
    { id: '4', sku: 'KTC-S-01', name: 'Stainless Steel Deep Sink', brand: 'Franke', category: 'Kitchen Sinks', stock: 'Out of Stock', price: 'AED 950' },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-stone-800">Product Management</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-600 rounded-lg text-sm font-semibold hover:bg-stone-50 transition-colors">
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white border border-stone-800 rounded-lg text-sm font-semibold hover:bg-stone-700 transition-colors"
          >
            <Upload size={16} /> Bulk Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-secondary transition-colors shadow-sm">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Filters Base */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-stone-400" size={18} />
          <input
            className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-primary bg-stone-50 text-sm"
            type="text"
            placeholder="Search products by sku, name..."
          />
        </div>
        <div className="flex gap-2">
          <select className="border border-stone-200 rounded-lg px-4 py-2 bg-stone-50 text-sm text-stone-600 focus:outline-none focus:border-brand-primary">
            <option>All Categories</option>
            <option>Basin Mixers</option>
            <option>Shower Valves</option>
            <option>Sanitaryware</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-600 rounded-lg text-sm font-semibold hover:bg-stone-50 transition-colors">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500 font-bold">
                <th className="p-4 w-12"><input type="checkbox" className="rounded border-stone-300" /></th>
                <th className="p-4">SKU</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Category</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {mockProducts.map((product) => (
                <tr key={product.id} className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
                  <td className="p-4"><input type="checkbox" className="rounded border-stone-300" /></td>
                  <td className="p-4 font-mono text-xs font-semibold text-stone-600">{product.sku}</td>
                  <td className="p-4 font-semibold text-stone-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-stone-100 rounded flex items-center justify-center text-stone-400">
                      <ImageIcon size={18} />
                    </div>
                    {product.name}
                  </td>
                  <td className="p-4 text-stone-600">{product.brand}</td>
                  <td className="p-4 text-stone-600">{product.category}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      product.stock === 'In Stock' ? 'bg-green-100 text-green-800' : 
                      product.stock === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-stone-400 hover:text-stone-800 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-stone-200 text-sm text-stone-500 flex justify-between items-center">
          <span>Showing 1 to 4 of 854 results</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-stone-200 rounded hover:bg-stone-50">Prev</button>
            <button className="px-3 py-1 bg-brand-primary text-white rounded">1</button>
            <button className="px-3 py-1 border border-stone-200 rounded hover:bg-stone-50">2</button>
            <button className="px-3 py-1 border border-stone-200 rounded hover:bg-stone-50">3</button>
            <button className="px-3 py-1 border border-stone-200 rounded hover:bg-stone-50">Next</button>
          </div>
        </div>
      </div>

      {/* Bulk Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setShowImportModal(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h2 className="text-xl font-bold text-stone-800">Bulk Import Products</h2>
              <button onClick={() => setShowImportModal(false)} className="text-stone-400 hover:text-stone-800">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-stone-800 mb-2">1. Upload Product Data (CSV/Excel)</h3>
                  <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center bg-stone-50">
                    <input 
                      type="file" 
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                      className="hidden" 
                      ref={fileInputRef}
                    />
                    <div className="w-16 h-16 bg-white border border-stone-200 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary shadow-sm">
                      <FileSpreadsheet size={28} />
                    </div>
                    <p className="text-stone-800 font-semibold mb-1">Drag and drop your file here</p>
                    <p className="text-stone-500 text-sm mb-4">Supported formats: .csv, .xlsx, .xls</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-white border border-stone-200 shadow-sm rounded-lg text-sm font-semibold text-stone-700 hover:bg-stone-50"
                    >
                      Browse Files
                    </button>
                  </div>
                  <div className="mt-2 text-right">
                    <a href="#" className="text-sm text-brand-primary font-semibold hover:underline">Download Template</a>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-stone-800 mb-2">2. Upload Product Images (Multi-upload)</h3>
                  <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center bg-stone-50">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      className="hidden" 
                      id="image-upload"
                    />
                    <div className="w-16 h-16 bg-white border border-stone-200 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary shadow-sm">
                      <ImageIcon size={28} />
                    </div>
                    <p className="text-stone-800 font-semibold mb-1">Drag and drop images here</p>
                    <p className="text-stone-500 text-sm mb-4">Ensure filenames match the SKU in your spreadsheet (e.g., VADO-123-1.jpg)</p>
                    <button 
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="px-6 py-2 bg-white border border-stone-200 shadow-sm rounded-lg text-sm font-semibold text-stone-700 hover:bg-stone-50"
                    >
                      Browse Images
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-stone-100 flex justify-end gap-3 bg-stone-50 rounded-b-2xl">
              <button 
                onClick={() => setShowImportModal(false)}
                className="px-6 py-2 border border-stone-200 rounded-lg text-sm font-semibold hover:bg-white text-stone-600"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-secondary shadow-md">
                Start Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
