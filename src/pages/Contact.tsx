import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, MessageCircle, Clock, ArrowRight, Building, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SEO } from "../components/SEO";

export function Contact() {
  const [activeTab, setActiveTab] = useState<"general" | "quote" | "project" | "showroom">("general");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      // reset logic here in real app
    }, 5000);
  };

  const formTabs = [
    { id: "general", label: "Contact Form" },
    { id: "quote", label: "Request Quotation" },
    { id: "project", label: "Project Inquiry" },
    { id: "showroom", label: "Book Appointment" }
  ] as const;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do you keep stock locally in the UAE?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we maintain a comprehensive inventory of core products, particularly VADO UK lines, in our Dubai logistics center to support rapid project deployment schedules."
        }
      },
      {
        "@type": "Question",
        "name": "What warranties are available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most of our products, such as VADO brassware, carry a standard 12-year manufacturer guarantee covering manufacturing defects, ensuring long-term reliability for your projects."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer bespoke or trade pricing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We provide dedicated pricing structures, technical specifications, and procurement schedules for B2B professionals, interior designers, and volume contractors."
        }
      },
      {
        "@type": "Question",
        "name": "Do you assist with product specifications?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our architectural sales team assists with plumbing schematics, WRAS compliance, and flow rate calculations to ensure the products meet local building and green building codes."
        }
      }
    ]
  };

  return (
    <div className="flex-grow flex flex-col bg-white font-sans">
      <SEO 
        title="Contact AZM Group | Request Quotation & Project Inquiry"
        description="Get in touch with AZM Group's specialized B2B team for bespoke quotations, technical assistance, product specifications, or to book a showroom appointment."
        schemas={[faqSchema]}
      />
      {/* Header */}
      <div className="bg-stone-50 py-16 lg:py-24 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-brand-secondary mb-6">Let's Discuss Your Project</h1>
            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
              Whether you're looking for a bespoke quotation, need technical assistance, or want to explore our collections in person, our specialized B2B team is here to assist you.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a href="https://wa.me/971501234567" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold uppercase tracking-wider text-sm hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">
                <MessageCircle size={18} /> WhatsApp Us
              </a>
              <a href="tel:+97141234567" className="flex items-center gap-2 bg-white text-brand-secondary border border-stone-200 px-6 py-3 rounded-full font-semibold uppercase tracking-wider text-sm hover:border-brand-primary transition-colors">
                <Phone size={18} /> Call Now
              </a>
              <a href="/catalogues" className="flex items-center gap-2 bg-brand-secondary text-white px-6 py-3 rounded-full font-semibold uppercase tracking-wider text-sm hover:bg-brand-primary transition-colors">
                <ArrowRight size={18} /> Download Catalog
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            <div>
               <h3 className="text-sm font-bold uppercase tracking-wider text-brand-secondary mb-6 flex items-center gap-2">
                 <Building size={18} className="text-brand-primary" /> Corporate Office
               </h3>
               <div className="flex items-start gap-4 text-stone-600 mb-4">
                 <MapPin size={20} className="flex-shrink-0 mt-1 text-stone-400" />
                 <p className="leading-relaxed">AZM Group Headquarters<br/>Dubai Design District<br/>Building 3, Office 402<br/>Dubai, UAE</p>
               </div>
               <div className="flex items-center gap-4 text-stone-600 mb-4">
                 <Clock size={20} className="flex-shrink-0 text-stone-400" />
                 <p>Mon - Fri: 9:00 AM - 6:00 PM<br/>Sat, Sun: Closed</p>
               </div>
            </div>

            <div className="pt-10 border-t border-stone-200">
               <h3 className="text-sm font-bold uppercase tracking-wider text-brand-secondary mb-6 flex items-center gap-2">
                 <MapPin size={18} className="text-brand-primary" /> Flagship Showroom
               </h3>
               <div className="flex items-start gap-4 text-stone-600 mb-4">
                 <MapPin size={20} className="flex-shrink-0 mt-1 text-stone-400" />
                 <p className="leading-relaxed">AZM Architectural Experience<br/>Sheikh Zayed Road<br/>Near Oasis Mall<br/>Dubai, UAE</p>
               </div>
               <div className="flex items-center gap-4 text-stone-600 mb-4">
                 <Clock size={20} className="flex-shrink-0 text-stone-400" />
                 <p>Mon - Sat: 10:00 AM - 8:00 PM<br/>Sun: 12:00 PM - 6:00 PM</p>
               </div>
            </div>

            <div className="pt-10 border-t border-stone-200">
               <h3 className="text-sm font-bold uppercase tracking-wider text-brand-secondary mb-6 flex items-center gap-2">
                 <Mail size={18} className="text-brand-primary" /> Direct Contacts
               </h3>
               <div className="flex flex-col gap-4">
                 <a href="mailto:sales@azmgroup.ae" className="text-stone-600 hover:text-brand-primary transition-colors flex items-center gap-3">
                   <Mail size={18} className="text-stone-400" /> sales@azmgroup.ae
                 </a>
                 <a href="mailto:projects@azmgroup.ae" className="text-stone-600 hover:text-brand-primary transition-colors flex items-center gap-3">
                   <Mail size={18} className="text-stone-400" /> projects@azmgroup.ae
                 </a>
                 <a href="mailto:support@azmgroup.ae" className="text-stone-600 hover:text-brand-primary transition-colors flex items-center gap-3">
                   <Mail size={18} className="text-stone-400" /> support@azmgroup.ae
                 </a>
               </div>
            </div>
            
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-8">
             <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
                
                {/* Form Navigation */}
                <div className="flex overflow-x-auto border-b border-stone-100 hide-scrollbar bg-stone-50">
                  {formTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`whitespace-nowrap flex-1 py-5 px-6 text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 ${
                        activeTab === tab.id 
                          ? 'border-brand-primary text-brand-primary bg-white' 
                          : 'border-transparent text-stone-500 hover:text-brand-secondary hover:bg-stone-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-8 md:p-12">
                   <AnimatePresence mode="wait">
                     {isSubmitted ? (
                        <motion.div 
                          key="success"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex flex-col items-center justify-center py-20 text-center"
                        >
                          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6">
                            <CheckCircle2 size={40} />
                          </div>
                          <h3 className="text-2xl font-bold text-brand-secondary mb-2 font-display">Inquiry Received</h3>
                          <p className="text-stone-500 max-w-sm">
                            Thank you for reaching out. A specialist from our B2B team will contact you shortly.
                          </p>
                        </motion.div>
                     ) : (
                       <motion.form
                         key={`form-${activeTab}`}
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: -20 }}
                         transition={{ duration: 0.3 }}
                         onSubmit={handleSubmit}
                         className="flex flex-col gap-6"
                       >
                          {/* Common Fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                               <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">First Name *</label>
                               <input required type="text" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-colors" />
                            </div>
                            <div>
                               <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Last Name *</label>
                               <input required type="text" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-colors" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                               <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Company Name</label>
                               <input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-colors" />
                            </div>
                            <div>
                               <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Profession/Role</label>
                               <select className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-colors text-stone-700">
                                 <option value="">Select an option</option>
                                 <option value="architect">Architect / Interior Designer</option>
                                 <option value="contractor">Contractor / Builder</option>
                                 <option value="developer">Real Estate Developer</option>
                                 <option value="distributor">Distributor / Retailer</option>
                                 <option value="homeowner">Homeowner</option>
                               </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                               <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Email Address *</label>
                               <input required type="email" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-colors" />
                            </div>
                            <div>
                               <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Phone / WhatsApp *</label>
                               <input required type="tel" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-colors" />
                            </div>
                          </div>

                          {/* Dynamic Fields based on Active Tab */}
                          {activeTab === 'quote' && (
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">SKUs or Products of Interest</label>
                              <input placeholder="e.g. VADO-IND-100" type="text" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-colors" />
                            </div>
                          )}

                          {activeTab === 'project' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                 <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Project Type</label>
                                 <select className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-colors text-stone-700">
                                   <option value="residential">Residential</option>
                                   <option value="commercial">Commercial Office</option>
                                   <option value="hospitality">Hospitality / Hotel</option>
                                   <option value="healthcare">Healthcare</option>
                                   <option value="other">Other</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Estimated Timeline</label>
                                 <select className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-colors text-stone-700">
                                   <option value="immediate">Immediate</option>
                                   <option value="1-3-months">1-3 Months</option>
                                   <option value="3-6-months">3-6 Months</option>
                                   <option value="6plus-months">6+ Months</option>
                                 </select>
                              </div>
                            </div>
                          )}

                          {activeTab === 'showroom' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                 <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Preferred Date</label>
                                 <input type="date" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-colors text-stone-700" />
                              </div>
                              <div>
                                 <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Preferred Time</label>
                                 <select className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-colors text-stone-700">
                                   <option value="morning">Morning (10AM - 1PM)</option>
                                   <option value="afternoon">Afternoon (1PM - 5PM)</option>
                                   <option value="evening">Evening (5PM - 8PM)</option>
                                 </select>
                              </div>
                            </div>
                          )}

                          <div>
                             <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Message or Additional Details</label>
                             <textarea rows={4} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-colors resize-none"></textarea>
                          </div>

                          <button type="submit" className="mt-4 bg-brand-secondary text-white py-4 px-8 rounded-full font-bold uppercase tracking-wider hover:bg-brand-primary transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            {activeTab === 'general' && 'Send Message'}
                            {activeTab === 'quote' && 'Request Quotation'}
                            {activeTab === 'project' && 'Submit Project Details'}
                            {activeTab === 'showroom' && 'Confirm Appointment'}
                          </button>
                          
                          <p className="text-[10px] text-stone-400 text-center uppercase tracking-wider mt-2">All data is processed securely through our CRM.</p>
                       </motion.form>
                     )}
                   </AnimatePresence>
                </div>
             </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-24 pt-24 border-t border-stone-200">
           <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-brand-secondary mb-4 font-display">Frequently Asked Questions</h2>
              <p className="text-stone-500 text-lg">Common inquiries from architects, contractors, and design professionals.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto text-left">
              <div>
                <h4 className="text-lg font-bold text-brand-secondary mb-2">Do you keep stock locally in the UAE?</h4>
                <p className="text-stone-600">Yes, we maintain a comprehensive inventory of core products, particularly VADO UK lines, in our Dubai logistics center to support rapid project deployment schedules.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-brand-secondary mb-2">What warranties are available?</h4>
                <p className="text-stone-600">Most of our products, such as VADO brassware, carry a standard 12-year manufacturer guarantee covering manufacturing defects, ensuring long-term reliability for your projects.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-brand-secondary mb-2">Do you offer bespoke or trade pricing?</h4>
                <p className="text-stone-600">Absolutely. We provide dedicated pricing structures, technical specifications, and procurement schedules for B2B professionals, interior designers, and volume contractors.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-brand-secondary mb-2">Do you assist with product specifications?</h4>
                <p className="text-stone-600">Yes. Our architectural sales team assists with plumbing schematics, WRAS compliance, and flow rate calculations to ensure the products meet local building and green building codes.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
