import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS_CATEGORIES, BRANDS, MOCK_PRODUCTS_DATABASE } from "../data";
import { ArrowRight, SlidersHorizontal, ChevronRight, X, ArrowUpRight, Check, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Products() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [selectedInstallationTypes, setSelectedInstallationTypes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<"name-asc" | "name-desc" | "newest">("name-asc");

  // Extract unique filter options
  const allFinishes = Array.from(new Set(MOCK_PRODUCTS_DATABASE.flatMap(p => p.finish || [])));
  const allCollections = Array.from(new Set(MOCK_PRODUCTS_DATABASE.map(p => p.collectionName).filter(Boolean) as string[]));
  const allSeries = Array.from(new Set(MOCK_PRODUCTS_DATABASE.map(p => p.series).filter(Boolean)));
  const allInstallationTypes = Array.from(new Set(MOCK_PRODUCTS_DATABASE.flatMap(p => p.installationType || [])));
  const allColors = Array.from(new Set(MOCK_PRODUCTS_DATABASE.flatMap(p => p.color || [])));
  const allApplications = Array.from(new Set(MOCK_PRODUCTS_DATABASE.flatMap(p => p.application || [])));

  const toggleFilter = (list: string[], setList: (l: string[]) => void, value: string) => {
    if (list.includes(value)) {
      setList(list.filter(v => v !== value));
    } else {
      setList([...list, value]);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS_DATABASE;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) ||
        p.series.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    if (selectedFinishes.length > 0) {
      result = result.filter(p => p.finish.some(f => selectedFinishes.includes(f)));
    }

    if (selectedCollections.length > 0) {
      result = result.filter(p => p.collectionName && selectedCollections.includes(p.collectionName));
    }

    if (selectedSeries.length > 0) {
      result = result.filter(p => selectedSeries.includes(p.series));
    }

    if (selectedInstallationTypes.length > 0) {
      result = result.filter(p => p.installationType?.some(i => selectedInstallationTypes.includes(i)));
    }

    if (selectedColors.length > 0) {
      result = result.filter(p => p.color?.some(c => selectedColors.includes(c)));
    }

    if (selectedApplications.length > 0) {
      result = result.filter(p => p.application?.some(a => selectedApplications.includes(a)));
    }

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortOption === "name-asc") return a.name.localeCompare(b.name);
      if (sortOption === "name-desc") return b.name.localeCompare(a.name);
      return 0; // "newest" would normally sort by date, for mock we do nothing
    });

    return result;
  }, [
    searchQuery, selectedCategories, selectedBrands, selectedFinishes, 
    selectedCollections, selectedSeries, selectedInstallationTypes, 
    selectedColors, selectedApplications, sortOption
  ]);

  const FilterSection = ({ title, options, selected, onToggle }: { title: string, options: string[], selected: string[], onToggle: (val: string) => void }) => (
    <div className="mb-8">
      <h3 className="text-sm font-bold uppercase tracking-wider text-brand-secondary mb-4">{title}</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
              selected.includes(opt) ? "bg-brand-primary border-brand-primary text-white" : "border-stone-300 bg-white group-hover:border-brand-primary"
            }`}>
              {selected.includes(opt) && <Check size={14} />}
            </div>
            <span className={`text-sm ${selected.includes(opt) ? "text-brand-secondary font-medium" : "text-stone-600 group-hover:text-brand-secondary"}`}>
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-grow flex flex-col bg-stone-50 font-sans text-brand-dark min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-stone-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center text-xs font-semibold uppercase tracking-widest text-stone-500 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
          <ChevronRight size={14} className="mx-2 flex-shrink-0" />
          <span className="text-brand-secondary">Catalog</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col lg:flex-row gap-10">
        
        {/* Mobile Filters Toggle & Search bar */}
        <div className="lg:hidden flex flex-col gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-full focus:outline-none focus:border-brand-primary shadow-sm"
            />
          </div>
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-stone-200">
             <button 
               onClick={() => setIsMobileFiltersOpen(true)}
               className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-secondary"
             >
               <SlidersHorizontal size={18} /> Filters ({selectedCategories.length + selectedBrands.length + selectedFinishes.length})
             </button>
             <select 
               value={sortOption}
               onChange={(e) => setSortOption(e.target.value as any)}
               className="bg-transparent text-sm font-medium focus:outline-none"
             >
               <option value="name-asc">Alphabetical A-Z</option>
               <option value="name-desc">Alphabetical Z-A</option>
               <option value="newest">Newest Arrivals</option>
             </select>
          </div>
        </div>

        {/* Sidebar Filters */}
        <div className={`fixed inset-0 z-[100] lg:z-0 lg:static lg:block lg:w-1/4 bg-white lg:bg-transparent overflow-y-auto lg:overflow-visible transition-transform duration-300 ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
           <div className="p-6 lg:p-0">
              <div className="flex justify-between items-center lg:hidden mb-8">
                 <h2 className="text-xl font-bold font-display text-brand-secondary">Refine Search</h2>
                 <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-stone-100 rounded-full text-stone-600">
                   <X size={20} />
                 </button>
              </div>

              <div className="bg-white lg:border border-stone-200 rounded-2xl lg:p-6 lg:shadow-sm">
                 <div className="flex justify-between items-center mb-6 pb-6 border-b border-stone-100">
                    <h2 className="font-bold text-brand-secondary flex items-center gap-2 font-display">
                      <SlidersHorizontal size={18} className="text-brand-primary" /> Filters
                    </h2>
                    {(selectedCategories.length > 0 || selectedBrands.length > 0 || selectedFinishes.length > 0 || selectedCollections.length > 0 || selectedSeries.length > 0 || selectedInstallationTypes.length > 0 || selectedColors.length > 0 || selectedApplications.length > 0) && (
                      <button 
                        onClick={() => { 
                          setSelectedCategories([]); setSelectedBrands([]); setSelectedFinishes([]); 
                          setSelectedCollections([]); setSelectedSeries([]); setSelectedInstallationTypes([]);
                          setSelectedColors([]); setSelectedApplications([]);
                        }}
                        className="text-xs font-semibold text-stone-400 hover:text-brand-primary uppercase tracking-wider"
                      >
                        Clear All
                      </button>
                    )}
                 </div>

                 <FilterSection 
                   title="Category" 
                   options={PRODUCTS_CATEGORIES} 
                   selected={selectedCategories} 
                   onToggle={(val) => toggleFilter(selectedCategories, setSelectedCategories, val)} 
                 />

                 <FilterSection 
                   title="Brand" 
                   options={BRANDS} 
                   selected={selectedBrands} 
                   onToggle={(val) => toggleFilter(selectedBrands, setSelectedBrands, val)} 
                 />

                 <FilterSection 
                   title="Collection" 
                   options={allCollections} 
                   selected={selectedCollections} 
                   onToggle={(val) => toggleFilter(selectedCollections, setSelectedCollections, val)} 
                 />

                 <FilterSection 
                   title="Series" 
                   options={allSeries} 
                   selected={selectedSeries} 
                   onToggle={(val) => toggleFilter(selectedSeries, setSelectedSeries, val)} 
                 />

                 <FilterSection 
                   title="Finish" 
                   options={allFinishes} 
                   selected={selectedFinishes} 
                   onToggle={(val) => toggleFilter(selectedFinishes, setSelectedFinishes, val)} 
                 />

                 <FilterSection 
                   title="Installation Type" 
                   options={allInstallationTypes} 
                   selected={selectedInstallationTypes} 
                   onToggle={(val) => toggleFilter(selectedInstallationTypes, setSelectedInstallationTypes, val)} 
                 />

                 <FilterSection 
                   title="Color" 
                   options={allColors} 
                   selected={selectedColors} 
                   onToggle={(val) => toggleFilter(selectedColors, setSelectedColors, val)} 
                 />

                 <FilterSection 
                   title="Application" 
                   options={allApplications} 
                   selected={selectedApplications} 
                   onToggle={(val) => toggleFilter(selectedApplications, setSelectedApplications, val)} 
                 />
              </div>
           </div>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4 flex flex-col">
           {/* Desktop utilities */}
           <div className="hidden lg:flex justify-between items-center mb-8 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex-grow max-w-md mr-8 relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                 <input 
                   type="text"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search products by SKU, name, or series..."
                   className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-full focus:outline-none focus:border-brand-primary focus:bg-white transition-colors"
                 />
              </div>
              
              <div className="flex items-center gap-4">
                 <span className="text-sm text-stone-500 font-medium">Viewing <span className="text-brand-secondary font-bold">{filteredProducts.length}</span> Products</span>
                 <div className="h-6 w-px bg-stone-200"></div>
                 <select 
                   value={sortOption}
                   onChange={(e) => setSortOption(e.target.value as any)}
                   className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:border-brand-primary"
                 >
                   <option value="name-asc">Alphabetical A-Z</option>
                   <option value="name-desc">Alphabetical Z-A</option>
                   <option value="newest">Newest Arrivals</option>
                 </select>
              </div>
           </div>

           {/* Active Filters */}
           {(selectedCategories.length > 0 || selectedBrands.length > 0 || selectedFinishes.length > 0 || selectedCollections.length > 0 || selectedSeries.length > 0 || selectedInstallationTypes.length > 0 || selectedColors.length > 0 || selectedApplications.length > 0) && (
             <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map(c => (
                  <span key={c} className="bg-brand-secondary text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                    {c} <button onClick={() => toggleFilter(selectedCategories, setSelectedCategories, c)}><X size={12} /></button>
                  </span>
                ))}
                {selectedBrands.map(b => (
                  <span key={b} className="bg-brand-secondary text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                    {b} <button onClick={() => toggleFilter(selectedBrands, setSelectedBrands, b)}><X size={12} /></button>
                  </span>
                ))}
                {selectedCollections.map(c => (
                  <span key={c} className="bg-brand-secondary text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                    {c} <button onClick={() => toggleFilter(selectedCollections, setSelectedCollections, c)}><X size={12} /></button>
                  </span>
                ))}
                {selectedSeries.map(s => (
                  <span key={s} className="bg-brand-secondary text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                    {s} <button onClick={() => toggleFilter(selectedSeries, setSelectedSeries, s)}><X size={12} /></button>
                  </span>
                ))}
                {selectedFinishes.map(f => (
                  <span key={f} className="bg-brand-secondary text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                    {f} <button onClick={() => toggleFilter(selectedFinishes, setSelectedFinishes, f)}><X size={12} /></button>
                  </span>
                ))}
                {selectedInstallationTypes.map(i => (
                  <span key={i} className="bg-brand-secondary text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                    {i} <button onClick={() => toggleFilter(selectedInstallationTypes, setSelectedInstallationTypes, i)}><X size={12} /></button>
                  </span>
                ))}
                {selectedColors.map(c => (
                  <span key={c} className="bg-brand-secondary text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                    {c} <button onClick={() => toggleFilter(selectedColors, setSelectedColors, c)}><X size={12} /></button>
                  </span>
                ))}
                {selectedApplications.map(a => (
                  <span key={a} className="bg-brand-secondary text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                    {a} <button onClick={() => toggleFilter(selectedApplications, setSelectedApplications, a)}><X size={12} /></button>
                  </span>
                ))}
             </div>
           )}

           {/* Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
             <AnimatePresence>
               {filteredProducts.map((product) => (
                 <motion.div
                   layout
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   transition={{ duration: 0.3 }}
                   key={product.sku}
                 >
                   <Link 
                     to={`/products/${product.sku}`}
                     className="group bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                   >
                     <div className="aspect-square bg-stone-50 relative overflow-hidden p-6 flex flex-col items-center justify-center">
                       <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute top-4 left-4">
                         <span className="bg-brand-primary/10 text-brand-primary text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
                           {product.brand}
                         </span>
                       </div>
                       {/* Glass hover details */}
                       <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <div className="bg-white/90 backdrop-blur text-brand-secondary text-xs font-medium px-3 py-2 rounded shadow-lg flex justify-between items-center">
                            <span>View Specifications</span>
                            <ArrowUpRight size={14} />
                          </div>
                       </div>
                     </div>
                     <div className="p-6 flex flex-col flex-grow">
                       <div className="flex gap-2 items-center mb-2">
                         <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider">{product.category}</p>
                         <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                         <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider">{product.series}</p>
                       </div>
                       <h4 className="text-base font-bold text-brand-secondary group-hover:text-brand-primary transition-colors mb-2 line-clamp-2">
                         {product.name}
                       </h4>
                       <p className="text-xs font-mono text-stone-500 mt-auto pt-4 border-t border-stone-50 flex items-center justify-between">
                         <span>SKU: {product.sku}</span>
                         <span className="flex items-center gap-1 font-sans text-brand-primary font-semibold">Details <ArrowRight size={12} /></span>
                       </p>
                     </div>
                   </Link>
                 </motion.div>
               ))}
             </AnimatePresence>
             {filteredProducts.length === 0 && (
                <div className="col-span-full py-24 text-center bg-white rounded-2xl border border-stone-100">
                  <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                    <SlidersHorizontal size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-brand-secondary mb-2">No products found</h3>
                  <p className="text-stone-500">Try adjusting your filters or search query to find what you're looking for.</p>
                  <button 
                    onClick={() => { 
                      setSelectedCategories([]); setSelectedBrands([]); setSelectedFinishes([]); 
                      setSelectedCollections([]); setSelectedSeries([]); setSelectedInstallationTypes([]);
                      setSelectedColors([]); setSelectedApplications([]);
                      setSearchQuery(""); 
                    }}
                    className="mt-6 text-brand-primary font-semibold hover:underline uppercase tracking-wider text-sm"
                  >
                    Clear All Filters
                  </button>
                </div>
             )}
           </div>
        </div>
      </div>
      
    </div>
  );
}
