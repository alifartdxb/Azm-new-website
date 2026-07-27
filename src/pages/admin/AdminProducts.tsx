import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Upload, Download, FileSpreadsheet, Image as ImageIcon, AlertCircle, Edit, Trash2, Copy, X } from 'lucide-react';
import { OptimizedImage } from '../../components/OptimizedImage';
import { PRODUCTS_DATA, BRANDS_DATA, CATEGORIES_DATA } from '../../data';
import { motion } from 'motion/react';
import { getCollection, createDocument, updateDocument, deleteDocument } from '../../services/db';
import { useAuth } from '../../contexts/AuthContext';

import Papa from 'papaparse';

export function AdminProducts() {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit' | 'import' | 'images'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  const { role } = useAuth();
  
  const defaultProduct = {
    name: '', sku: '', brandId: '', categoryId: '', subCategory: '', status: 'Draft',
    shortDescription: '', description: '', features: [], technicalSpecifications: '',
    finish: [], color: [], material: '', dimensions: '', weight: '', warranty: '',
    seoTitle: '', metaDescription: '', slug: '',
    images: [], thumbnail: '',
    collection: '', series: '',
    installationType: [], application: [], documents: [], variants: [], relatedProducts: []
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
      const dataToSave = { ...formData };
      if (!dataToSave.thumbnail && dataToSave.images?.length > 0) {
        dataToSave.thumbnail = dataToSave.images[0];
      }
      if (!dataToSave.slug && dataToSave.name) {
        dataToSave.slug = dataToSave.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }

      if (activeTab === 'edit' && editingId) {
        await updateDocument('products', editingId, dataToSave);
        alert('Product updated successfully!');
      } else {
        await createDocument('products', { ...dataToSave, createdAt: new Date().toISOString() }, dataToSave.sku || undefined);
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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map(p => p.id || p.sku));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pid => pid !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          if (results.errors.length > 0) {
            alert('Error parsing CSV file');
            return;
          }
          
          if (window.confirm(`Found ${results.data.length} products. Do you want to import them?`)) {
            try {
              let count = 0;
              for (const row of results.data as any[]) {
                if (!row.SKU || !row['Product Name']) continue;
                
                const product = {
                  ...defaultProduct,
                  sku: row.SKU,
                  name: row['Product Name'],
                  slug: row['Product Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                  brandId: BRANDS_DATA.find(b => b.name.toLowerCase() === row.Brand?.toLowerCase())?.id || row.Brand || '',
                  categoryId: CATEGORIES_DATA.find(c => c.name.toLowerCase() === row.Category?.toLowerCase())?.id || row.Category || '',
                  collection: row.Collection || '',
                  description: row.Description || '',
                  finish: row.Finish ? row.Finish.split(',').map((s: string) => s.trim()) : [],
                  images: row['Image URL'] ? [row['Image URL']] : [],
                  thumbnail: row['Image URL'] || '',
                  documents: row['PDF URL'] ? [{ id: 'doc-1', title: 'Catalogue', type: 'PDF Catalogue', url: row['PDF URL'] }] : [],
                  status: 'Active',
                  createdAt: new Date().toISOString()
                };
                
                await createDocument('products', product, product.sku);
                count++;
              }
              alert(`Successfully imported ${count} products!`);
              loadProducts();
              setActiveTab('list');
            } catch (err) {
              console.error("Import failed", err);
              alert('Failed during import process.');
            }
          }
        }
      });
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      try {
        for (const id of selectedProducts) {
          await deleteDocument('products', id);
        }
        alert('Products deleted successfully');
        setSelectedProducts([]);
        loadProducts();
      } catch (e) {
        console.error("Bulk delete failed", e);
        alert('Failed to delete some products');
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const searchStr = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(searchStr) || 
      p.sku?.toLowerCase().includes(searchStr) ||
      p.collection?.toLowerCase().includes(searchStr) ||
      BRANDS_DATA.find(b => b.id === p.brandId)?.name.toLowerCase().includes(searchStr) ||
      CATEGORIES_DATA.find(c => c.id === p.categoryId)?.name.toLowerCase().includes(searchStr)
    );
  });

  const handleBulkChangeStatus = async (newStatus: string) => {
    try {
      for (const id of selectedProducts) {
        await updateDocument('products', id, { status: newStatus });
      }
      alert(`Status changed to ${newStatus} for ${selectedProducts.length} products`);
      setSelectedProducts([]);
      setShowBulkActions(false);
      loadProducts();
    } catch (e) {
      console.error("Bulk status change failed", e);
      alert('Failed to change status');
    }
  };

  const handleExport = () => {
    const dataToExport = (selectedProducts.length > 0 ? products.filter(p => selectedProducts.includes(p.id || p.sku)) : filteredProducts).map(p => ({
      'SKU': p.sku,
      'Product Name': p.name,
      'Brand': BRANDS_DATA.find(b => b.id === p.brandId)?.name || p.brandId,
      'Category': CATEGORIES_DATA.find(c => c.id === p.categoryId)?.name || p.categoryId,
      'Sub Category': p.subCategory,
      'Collection': p.collection,
      'Description': p.description,
      'Finish': p.finish?.join(', '),
      'Color': p.color?.join(', '),
      'Status': p.status,
      'Image URL': p.thumbnail || p.images?.[0] || '',
      'PDF URL': p.documents?.find((d: any) => d.type === 'PDF Catalogue')?.url || ''
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "azm_products_export.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              <label className="block text-sm font-bold text-stone-700 mb-2">Sub Category</label>
              <input type="text" value={formData.subCategory || ''} onChange={e => setFormData({...formData, subCategory: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="e.g. Basin Mixers" />
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
              <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary"></textarea>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h3 className="text-lg font-bold text-stone-800 mb-4 border-b pb-2">Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Finish (comma separated)</label>
              <input type="text" value={formData.finish?.join(', ') || ''} onChange={e => setFormData({...formData, finish: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="e.g. Chrome, Gold" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Color (comma separated)</label>
              <input type="text" value={formData.color?.join(', ') || ''} onChange={e => setFormData({...formData, color: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="e.g. White, Black" />
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
              <label className="block text-sm font-bold text-stone-700 mb-2">Weight</label>
              <input type="text" value={formData.weight || ''} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="e.g. 5kg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Warranty</label>
              <input type="text" value={formData.warranty || ''} onChange={e => setFormData({...formData, warranty: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="e.g. 15 Years" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Installation Type</label>
              <input type="text" value={formData.installationType?.join(', ') || ''} onChange={e => setFormData({...formData, installationType: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="e.g. Wall Mounted" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Application</label>
              <input type="text" value={formData.application?.join(', ') || ''} onChange={e => setFormData({...formData, application: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="e.g. Bathroom, Kitchen" />
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-bold text-stone-700 mb-2">Technical Specifications</label>
              <textarea value={formData.technicalSpecifications || ''} onChange={e => setFormData({...formData, technicalSpecifications: e.target.value})} rows={2} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="Technical details..."></textarea>
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-bold text-stone-700 mb-2">Features (one per line)</label>
              <textarea value={formData.features?.join('\n') || ''} onChange={e => setFormData({...formData, features: e.target.value.split('\n').filter(s => s.trim())})} rows={3} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="Feature 1&#10;Feature 2"></textarea>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div>
          <h3 className="text-lg font-bold text-stone-800 mb-4 border-b pb-2">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Catalogue PDF URL</label>
              <input type="text" value={formData.documents?.find((d: any) => d.type === 'PDF Catalogue')?.url || ''} 
                onChange={e => {
                  const existing = formData.documents?.filter((d: any) => d.type !== 'PDF Catalogue') || [];
                  if (e.target.value) {
                    setFormData({...formData, documents: [...existing, { id: 'doc-cat', title: 'Catalogue', type: 'PDF Catalogue', url: e.target.value }]});
                  } else {
                    setFormData({...formData, documents: existing});
                  }
                }} 
                className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="https://example.com/catalogue.pdf" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Technical Sheet URL</label>
              <input type="text" value={formData.documents?.find((d: any) => d.type === 'Technical Sheet')?.url || ''} 
                onChange={e => {
                  const existing = formData.documents?.filter((d: any) => d.type !== 'Technical Sheet') || [];
                  if (e.target.value) {
                    setFormData({...formData, documents: [...existing, { id: 'doc-tech', title: 'Technical Sheet', type: 'Technical Sheet', url: e.target.value }]});
                  } else {
                    setFormData({...formData, documents: existing});
                  }
                }} 
                className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="https://example.com/tech.pdf" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Installation Guide URL</label>
              <input type="text" value={formData.documents?.find((d: any) => d.type === 'Installation Guide')?.url || ''} 
                onChange={e => {
                  const existing = formData.documents?.filter((d: any) => d.type !== 'Installation Guide') || [];
                  if (e.target.value) {
                    setFormData({...formData, documents: [...existing, { id: 'doc-inst', title: 'Installation Guide', type: 'Installation Guide', url: e.target.value }]});
                  } else {
                    setFormData({...formData, documents: existing});
                  }
                }} 
                className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="https://example.com/install.pdf" />
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

        {/* Images */}
        <div>
          <h3 className="text-lg font-bold text-stone-800 mb-4 border-b pb-2">Images</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Thumbnail URL (Optional, defaults to first image)</label>
              <input type="text" value={formData.thumbnail || ''} onChange={e => setFormData({...formData, thumbnail: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary" placeholder="https://example.com/thumb.jpg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Image URLs (one per line)</label>
              <textarea 
                value={formData.images?.join('\n') || ''} 
                onChange={e => setFormData({...formData, images: e.target.value.split('\n').filter(url => url.trim() !== '')})} 
                rows={4} 
                className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary"
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              ></textarea>
            </div>
            {formData.images && formData.images.length > 0 && (
              <div className="flex gap-4 overflow-x-auto py-2">
                {formData.images.map((url, i) => (
                  <img key={i} src={url} alt={`Preview ${i}`} className="h-20 w-20 object-cover rounded-lg border border-stone-200" />
                ))}
              </div>
            )}
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
          <p className="text-stone-500 text-sm">Manage all website products, categories, brands, images and technical documents.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {role !== 'viewer' && (
            <>
              <button onClick={() => { setFormData(defaultProduct); setActiveTab('add'); }} className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors">
                <Plus size={16} /> Add New Product
              </button>
              <button onClick={() => setActiveTab('import')} className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-bold border border-stone-200 hover:bg-stone-200 transition-colors">
                <Upload size={16} /> Import Products
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-bold border border-stone-200 hover:bg-stone-200 transition-colors">
                <Download size={16} /> Export Products
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
              {selectedProducts.length > 0 && (
                <div className="relative">
                  <button 
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-secondary"
                  >
                    Bulk Actions ({selectedProducts.length})
                  </button>
                  {showBulkActions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-200 z-10 overflow-hidden">
                      <button onClick={handleBulkDelete} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-stone-50 font-medium border-b border-stone-100 flex items-center gap-2">
                        <Trash2 size={16} /> Delete Selected
                      </button>
                      <button onClick={() => { handleBulkChangeStatus('Active'); }} className="w-full text-left px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 font-medium border-b border-stone-100">
                        Set as Active
                      </button>
                      <button onClick={() => { handleBulkChangeStatus('Draft'); }} className="w-full text-left px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 font-medium border-b border-stone-100">
                        Set as Draft
                      </button>
                      <button onClick={() => { handleExport(); setShowBulkActions(false); }} className="w-full text-left px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 font-medium">
                        Export Selected
                      </button>
                    </div>
                  )}
                </div>
              )}
              <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 flex-1 sm:flex-none justify-center">
                <Filter size={16} /> Filters
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 flex-1 sm:flex-none justify-center">
                <Download size={16} /> Export
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
                  <th className="px-6 py-4 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-stone-300 text-brand-primary focus:ring-brand-primary"
                      checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-4 font-bold">Image & Name</th>
                  <th className="px-6 py-4 font-bold">SKU</th>
                  <th className="px-6 py-4 font-bold">Brand</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Collection</th>
                  <th className="px-6 py-4 font-bold">Finish</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Last Updated</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-8 text-center text-stone-500">Loading products...</td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-8 text-center text-stone-500">No products found.</td>
                  </tr>
                ) : filteredProducts.map((product) => {
                  const category = CATEGORIES_DATA.find(c => c.id === product.categoryId)?.name || product.categoryId || 'Unknown';
                  const brand = BRANDS_DATA.find(b => b.id === product.brandId)?.name || product.brandId || 'Unknown';
                  const id = product.id || product.sku;
                  return (
                    <tr key={id} className={`hover:bg-stone-50 transition-colors ${selectedProducts.includes(id) ? 'bg-stone-50' : ''}`}>
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          className="rounded border-stone-300 text-brand-primary focus:ring-brand-primary"
                          checked={selectedProducts.includes(id)}
                          onChange={() => handleSelectProduct(id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0">
                            {product.thumbnail || product.images?.[0] ? (
                              <OptimizedImage src={product.thumbnail || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-400">
                                <ImageIcon size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-stone-800 text-sm max-w-[200px] truncate" title={product.name}>{product.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs font-mono bg-stone-100 px-2 py-1 rounded text-stone-700">{product.sku}</code>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-stone-600">{brand}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-stone-600">{category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-stone-600">{product.collection || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-stone-600 max-w-[120px] truncate block">{product.finish?.join(', ') || '-'}</span>
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
                      <td className="px-6 py-4">
                        <span className="text-sm text-stone-600">{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '-'}</span>
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
            <div className="flex gap-4 items-center">
              <button className="flex items-center gap-2 text-brand-primary text-sm font-bold hover:underline">
                <Download size={16} /> Download Template
              </button>
              <button onClick={() => setActiveTab('list')} className="text-stone-400 hover:text-stone-600">
                <X size={24} />
              </button>
            </div>
          </div>
          <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-xl p-12 text-center hover:bg-stone-100 transition-colors cursor-pointer mb-8">
            <FileSpreadsheet className="mx-auto text-brand-primary mb-4" size={48} />
            <h3 className="font-bold text-lg text-stone-700 mb-2">Upload Data File</h3>
            <p className="text-stone-500 text-sm mb-4">Drag and drop your .csv file here, or click to browse</p>
            <input type="file" className="hidden" id="file-upload" accept=".csv" onChange={handleFileUpload} />
            <label htmlFor="file-upload" className="px-6 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50 shadow-sm cursor-pointer inline-block">
              Select File
            </label>
          </div>
        </motion.div>
      )}
    </div>
  );
}
