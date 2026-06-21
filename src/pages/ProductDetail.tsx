import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { MOCK_PRODUCTS_DATABASE } from "../data";
import { 
  ChevronRight, FileText, Download, MessageCircle, Mail, MapPin, 
  ZoomIn, Check, Settings, FileDown, ArrowRight, X 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function ProductDetail() {
  const { sku } = useParams<{ sku: string }>();
  // Use exact match or fallback to first product for mockup purposes
  const product = MOCK_PRODUCTS_DATABASE.find(p => p.sku === sku) || MOCK_PRODUCTS_DATABASE[0];
  
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedFinish, setSelectedFinish] = useState(product.finish[0]);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Mocking multiple images for the gallery if only one exists in DB
  const galleryImages = product.images.length > 1 
    ? product.images 
    : [
        product.images[0], 
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1000&auto=format&fit=crop"
      ];

  if (!product) return <div className="p-24 text-center">Product not found</div>;

  return (
    <div className="flex-grow flex flex-col bg-white font-sans text-brand-dark">
      {/* Breadcrumb Navigation */}
      <div className="bg-stone-50 border-b border-stone-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center text-xs font-semibold uppercase tracking-widest text-stone-500 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
          <ChevronRight size={14} className="mx-2 flex-shrink-0" />
          <Link to="/products" className="hover:text-brand-primary transition-colors">Catalog</Link>
          <ChevronRight size={14} className="mx-2 flex-shrink-0" />
          <Link to={`/products/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-brand-primary transition-colors">{product.category}</Link>
          <ChevronRight size={14} className="mx-2 flex-shrink-0" />
          <span className="text-brand-secondary">{product.sku}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Image Gallery */}
          <div className="flex flex-col gap-6">
            <div 
              className="relative aspect-square bg-stone-50 rounded-2xl overflow-hidden cursor-zoom-in border border-stone-100 group"
              onClick={() => setIsZoomModalOpen(true)}
            >
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center text-brand-secondary opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <ZoomIn size={20} />
                </div>
              </div>
              <div className="absolute top-4 left-4">
                 <span className="bg-white/90 backdrop-blur text-brand-secondary text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded shadow-sm">
                   {product.brand}
                 </span>
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {galleryImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-brand-primary shadow-lg' : 'border-transparent hover:border-stone-300'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <p className="text-brand-primary font-semibold text-sm tracking-wider uppercase mb-2 flex items-center gap-2">
                {product.series} Series
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-brand-secondary mb-4 font-display leading-tight">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-stone-500 mb-6 pb-6 border-b border-stone-100">
                <span className="bg-stone-100 px-3 py-1 rounded-sm">SKU: {product.sku}</span>
                <span>Category: {product.category}</span>
              </div>
              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                {product.description}
              </p>
            </div>

            {/* Finishes */}
            <div className="mb-10">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-secondary mb-4">Select Finish</h3>
              <div className="flex flex-wrap gap-3">
                {product.finish.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFinish(f)}
                    className={`px-5 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${
                      selectedFinish === f 
                        ? 'bg-brand-secondary text-white border-brand-secondary shadow-md' 
                        : 'bg-white text-stone-600 border-stone-200 hover:border-brand-primary'
                    }`}
                  >
                    {selectedFinish === f && <Check size={16} />}
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* B2B Action Buttons */}
            <div className="flex flex-col gap-3 mb-12">
              <div className="flex gap-3">
                <a 
                  href={`https://wa.me/971501234567?text=Hi, I am inquiring about product SKU: ${product.sku} - ${product.name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-500/20"
                >
                  <MessageCircle size={18} /> WhatsApp Inquiry
                </a>
                <a 
                  href={`mailto:sales@azmgroup.ae?subject=Inquiry: ${product.name} (${product.sku})`}
                  className="flex-1 bg-brand-secondary hover:bg-brand-primary text-white py-4 rounded-xl font-semibold uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-brand-secondary/20"
                >
                  <Mail size={18} /> Email Quote
                </a>
              </div>
              <Link 
                to="/showrooms"
                className="w-full bg-white border border-stone-200 hover:border-brand-primary text-brand-secondary py-4 rounded-xl font-semibold uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <MapPin size={18} /> Book Showroom Visit
              </Link>
              <p className="text-center text-xs text-stone-400 mt-2">Trade pricing available upon request. Available in UAE stock.</p>
            </div>

            {/* Extra Info Accordions or Lists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-stone-100">
               <div>
                 <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-secondary mb-4">
                   <Settings size={16} className="text-brand-primary" /> Key Features
                 </h3>
                 <ul className="space-y-2">
                   {product.features.map((feature, i) => (
                     <li key={i} className="text-stone-600 text-sm flex items-start gap-2">
                       <span className="text-brand-primary mt-1">•</span> {feature}
                     </li>
                   ))}
                   <li className="text-stone-600 text-sm flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span> Dimensions: {product.dimensions}
                   </li>
                 </ul>
               </div>

               <div>
                 <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-secondary mb-4">
                   <FileDown size={16} className="text-brand-primary" /> Downloads
                 </h3>
                 <div className="flex flex-col gap-2">
                   {product.downloads.technicalDatasheet && (
                     <a href={product.downloads.technicalDatasheet} className="text-sm text-stone-600 hover:text-brand-primary flex items-center gap-2 group transition-colors">
                       <FileText size={16} className="text-stone-400 group-hover:text-brand-primary" /> Technical Datasheet
                     </a>
                   )}
                   {product.downloads.installationGuide && (
                     <a href={product.downloads.installationGuide} className="text-sm text-stone-600 hover:text-brand-primary flex items-center gap-2 group transition-colors">
                       <FileText size={16} className="text-stone-400 group-hover:text-brand-primary" /> Installation Guide
                     </a>
                   )}
                   {product.downloads.brochurePdf && (
                     <a href={product.downloads.brochurePdf} className="text-sm text-stone-600 hover:text-brand-primary flex items-center gap-2 group transition-colors">
                       <FileText size={16} className="text-stone-400 group-hover:text-brand-primary" /> Collection Brochure
                     </a>
                   )}
                 </div>
                 
                 <div className="mt-6 pt-6 border-t border-stone-100">
                    <p className="text-sm text-stone-600 flex items-center gap-2">
                      <span className="font-bold text-brand-secondary">Warranty:</span> {product.warrantyInformation}
                    </p>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="bg-stone-50 py-24 border-t border-stone-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-end mb-12">
             <div>
               <h2 className="text-3xl font-bold tracking-tight text-brand-secondary mb-2 font-display">Complete The Look</h2>
               <p className="text-stone-500">Related products from the {product.series} collection.</p>
             </div>
             <Link to="/products" className="hidden sm:flex text-sm font-semibold uppercase tracking-wider text-brand-primary items-center gap-2 group">
               View Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </Link>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {MOCK_PRODUCTS_DATABASE.slice(0, 4).map((related) => (
                <div key={related.sku} className="group bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square bg-stone-50 relative overflow-hidden p-6 flex items-center justify-center">
                    <img src={related.images[0]} alt={related.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <p className="text-brand-primary text-[10px] uppercase font-bold tracking-wider mb-2">{related.brand}</p>
                    <Link to={`/products/${related.sku}`} className="block">
                      <h4 className="text-base font-bold text-brand-secondary hover:text-brand-primary transition-colors line-clamp-2 mb-2">
                        {related.name}
                      </h4>
                    </Link>
                    <p className="text-xs font-mono text-stone-400">{related.sku}</p>
                  </div>
                </div>
             ))}
           </div>
        </div>
      </section>

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-12 overflow-hidden"
          >
            <button 
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-6 right-6 lg:top-10 lg:right-10 w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-brand-primary hover:text-white transition-colors z-[101]"
            >
              <X size={24} />
            </button>
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="relative max-w-5xl w-full max-h-full flex items-center justify-center"
            >
              <img 
                src={activeImage} 
                alt={product.name} 
                className="max-w-full max-h-[85vh] object-contain drop-shadow-2xl" 
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
