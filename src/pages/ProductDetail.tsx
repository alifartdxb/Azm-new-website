import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';
import { getProductBySlug, getBrandBySlug, getCategoryById, PRODUCTS_DATA } from '../data';
import { ArrowLeft, ChevronRight, FileText, MessageSquare, Mail, Download, Ruler, Settings, CheckCircle2, Shield, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getCollection } from '../services/db';

import { NotFoundPage } from './NotFoundPage';

export function ProductDetail() {
  const { brandSlug, categorySlug, productSlug, sku } = useParams<{ brandSlug?: string, categorySlug?: string, productSlug?: string, sku?: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const dbProducts = await getCollection('products');
        
        let foundProduct = null;
        if (productSlug) {
           foundProduct = dbProducts.find((p: any) => p.slug === productSlug);
        } else if (sku) {
           foundProduct = dbProducts.find((p: any) => p.sku === sku);
        }

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          // Fallback to static data
          const staticProduct = productSlug ? getProductBySlug(productSlug) : (sku ? PRODUCTS_DATA.find(p => p.sku === sku) : undefined);
          setProduct(staticProduct);
        }
      } catch (e) {
        console.error(e);
        const staticProduct = productSlug ? getProductBySlug(productSlug) : (sku ? PRODUCTS_DATA.find(p => p.sku === sku) : undefined);
        setProduct(staticProduct);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [productSlug, sku]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
  }

  if (!product) {
    return <NotFoundPage />;
  }

  const brand = getBrandBySlug(product.brandId || brandSlug || '');
  const category = getCategoryById(product.categoryId);

  const schemas = [
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.images,
      "description": product.description,
      "sku": product.sku,
      "brand": {
        "@type": "Brand",
        "name": brand?.name || "Unknown Brand"
      }
    }
  ];

  return (
    <div className="flex-grow flex flex-col bg-white">
      <SEO 
        title={product.seoTitle}
        description={product.seoDescription}
        keywords={[product.name, product.sku, brand?.name || '', category?.name || '', "Dubai", "UAE"]}
        schemas={schemas}
      />

      <div className="pt-24 pb-4 border-b border-stone-100 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex text-xs font-bold uppercase tracking-wider text-stone-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to="/brands" className="hover:text-brand-primary transition-colors">Brands</Link>
            {brand && (
              <>
                <ChevronRight size={14} className="mx-2" />
                <Link to={`/brands/${brand.slug}`} className="hover:text-brand-primary transition-colors">{brand.name}</Link>
              </>
            )}
            <ChevronRight size={14} className="mx-2" />
            <span className="text-brand-secondary">{product.sku}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden relative">
              <OptimizedImage 
                src={product.images[activeImage]} 
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply p-8"
              />
              {brand && (
                <div className="absolute top-6 left-6">
                  <OptimizedImage src={brand.logo} alt={brand.name} className="h-8 w-auto mix-blend-multiply opacity-50" fallbackSrc={`https://via.placeholder.com/150x50?text=${brand.name}`} />
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square bg-stone-50 rounded-xl border-2 overflow-hidden ${activeImage === idx ? 'border-brand-primary' : 'border-transparent hover:border-stone-300'} transition-all`}
                  >
                    <OptimizedImage src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <Link to={`/brands/${brand?.slug}`} className="text-sm font-bold uppercase tracking-widest text-brand-primary hover:underline mb-2 block">
                  {brand?.name}
                </Link>
                <h1 className="text-3xl md:text-5xl font-bold font-display text-brand-secondary mb-2">{product.name}</h1>
                <div className="flex items-center gap-3 text-sm font-mono text-stone-500 bg-stone-100 px-3 py-1 rounded inline-block">
                  SKU: {product.sku}
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-400 hover:text-brand-primary hover:border-brand-primary transition-colors tooltip" aria-label="Share">
                <Share2 size={18} />
              </button>
            </div>

            <p className="text-lg text-stone-600 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                <span className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Collection</span>
                <span className="font-bold text-brand-secondary">{product.collection}</span>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                <span className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Status</span>
                <span className={`font-bold ${product.status === 'Available' ? 'text-green-600' : 'text-orange-500'}`}>{product.status}</span>
              </div>
            </div>

            {/* Finishes */}
            {product.finish && product.finish.length > 0 && (
              <div className="mb-10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 mb-4">Available Finishes</h3>
                <div className="flex flex-wrap gap-3">
                  {product.finish.map(f => (
                    <div key={f} className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 shadow-sm">
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 mb-12">
              <Link to={`/contact?tab=quote&sku=${product.sku}`} className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-brand-secondary transition-colors shadow-lg hover:shadow-xl">
                Request a Quote <FileText size={18} />
              </Link>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href={`https://wa.me/971501234567?text=I am interested in ${product.name} (${product.sku})`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-green-600 transition-colors shadow-lg">
                  WhatsApp Inquiry <MessageSquare size={18} />
                </a>
                <a href={`mailto:sales@azmgroup.ae?subject=Inquiry about ${product.sku}`} className="w-full flex items-center justify-center gap-2 bg-stone-100 text-stone-800 border border-stone-200 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors">
                  Email Inquiry <Mail size={18} />
                </a>
              </div>
            </div>

            {/* Downloads */}
            {product.documents && product.documents.length > 0 && (
              <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                <h3 className="font-bold text-lg text-brand-secondary mb-4 flex items-center gap-2"><Download size={20} className="text-brand-primary" /> Technical Documents</h3>
                <div className="space-y-3">
                  {product.documents.map(doc => (
                    <a key={doc.id} href={doc.url} className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-xl hover:border-brand-primary group transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-stone-400 group-hover:text-brand-primary transition-colors" />
                        <span className="font-medium text-sm text-stone-700">{doc.title}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">Download PDF</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* Tabs / Detailed Specs */}
      <div className="bg-stone-50 border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="text-xl font-bold font-display text-brand-secondary">Key Features</h3>
              </div>
              <ul className="space-y-3">
                {product.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                    <span className="text-stone-600 leading-relaxed text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Settings size={20} />
                </div>
                <h3 className="text-xl font-bold font-display text-brand-secondary">Specifications</h3>
              </div>
              <dl className="space-y-4">
                <div className="grid grid-cols-3 gap-4 border-b border-stone-200 pb-2">
                  <dt className="text-xs font-bold uppercase tracking-wider text-stone-500">Material</dt>
                  <dd className="col-span-2 text-sm font-medium text-stone-800">{product.material}</dd>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-stone-200 pb-2">
                  <dt className="text-xs font-bold uppercase tracking-wider text-stone-500">Installation</dt>
                  <dd className="col-span-2 text-sm font-medium text-stone-800">{product.installationType?.join(', ')}</dd>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-stone-200 pb-2">
                  <dt className="text-xs font-bold uppercase tracking-wider text-stone-500">Application</dt>
                  <dd className="col-span-2 text-sm font-medium text-stone-800">{product.application?.join(', ')}</dd>
                </div>
                <div className="grid grid-cols-3 gap-4 pb-2">
                  <dt className="text-xs font-bold uppercase tracking-wider text-stone-500">Tech Specs</dt>
                  <dd className="col-span-2 text-sm font-medium text-stone-800">{product.technicalSpecifications}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Ruler size={20} />
                </div>
                <h3 className="text-xl font-bold font-display text-brand-secondary">Dimensions & Setup</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-6">
                <p className="text-sm font-bold text-stone-900 mb-2">Overall Dimensions</p>
                <p className="text-stone-600 font-mono text-sm">{product.dimensions}</p>
                <div className="my-4 border-t border-stone-100" />
                <p className="text-sm font-bold text-stone-900 mb-2">Weight</p>
                <p className="text-stone-600 font-mono text-sm">{product.weight}</p>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-brand-secondary text-white rounded-xl">
                <Shield size={24} className="text-brand-primary flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Warranty</p>
                  <p className="font-bold">{product.warranty}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  );
}
