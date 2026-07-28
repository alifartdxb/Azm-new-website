const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Remove B2B Portal from top header
content = content.replace(
  /<div className="flex items-center gap-4">\s*<Link to="\/contact" className="hover:text-white transition-colors uppercase tracking-wider">B2B Trade Portal<\/Link>\s*<\/div>/g,
  ''
);

// Update Header Top Bar
content = content.replace(
  /<div className="flex items-center gap-6">[\s\S]*?<\/div>/g,
  `<div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a href="tel:+97142844452" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={14} /> Call Us: +971 4 28 444 52
            </a>
            <a href="https://wa.me/971558090292" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <MessageCircle size={14} /> WhatsApp: +971 55 8090 292
            </a>
            <a href="mailto:sales@alzahrabm.com" className="hidden sm:flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={14} /> sales@alzahrabm.com
            </a>
            <span className="hidden lg:flex items-center gap-2">
              Working Hours: Mon - Sun | 9:00 AM - 9:00 PM
            </span>
          </div>`
);

// Remove Projects from Navigation Array
content = content.replace(
  /\s*{\s*name:\s*"Projects"[\s\S]*?megaMenu:\s*"projects"\s*},/g,
  ''
);

// Remove Projects Mega Menu
content = content.replace(
  /{activeMegaMenu === 'projects' && \([\s\S]*?<\/div>\s*\)}\s*/g,
  ''
);

// Remove Projects from Quick Links
content = content.replace(
  /<li><Link to="\/projects" className="hover:text-white transition-colors">Our Projects<\/Link><\/li>\s*/g,
  ''
);

// Update Footer Contact Info
content = content.replace(
  /<span className="flex items-center gap-2"><MapPin size={16} className="text-brand-primary" \/> Dubai, United Arab Emirates<\/span>/g,
  '<span className="flex items-start gap-2"><MapPin size={16} className="text-brand-primary mt-1" /> <span>Shop 12<br/>Building Materials Mall<br/>Warsan-3, Dubai<br/>United Arab Emirates</span></span>'
);

content = content.replace(
  /<span className="flex items-center gap-2"><Phone size={16} className="text-brand-primary" \/> \+971 50 123 4567<\/span>/g,
  '<span className="flex items-center gap-2"><Phone size={16} className="text-brand-primary" /> +971 4 28 444 52</span>\n              <span className="flex items-center gap-2"><MessageCircle size={16} className="text-brand-primary" /> +971 55 8090 292</span>'
);

content = content.replace(
  /<span className="flex items-center gap-2"><Mail size={16} className="text-brand-primary" \/> sales@azmgroup\.ae<\/span>/g,
  '<span className="flex items-center gap-2"><Mail size={16} className="text-brand-primary" /> sales@alzahrabm.com</span>\n              <span className="flex items-center gap-2 text-xs mt-2 text-white/60">Business Hours: Mon - Sun | 9:00 AM - 9:00 PM</span>'
);

// Update Footer Description & Copyright
content = content.replace(
  /<p>&copy; {new Date\(\)\.getFullYear\(\)} AZM Group UAE\. All rights reserved\.<\/p>/g,
  '<p>&copy; {new Date().getFullYear()} Al Zahra Al Malakia Bldg. Mat. Tr. LLC. All Rights Reserved.</p>'
);

// Add Google Map Button to Footer under contact info
content = content.replace(
  /<span className="flex items-center gap-2 text-xs mt-2 text-white\/60">Business Hours: Mon - Sun \| 9:00 AM - 9:00 PM<\/span>/g,
  '<span className="flex items-center gap-2 text-xs mt-2 text-white/60">Business Hours: Mon - Sun | 9:00 AM - 9:00 PM</span>\n              <a href="https://www.google.com/maps?q=25.161985,55.461234" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-white px-4 py-2 mt-4 text-xs font-bold uppercase tracking-wider rounded transition-colors w-fit"><MapPin size={14} /> View on Google Maps</a>'
);

fs.writeFileSync('src/components/Layout.tsx', content);
