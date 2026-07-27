import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { SEO } from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';

export function Projects() {
  const projects = [
    {
      id: 1,
      slug: 'atlantis-the-royal',
      title: 'Atlantis The Royal',
      location: 'Palm Jumeirah, Dubai',
      description: 'Supplied premium VADO brassware and customized bespoke sanitary solutions for ultra-luxury residential and hospitality suites.',
      category: 'Hospitality',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      slug: 'emaar-beachfront',
      title: 'Emaar Beachfront Residences',
      location: 'Dubai Harbour',
      description: 'Comprehensive supply of modern European sanitaryware and kitchen sinks for high-end beachfront apartments.',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 3,
      slug: 'museum-of-the-future',
      title: 'Museum of the Future',
      location: 'Sheikh Zayed Road, Dubai',
      description: 'Provided specialized, sustainable touchless bathroom fixtures aligning with LEED Platinum requirements.',
      category: 'Commercial',
      image: 'https://images.unsplash.com/photo-1613143360404-20b1bcf034c4?q=80&w=800&auto=format&fit=crop'
    }
  ];

  return (
    <div className="flex-grow flex flex-col bg-white">
      <SEO 
        title="Our Projects | AZM Group UAE"
        description="Explore AZM Group's portfolio of prestigious residential, commercial, and hospitality projects across the UAE featuring our premium sanitary ware and building materials."
      />

      <div className="bg-stone-50 py-16 lg:py-24 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-brand-secondary mb-6">Prestigious Projects</h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Discover how AZM Group has elevated some of the most iconic architectural developments in the region with premium solutions.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Filters could go here */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <article key={project.id} className="flex flex-col group bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <Link to={`/projects/${project.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-stone-100">
                <OptimizedImage 
                  src={project.image} 
                  alt={project.title}
                  className="group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-secondary">
                  {project.category}
                </div>
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-4 font-semibold">
                  <MapPin size={14} className="text-brand-primary" /> {project.location}
                </div>
                <h2 className="text-xl font-bold text-brand-secondary mb-3 group-hover:text-brand-primary transition-colors">
                  <Link to={`/projects/${project.slug}`}>{project.title}</Link>
                </h2>
                <p className="text-stone-600 text-sm leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>
                <Link to={`/projects/${project.slug}`} className="mt-auto inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-primary hover:text-brand-secondary transition-colors">
                  View Project <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
