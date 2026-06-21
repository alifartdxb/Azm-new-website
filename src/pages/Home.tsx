import { Link } from "react-router-dom";
import { PRODUCTS_CATEGORIES, MOCK_PRODUCTS_DATABASE } from "../data";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Download, Droplet, CheckCircle, MapPin, Beaker, ShieldCheck, Mail, ArrowUpRight } from "lucide-react";
import { useRef } from "react";

export function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="bg-white overflow-hidden font-sans text-brand-dark">
      {/* 1. Hero Banner (Parallax) */}
      <section ref={heroRef} className="relative h-[90vh] bg-stone-900 flex items-center overflow-hidden">
        <motion.div 
          style={{ y: yBg }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity opacity-40 origin-top"
        ></motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary via-brand-secondary/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-block px-4 py-1.5 mb-8 border border-white/20 bg-black/10 backdrop-blur-md text-brand-primary text-xs font-semibold tracking-widest uppercase">
              Leading the UAE in Luxury Bathrooms
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8 font-display">
              Curated Excellence <br />
              <span className="text-brand-primary">For Your Spaces.</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/80 mb-10 font-light leading-relaxed max-w-xl">
              Elevating commercial and residential developments with premier British sanitaryware, architectural ceramics from Europe, and bespoke bathroom solutions.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link to="/products" className="bg-brand-primary text-white border border-brand-primary px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-transparent transition-colors flex items-center gap-2 group shadow-xl shadow-brand-primary/20">
                Explore The Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/vado-collection" className="bg-white/10 backdrop-blur border border-white/20 text-white px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-white hover:text-brand-secondary transition-colors shadow-xl shadow-black/10">
                DISCOVER VADO UK
              </Link>
            </div>
          </motion.div>
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

      {/* 3. Featured Categories - Masonry/Grid Glassmorphism Cards */}
      <section className="py-24 bg-stone-50">
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

      {/* 4. New Arrivals & 5. Trending Products */}
      <section className="py-24 bg-white border-y border-stone-100">
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
                     <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
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
                    <img src={proj.img} alt={proj.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
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

      {/* 8. Catalog Downloads & 10. Showroom CTA Hybrid */}
      <section className="py-20 bg-white">
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
                     <Link to="/showrooms" className="text-white border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center gap-2">
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
                     <img src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1000&auto=format&fit=crop" alt="Blog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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

    </div>
  );
}
