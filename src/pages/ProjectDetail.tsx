import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();

  // Mock data
  const project = {
    title: 'Atlantis The Royal',
    location: 'Palm Jumeirah, Dubai',
    category: 'Hospitality',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop',
    description: `
      <p class="mb-6">Atlantis The Royal is a breathtaking icon of modern architecture and luxury hospitality. As one of the most prestigious developments in the region, the project demanded only the finest materials and fixtures to complement its ultra-luxurious aesthetic.</p>
      <p class="mb-6">AZM Group was selected as a key supplier for this landmark project. Our team worked closely with the lead architects and interior designers to curate and deliver a bespoke selection of premium sanitary ware.</p>
    `,
    suppliedProducts: [
      'VADO UK Individual Collection Brassware',
      'Bespoke freestanding bathtubs',
      'Advanced concealed shower valves',
      'Custom-finished bathroom accessories'
    ]
  };

  return (
    <div className="flex-grow flex flex-col bg-white">
      <SEO 
        title={`${project.title} | Projects | AZM Group`}
        description={`Read about AZM Group's involvement in the ${project.title} project.`}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-stone-500 hover:text-brand-primary transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        <div className="mb-8">
          <div className="inline-block bg-stone-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-secondary mb-4">
            {project.category}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-brand-secondary mb-6 leading-tight">
            {project.title}
          </h1>
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-500">
            <MapPin size={16} className="text-brand-primary" /> {project.location}
          </div>
        </div>

        <div className="aspect-[21/9] bg-stone-100 rounded-2xl overflow-hidden mb-12 relative">
          <OptimizedImage 
            src={project.image} 
            alt={project.title}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold font-display text-brand-secondary mb-6">Project Overview</h3>
            <div 
              className="prose prose-stone prose-lg max-w-none prose-headings:font-display prose-headings:text-brand-secondary prose-a:text-brand-primary"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </div>
          
          <div className="bg-stone-50 rounded-2xl p-8 border border-stone-100 h-fit">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-secondary mb-6">Key Solutions Supplied</h4>
            <ul className="space-y-4">
              {project.suppliedProducts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-brand-primary flex-shrink-0 mt-0.5" />
                  <span className="text-stone-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-8 border-t border-stone-200">
              <Link to="/contact" className="block text-center w-full bg-brand-secondary text-white py-3 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-brand-primary transition-colors">
                Inquire for your project
              </Link>
            </div>
          </div>
        </div>

      </article>
    </div>
  );
}
