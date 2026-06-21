import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { searchProducts } from '../data';
import { ProductCatalog } from '../types';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export function PredictiveSearch({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductCatalog[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      setIsSearching(true);
      setIsOpen(true);
      // Simulate network request for realistic feel
      const timeoutId = setTimeout(() => {
        setResults(searchProducts(query));
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const bgClasses = variant === 'dark' 
    ? "bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 focus:bg-white/20" 
    : "bg-white border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-brand-primary";

  return (
    <div ref={wrapperRef} className="relative w-full z-50">
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${variant === 'dark' ? 'text-white/60' : 'text-stone-400'}`} size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by SKU, Name, Series, or Category..."
          className={`w-full pl-12 pr-12 py-3 rounded-full focus:outline-none transition-all shadow-sm ${bgClasses}`}
        />
        {isSearching && (
          <Loader2 className={`absolute right-4 top-1/2 -translate-y-1/2 animate-spin ${variant === 'dark' ? 'text-white' : 'text-brand-primary'}`} size={18} />
        )}
      </div>

      <AnimatePresence>
        {isOpen && query.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden"
          >
            {results.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                <div className="p-2 border-b border-stone-100 bg-stone-50 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Products ({results.length})
                </div>
                {results.map((product) => (
                  <Link
                    key={product.sku}
                    to={`/products/${product.sku}`}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="flex items-center gap-4 p-4 hover:bg-stone-50 transition-colors border-b border-stone-50 last:border-0 group"
                  >
                    <div className="w-12 h-12 rounded bg-stone-200 overflow-hidden flex-shrink-0">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-brand-secondary group-hover:text-brand-primary transition-colors">
                          {product.name}
                        </h4>
                        <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                          {product.sku}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 flex gap-2 items-center mt-1">
                        <span className="font-semibold text-brand-secondary">{product.brand}</span>
                        <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                        <span>{product.series}</span>
                        <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                        <span>{product.category}</span>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-stone-300 group-hover:text-brand-primary transform group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search size={32} className="mx-auto text-stone-200 mb-4" />
                <p className="text-stone-500 font-medium">No results found for "{query}"</p>
                <p className="text-sm text-stone-400 mt-2">Try searching by category (e.g. "Toilets") or SKU.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
