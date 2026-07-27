import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { BRANDS_DATA } from '../../data';
import { OptimizedImage } from '../../components/OptimizedImage';

export function AdminBrands() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredBrands = BRANDS_DATA.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Brand Management</h1>
          <p className="text-stone-500 text-sm">Manage partner brands and their landing pages.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-secondary transition-colors">
          <Plus size={16} /> Add Brand
        </button>
      </div>

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
              {filteredBrands.map((brand) => (
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
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-stone-400 hover:text-brand-primary transition-colors"><Edit2 size={16} /></button>
                      <button className="p-2 text-stone-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
