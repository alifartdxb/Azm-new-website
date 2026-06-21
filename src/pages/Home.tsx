import { Link } from "react-router-dom";
import { PRODUCTS_CATEGORIES, MOCK_PRODUCTS_DATABASE } from "../data";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ArrowRight, Download, Droplet, CheckCircle, MapPin, Beaker, ShieldCheck, Mail, ArrowUpRight, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { SEO } from "../components/SEO";
import { OptimizedImage } from "../components/OptimizedImage";

const HERO_SLIDES = [
  {
    title: "Curated Excellence",
    subtitle: "For Your Spaces.",
    description: "Elevating commercial and residential developments with premier British sanitaryware, architectural ceramics from Europe, and bespoke bathroom solutions.",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2069&auto=format&fit=crop",
    primaryAction: { label: "Explore The Collection", link: "/products" },
    secondaryAction: { label: "DISCOVER VADO UK", link: "/vado-collection" }
  },
  {
    title: "The VADO Touch",
    subtitle: "Uncompromising Quality.",
    description: "Experience the pinnacle of British brassware engineering. Superior finish, exceptional durability, and striking design.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2069&auto=format&fit=crop",
    primaryAction: { label: "View VADO Collection", link: "/vado-collection" },
    secondaryAction: { label: "Download Brochures", link: "/catalogues" }
  },
  {
    title: "Italian Elegance",
    subtitle: "Architectural Ceramics.",
    description: "Transform your surfaces with our exclusive range of Italian Standards porcelain slabs, tiles, and bespoke sanitaryware.",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2069&auto=format&fit=crop",
    primaryAction: { label: "Discover Ceramics", link: "/products" },
    secondaryAction: { label: "View Projects", link: "/projects" }
  }
];

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));

  return (
    <div className="bg-white overflow-hidden font-sans text-brand-dark">
      <SEO />
      {/* 1. Hero Banner (Slider) */}
      <section className="relative h-screen bg-stone-900 flex items-center overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 z-0 bg-cover bg-center mix-blend-luminosity opacity-50"
            style={{ backgroundImage: `url(${HERO_SLIDES[currentSlide].image})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-secondary via-brand-secondary/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <div className="inline-block px-4 py-1.5 mb-8 border border-white/20 bg-black/10 backdrop-blur-md text-brand-primary text-xs font-semibold tracking-widest uppercase">
                Leading the UAE in Luxury Bathrooms & Kitchens
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6 font-display">
                {HERO_SLIDES[currentSlide].title} <br />
                <span className="text-brand-primary">{HERO_SLIDES[currentSlide].subtitle}</span>
              </h1>
              <p className="text-lg text-white/80 mb-10 font-light leading-relaxed max-w-xl">
                {HERO_SLIDES[currentSlide].description}
              </p>
              <div className="flex flex-wrap gap-5">
                <Link to={HERO_SLIDES[currentSlide].primaryAction.link} className="bg-brand-primary text-white border border-brand-primary px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-transparent transition-colors flex items-center gap-2 group shadow-xl shadow-brand-primary/20">
                  {HERO_SLIDES[currentSlide].primaryAction.label} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to={HERO_SLIDES[currentSlide].secondaryAction.link} className="bg-white/10 backdrop-blur border border-white/20 text-white px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-white hover:text-brand-secondary transition-colors shadow-xl shadow-black/10">
                  {HERO_SLIDES[currentSlide].secondaryAction.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Controls */}
        <div className="absolute z-20 bottom-12 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex gap-3">
               {HERO_SLIDES.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 transition-all duration-300 rounded-full ${currentSlide === idx ? 'w-12 bg-brand-primary' : 'w-4 bg-white/30 hover:bg-white/60'}`}
                  />
               ))}
            </div>
            <div className="flex gap-4">
              <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-secondary transition-colors backdrop-blur-sm">
                 <ChevronLeft size={20} />
              </button>
              <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-secondary transition-colors backdrop-blur-sm">
                 <ChevronRight size={20} />
              </button>
            </div>
        </div>
      </section>

      {/* 2. Featured Brands */}
      <section className="py-12 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <p className="text-center text-xs font-semibold uppercase tracking-widest text-stone-400 mb-8">Exclusive Partner Network</p>
           <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
              {['VADO', 'BATHROOMS', 'CERAMICS', 'LIFESTYLE'].map((brand, i) => (
                 <div key={i} className="text-2xl lg:text-3xl font-display font-extrabold tracking-tighter text-brand-secondary">
                   {brand}
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* Featured VADO Collection */}
      <section className="py-24 bg-stone-50 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
             <div className="lg:w-1/2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px bg-brand-primary w-12"></div>
                  <span className="text-brand-primary text-xs font-bold uppercase tracking-widest">Brand Spotlight</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-brand-secondary mb-6 font-display">
                  VADO UK <br />
                  <span className="text-stone-400">Masterpieces.</span>
                </h2>
                <p className="text-lg text-stone-500 mb-8 leading-relaxed max-w-xl">
                  As the premier supplier of VADO in the UAE, AZM Group brings you unparalleled British engineering. 
                  Renowned for their flawless brushed finishes and sustainable H2Eco water technology, VADO collections 
                  define modern luxury.
                </p>
                <div className="flex flex-wrap gap-4 mb-10">
                   {['Individual', 'Omika', 'Kovera', 'Synergie'].map(collection => (
                     <span key={collection} className="px-4 py-2 border border-stone-200 rounded-full text-xs font-semibold uppercase text-stone-500 tracking-wider hover:border-brand-primary hover:text-brand-primary transition-colors cursor-pointer">
                        {collection}
                     </span>
                   ))}
                </div>
                <Link to="/vado-collection" className="inline-flex items-center gap-2 bg-brand-secondary text-white px-8 py-4 rounded-full font-semibold uppercase tracking-wider hover:bg-brand-primary transition-colors text-sm shadow-xl hover:shadow-2xl hover:-translate-y-1 transform">
                  Explore VADO <ArrowRight size={18} />
                </Link>
             </div>
             <div className="lg:w-1/2 relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden relative">
                   <OptimizedImage src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop" alt="VADO Collection" />
                   <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/80 to-transparent"></div>
                   <div className="absolute bottom-8 left-8 text-white">
                      <p className="text-xs font-bold uppercase tracking-widest mb-1 text-brand-primary">Featured Series</p>
                      <h3 className="text-3xl font-display font-bold">Individual by VADO</h3>
                   </div>
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-stone-100 rounded-full -z-10 blur-2xl"></div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories - Masonry/Grid Glassmorphism Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold tracking-tight text-brand-secondary mb-4 font-display">Collections</h2>
              <p className="text-stone-500 text-lg">Meticulously curated portfolios of premium brassware, ceramics, and architectural finishes tailored for A&D professionals.</p>
            </div>
            <Link to="/products" className="group flex items-center gap-2 text-sm font-semibold text-brand-primary uppercase tracking-wider">
               View All Categories <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[ 
               { cat: "Bathroom Faucets", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop", span: "lg:col-span-2 lg:row-span-2" },
               { cat: "Shower Systems", img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1000&auto=format&fit=crop", span: "" },
               { cat: "Wash Basins", img: "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=1000&auto=format&fit=crop", span: "" },
               { cat: "Bathtubs", img: "https://images.unsplash.com/photo-1507652313519-d4e9174296fc?q=80&w=1000&auto=format&fit=crop", span: "lg:col-span-2" }
            ].map((item, i) => (
              <Link 
                key={i} 
                to={`/products/${item.cat.toLowerCase().replace(/\s+/g, '-')}`}
                className={`relative group overflow-hidden rounded-2xl ${item.span} min-h-[300px]`}
              >
                <div className="absolute inset-0 bg-stone-200">
                  <img src={item.img} alt={item.cat} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                </div>
                {/* Glassmorphism gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/90 via-brand-secondary/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                   <div className="flex justify-between items-end">
                     <div>
                       <span className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-2 block">Category</span>
                       <h3 className="text-3xl font-bold text-white font-display mb-1">{item.cat}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                       <ArrowUpRight size={20} />
                     </div>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Kitchen Collection */}
      <section className="py-24 bg-white border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold tracking-tight text-brand-secondary mb-4 font-display">Kitchen Solutions</h2>
              <p className="text-stone-500 text-lg">Professional-grade kitchen mixers, sinks, and architectural slabs for modern culinary spaces.</p>
            </div>
            <Link to="/products" className="group flex items-center gap-2 text-sm font-semibold text-brand-primary uppercase tracking-wider">
               Explore Kitchen <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[ 
               { cat: "Kitchen Faucets", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop" },
               { cat: "Kitchen Sinks", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop" },
               { cat: "Worktops", img: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1000&auto=format&fit=crop" }
            ].map((item, i) => (
              <Link 
                key={i} 
                to="/products"
                className={`relative group overflow-hidden rounded-2xl min-h-[350px]`}
              >
                <div className="absolute inset-0 bg-stone-200">
                  <img src={item.img} alt={item.cat} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                </div>
                {/* Glassmorphism gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/90 via-brand-secondary/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                   <div className="flex justify-between items-end">
                     <div>
                       <span className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-2 block">Category</span>
                       <h3 className="text-3xl font-bold text-white font-display mb-1">{item.cat}</h3>
                     </div>
                     <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                       <ArrowUpRight size={20} />
                     </div>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trending Products */}
      <section className="py-24 bg-stone-50 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-bold tracking-tight text-brand-secondary mb-4 font-display">Signature Arrivals</h2>
              <p className="text-stone-500 text-lg">The latest innovations in bathroom architecture and water delivery systems, favored by the region's elite interior designers.</p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {MOCK_PRODUCTS_DATABASE.slice(0, 4).concat(MOCK_PRODUCTS_DATABASE[0]).slice(0, 4).map((product, idx) => (
                <div key={`${product.sku}-${idx}`} className="group relative bg-stone-50 rounded-2xl border border-stone-100 p-6 hover:shadow-2xl hover:shadow-brand-secondary/5 transition-all duration-300">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-brand-primary text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">{product.series}</span>
                  </div>
                  <div className="aspect-square bg-white rounded-xl mb-6 relative overflow-hidden flex items-center justify-center p-0">
                     <OptimizedImage src={product.images[0]} alt={product.name} className="mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute inset-0 bg-brand-secondary/0 group-hover:bg-brand-secondary/5 transition-colors duration-300"></div>
                  </div>
                  <div>
                    <p className="text-brand-primary text-xs font-semibold uppercase tracking-wider mb-2">{product.brand}</p>
                    <h4 className="text-lg font-bold text-brand-secondary mb-2 line-clamp-1" title={product.name}>{product.name}</h4>
                    <p className="text-sm text-stone-500 line-clamp-2 mb-4">{product.description}</p>
                    <Link to={`/products/${product.sku}`} className="text-sm font-semibold text-brand-secondary flex items-center gap-1 group-hover:text-brand-primary transition-colors">
                      View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
             ))}
           </div>
        </div>
      </section>

      {/* 6. Projects */}
      <section className="py-24 bg-brand-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/10 blur-3xl rounded-full transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold tracking-tight mb-4 font-display">Featured Projects</h2>
              <p className="text-white/60 text-lg">AZM Group's premium portfolio across the iconic skylines of the United Arab Emirates.</p>
            </div>
            <Link to="/projects" className="group flex items-center gap-2 text-sm font-semibold text-brand-primary uppercase tracking-wider">
               View All Projects <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {[
               { name: "Luxury Hotel Resort, Palm Jumeirah", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop" },
               { name: "Premium Residential Villa, Emirates Hills", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop" }
             ].map((proj, i) => (
                <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-video cursor-pointer">
                  <div className="absolute inset-0 bg-stone-900">
                    <OptimizedImage src={proj.img} alt={proj.name} className="group-hover:scale-105 transition-transform duration-700 opacity-80" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary via-brand-secondary/20 to-transparent opacity-90"></div>
                  <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-end">
                     <div>
                       <div className="flex items-center gap-2 text-brand-primary mb-3">
                         <MapPin size={16} /> <span className="text-sm font-medium uppercase tracking-wider">Dubai, UAE</span>
                       </div>
                       <h3 className="text-2xl font-bold text-white font-display mb-2">{proj.name}</h3>
                       <p className="text-white/60 text-sm">Supplied: VADO Faucets, Showers, Architectural Tiles</p>
                     </div>
                     <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-white transform group-hover:bg-white group-hover:text-brand-secondary transition-colors">
                       <ArrowRight size={20} className="-rotate-45" />
                     </div>
                  </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 7. Why AZM Group */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-bold tracking-tight text-brand-secondary mb-4 font-display">The AZM Standard</h2>
              <p className="text-stone-500 text-lg">Why leading contractors, architects, and designers choose us as their supply partner.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             <div className="bg-white p-10 rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/50 hover:-translate-y-2 transition-transform duration-300">
               <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-6">
                 <ShieldCheck size={32} />
               </div>
               <h3 className="text-xl font-bold text-brand-secondary mb-3 font-display">12-Year Guarantee</h3>
               <p className="text-stone-500 leading-relaxed">Most of our core products come with an industry-leading warranty, ensuring peace of mind for premium developments.</p>
             </div>
             <div className="bg-white p-10 rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/50 hover:-translate-y-2 transition-transform duration-300">
               <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-6">
                 <CheckCircle size={32} />
               </div>
               <h3 className="text-xl font-bold text-brand-secondary mb-3 font-display">European Provenance</h3>
               <p className="text-stone-500 leading-relaxed">We source exclusively from top-tier British and European manufacturers renowned for engineering excellence.</p>
             </div>
             <div className="bg-white p-10 rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/50 hover:-translate-y-2 transition-transform duration-300">
               <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-6">
                 <Droplet size={32} />
               </div>
               <h3 className="text-xl font-bold text-brand-secondary mb-3 font-display">Sustainable Flows</h3>
               <p className="text-stone-500 leading-relaxed">Featuring advanced H2Eco technology that drastically reduces water consumption without compromising performance.</p>
             </div>
           </div>
        </div>
      </section>

      {/* 11. Testimonials */}
      <section className="py-24 bg-brand-secondary text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4 font-display">Client Endorsements</h2>
              <p className="text-white/60 text-lg">Trusted by the most prestigious architectural practices in the Middle East.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               { quote: "AZM Group has consistently delivered exceptional product quality and technical support for our luxury residential developments. Their understanding of high-end brassware is unmatched.", author: "Sarah Al Mansoori", role: "Principal Architect, Dubai" },
               { quote: "The VADO collections supplied by AZM transformed our hotel's bathrooms into true sanctuaries. Flawless execution and reliable post-sales service.", author: "James Peterson", role: "Project Director, Hospitality Group" },
               { quote: "A reliable partner for large-scale commercial projects. Their ability to source premium European ceramics and deliver on tight timelines is highly commendable.", author: "Ahmed Tariq", role: "Lead Developer, Abu Dhabi" }
             ].map((t, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-10 rounded-2xl backdrop-blur-sm relative">
                  <Quote size={40} className="text-brand-primary/20 absolute top-8 right-8" />
                  <p className="text-lg text-white/90 leading-relaxed mb-8 italic">"{t.quote}"</p>
                  <div>
                     <h4 className="font-bold text-white uppercase tracking-wider">{t.author}</h4>
                     <p className="text-brand-primary text-xs font-semibold uppercase">{t.role}</p>
                  </div>
                </div>
             ))}
           </div>
        </div>
      </section>

      {/* 8. Catalog Downloads & 10. Showroom CTA Hybrid */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-brand-secondary rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
              <div className="p-12 lg:p-20 lg:w-1/2 flex flex-col justify-center relative">
                 <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                 <div className="relative z-10 text-white">
                   <h2 className="text-4xl font-bold mb-6 font-display">Specify With Confidence</h2>
                   <p className="text-white/80 text-lg mb-10 leading-relaxed">
                     Download our comprehensive technical catalogues containing specifications, flow rates, dimensions, and finishing options for your architectural proposals.
                   </p>
                   <div className="flex flex-wrap gap-4">
                     <Link to="/catalogues" className="bg-brand-primary text-white border border-brand-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-transparent transition-colors shadow-lg flex items-center gap-2">
                       <Download size={18} /> VADO Complete 2026
                     </Link>
                     <Link to="/contact" className="text-white border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center gap-2">
                       <MapPin size={18} /> Visit Design Studio
                     </Link>
                   </div>
                 </div>
              </div>
              <div className="lg:w-1/2 bg-stone-100 relative min-h-[300px]">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
              </div>
           </div>
        </div>
      </section>

      {/* 9. Blog Articles / Design Insights */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold tracking-tight text-brand-secondary mb-4 font-display">Design Intelligence</h2>
              <p className="text-stone-500 text-lg">Industry trends, technological releases, and portfolio highlights.</p>
            </div>
            <Link to="/news" className="group flex items-center gap-2 text-sm font-semibold text-brand-primary uppercase tracking-wider">
               Read Journal <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group cursor-pointer">
                 <div className="aspect-video rounded-2xl overflow-hidden mb-6 relative">
                   <div className="absolute inset-0 bg-stone-200">
                     <OptimizedImage src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1000&auto=format&fit=crop" alt="Blog" className="group-hover:scale-105 transition-transform duration-700" />
                   </div>
                 </div>
                 <div className="flex gap-4 items-center mb-3">
                   <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">News</span>
                   <span className="text-xs font-semibold text-stone-400">June 2026</span>
                 </div>
                 <h3 className="text-xl font-bold text-brand-secondary mb-3 font-display group-hover:text-brand-primary transition-colors">The Rise of Architectural Brushed Brass in Hospitality</h3>
                 <p className="text-stone-500 line-clamp-2">Exploring why elite Dubai hotel developers are shifting towards warmer metallic tones.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Pre-footer CTA */}
      <section className="py-32 relative bg-brand-secondary text-white border-t border-white/10 overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-brand-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold font-display tracking-tight mb-8">Ready to Elevate Your Next Project?</h2>
            <p className="text-xl text-white/70 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
              Connect with our dedicated B2B specialists to discuss Bespoke quotations, technical specifications, and procurement schedules.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/contact" className="w-full sm:w-auto bg-brand-primary border border-brand-primary text-white px-8 py-4 rounded-full font-semibold uppercase tracking-wider hover:bg-transparent transition-colors text-sm flex items-center justify-center gap-2">
                <Mail size={18} /> Request Quotation
              </Link>
              <a href="https://wa.me/971501234567" target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-transparent border border-white/30 text-white px-8 py-4 rounded-full font-semibold uppercase tracking-wider hover:bg-white hover:text-brand-secondary transition-colors text-sm flex items-center justify-center gap-2">
                 WhatsApp Inquiry
              </a>
            </div>
         </div>
      </section>

    </div>
  );
}
