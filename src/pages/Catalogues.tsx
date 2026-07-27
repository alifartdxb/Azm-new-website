import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Download, FileText, Filter, X, Eye, ArrowRight, BookOpen, Clock, ArrowDownToLine, Zap } from 'lucide-react';
import { getCollection } from '../services/db';

export function Catalogues() {
  const [catalogues, setCatalogues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // PDF Preview State
  const [previewPdf, setPreviewPdf] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Download Catalogues | AZM Group - Premium Building Materials";
    // Set meta tags if possible, but basic JS approach is to modify document.head
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Browse complete product catalogues from leading international brands including bathroom solutions, sanitary ware, tiles, and building materials in UAE.");
    }
    loadCatalogues();
  }, []);

  const loadCatalogues = async () => {
    try {
      setLoading(true);
      const data = await getCollection('catalogues');
      // If DB is empty, let's inject some dummy catalogues for visual completeness
      if (data.length === 0) {
        setCatalogues([
          {
            id: '1', title: 'VADO Life Collection 2024', brand: 'VADO', category: 'Bathroom Faucets', product_type: 'Mixer',
            thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
            pdf_url: '#', pages: 124, file_size: '15MB', language: 'English', year: '2024'
          },
          {
            id: '2', title: 'Jaquar Artize Showers', brand: 'Jaquar', category: 'Shower Systems', product_type: 'Shower',
            thumbnail: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=600',
            pdf_url: '#', pages: 86, file_size: '12MB', language: 'English', year: '2024'
          },
          {
            id: '3', title: 'Italian Marble Slabs Premium', brand: 'AZM Stone', category: 'Tiles & Slabs', product_type: 'Marble Look',
            thumbnail: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600',
            pdf_url: '#', pages: 42, file_size: '24MB', language: 'English/Arabic', year: '2023'
          },
          {
            id: '4', title: 'Minimalist Sanitary Ware', brand: 'Sanit', category: 'Wash Basins', product_type: 'Sanitary Ware',
            thumbnail: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=600',
            pdf_url: '#', pages: 56, file_size: '8MB', language: 'English', year: '2024'
          }
        ]);
      } else {
        setCatalogues(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredCatalogues = catalogues.filter(cat => {
    const matchesSearch = 
      (cat.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.category || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesBrand = selectedBrand === 'All' || cat.brand === selectedBrand;
    const matchesCategory = selectedCategory === 'All' || cat.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'All' || cat.language === selectedLanguage;

    return matchesSearch && matchesBrand && matchesCategory && matchesLanguage;
  });

  const uniqueBrands = ['All', ...Array.from(new Set(catalogues.map(c => c.brand).filter(Boolean)))];
  const uniqueCategories = ['All', ...Array.from(new Set(catalogues.map(c => c.category).filter(Boolean)))];
  const uniqueLanguages = ['All', ...Array.from(new Set(catalogues.map(c => c.language).filter(Boolean)))];

  const featuredCatalogues = catalogues.slice(0, 3); // Just pick top 3 for featured

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* SECTION 1: CATALOGUE HERO */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-stone-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80"
            alt="Luxury Showroom"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white mb-6 tracking-tight"
          >
            Explore Our <span className="text-brand-primary italic">Product Catalogues</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-stone-300 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Browse complete product catalogues from leading international brands including bathroom solutions, sanitary ware, tiles, and building materials.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="#catalogue-library" className="bg-brand-primary text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-brand-secondary transition-colors inline-flex items-center justify-center gap-2">
              <Download size={18} /> Download Catalogue
            </a>
            <a href="/contact" className="bg-white text-stone-900 px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors inline-flex items-center justify-center gap-2">
              Request Assistance
            </a>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 & 3: SMART SEARCH & FILTER SYSTEM */}
      <section id="catalogue-library" className="py-12 bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            
            {/* Smart Search */}
            <div className="relative w-full lg:max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input 
                type="text" 
                placeholder="Search catalogues by name, brand, category, or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-none focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-stone-800 text-lg shadow-inner"
              />
            </div>

            {/* Filter Toggle Mobile/Desktop */}
            <div className="w-full lg:w-auto flex gap-4">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex-1 bg-stone-100 text-stone-800 px-6 py-4 flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm border border-stone-200"
              >
                <Filter size={18} /> Filters
              </button>
            </div>
            
          </div>

          {/* Desktop Filters / Expanded Mobile Filters */}
          <AnimatePresence>
            {(isFilterOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Brand</label>
                  <select 
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 p-3 text-stone-800 focus:outline-none focus:border-brand-primary"
                  >
                    {uniqueBrands.map(b => (
                      <option key={String(b)} value={String(b)}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Category</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 p-3 text-stone-800 focus:outline-none focus:border-brand-primary"
                  >
                    {uniqueCategories.map(c => (
                      <option key={String(c)} value={String(c)}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Language</label>
                  <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 p-3 text-stone-800 focus:outline-none focus:border-brand-primary"
                  >
                    {uniqueLanguages.map(l => (
                      <option key={String(l)} value={String(l)}>{l}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* SECTION 4: CATALOGUE CARD DESIGN */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold font-display text-brand-secondary mb-2">Catalogue Library</h2>
              <p className="text-stone-500">Showing {filteredCatalogues.length} results</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="w-12 h-12 border-4 border-stone-200 border-t-brand-primary rounded-full animate-spin"></div>
            </div>
          ) : filteredCatalogues.length === 0 ? (
            <div className="text-center py-32 bg-white border border-stone-200">
              <FileText size={48} className="mx-auto text-stone-300 mb-4" />
              <h3 className="text-xl font-bold text-stone-800 mb-2">No Catalogues Found</h3>
              <p className="text-stone-500">Try adjusting your search or filters.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedBrand('All'); setSelectedCategory('All'); setSelectedLanguage('All'); }}
                className="mt-6 text-brand-primary font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCatalogues.map((cat, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  key={cat.id || idx}
                  className="group bg-white border border-stone-200 hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 p-8 flex items-center justify-center">
                    <img 
                      src={cat.thumbnail || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400'} 
                      alt={cat.title}
                      className="w-full h-full object-cover shadow-lg group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-brand-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 p-6">
                      <button 
                        onClick={() => setPreviewPdf(cat.pdf_url || '#')}
                        className="w-full bg-white text-brand-secondary py-3 text-sm font-bold uppercase tracking-wider hover:bg-brand-primary hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye size={16} /> Preview
                      </button>
                      <a 
                        href={cat.pdf_url || '#'} 
                        download
                        className="w-full bg-transparent border-2 border-white text-white py-3 text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-brand-secondary transition-colors flex items-center justify-center gap-2"
                      >
                        <ArrowDownToLine size={16} className="group-hover:animate-bounce" /> Download PDF
                      </a>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6 flex flex-col flex-grow border-t border-stone-100">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-1">
                        {cat.brand || 'Brand'}
                      </span>
                      <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-1 rounded">
                        {cat.year || '2024'}
                      </span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-lg mb-1 leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-stone-500 mb-4">{cat.category || 'Catalogue'}</p>
                    
                    <div className="mt-auto pt-4 border-t border-stone-100 grid grid-cols-2 gap-4 text-xs font-medium text-stone-500">
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-stone-400" />
                        {cat.pages || 0} Pages
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap size={14} className="text-stone-400" />
                        {cat.file_size || 'N/A'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 6: FEATURED CATALOGUES */}
      <section className="py-24 bg-stone-100 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-brand-secondary mb-4">Featured Collections</h2>
              <p className="text-stone-600 max-w-2xl">Discover our latest and most popular product catalogues curated for architects and interior designers.</p>
            </div>
            <a href="#catalogue-library" className="hidden md:inline-flex items-center gap-2 text-brand-primary font-bold hover:text-brand-secondary transition-colors uppercase tracking-wider text-sm">
              View All <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCatalogues.map((cat, idx) => (
              <div key={idx} className="bg-white border border-stone-200 flex gap-4 p-4 hover:shadow-lg transition-shadow group">
                <div className="w-24 h-32 flex-shrink-0 bg-stone-100 relative overflow-hidden">
                   <img src={cat.thumbnail || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400'} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">{cat.brand}</span>
                  <h4 className="font-bold text-stone-900 mb-2 line-clamp-2">{cat.title}</h4>
                  <div className="flex gap-3 text-xs text-stone-500 font-medium">
                    <span>{cat.pages || 0} Pages</span>
                    <span>•</span>
                    <span>{cat.file_size || 'N/A'}</span>
                  </div>
                  <a href={cat.pdf_url || '#'} className="mt-4 text-brand-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                    Download <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: PDF PREVIEW MODAL */}
      <AnimatePresence>
        {previewPdf && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-stone-900/95 backdrop-blur-sm flex flex-col"
          >
            {/* Modal Header */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-stone-900">
              <h3 className="text-white font-bold tracking-wide">Catalogue Preview</h3>
              <div className="flex items-center gap-4">
                <a href={previewPdf} download className="text-stone-300 hover:text-white flex items-center gap-2 text-sm font-bold bg-white/10 px-4 py-2 rounded">
                  <Download size={16} /> Download
                </a>
                <button onClick={() => setPreviewPdf(null)} className="text-stone-400 hover:text-white p-2">
                  <X size={24} />
                </button>
              </div>
            </div>
            
            {/* PDF Viewer (Using object/iframe for native browser PDF preview) */}
            <div className="flex-grow p-4 md:p-8 bg-stone-900 flex items-center justify-center">
               <div className="w-full h-full max-w-5xl bg-stone-800 rounded-lg overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
                 {/* Fallback visual for demo if no real PDF url is provided */}
                 {previewPdf === '#' ? (
                   <div className="text-center p-8">
                     <FileText size={64} className="mx-auto text-stone-600 mb-6" />
                     <h4 className="text-2xl font-bold text-white mb-4">PDF Preview Unavailable</h4>
                     <p className="text-stone-400 max-w-md mx-auto mb-8">This is a demo catalogue. In a live environment, the actual PDF file would be displayed here using the browser's native PDF viewer.</p>
                     <button onClick={() => setPreviewPdf(null)} className="bg-brand-primary text-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-brand-secondary transition-colors">
                       Close Preview
                     </button>
                   </div>
                 ) : (
                    <object 
                      data={previewPdf} 
                      type="application/pdf" 
                      width="100%" 
                      height="100%"
                      className="w-full h-full"
                    >
                      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-white">
                        <FileText size={48} className="text-stone-500 mb-4" />
                        <p className="mb-4">It appears your browser doesn't support inline PDFs.</p>
                        <a href={previewPdf} className="bg-brand-primary text-white px-6 py-3 font-bold">Download PDF Instead</a>
                      </div>
                    </object>
                 )}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
