const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Replace Footer Location
content = content.replace(
  /<span className="flex items-center gap-2"><MapPin size=\{16\} className="text-brand-primary" \/> Dubai, United Arab Emirates<\/span>/g,
  '<span className="flex items-start gap-2"><MapPin size={16} className="text-brand-primary mt-1" /> <span>Shop 12<br/>Building Materials Mall<br/>Warsan-3, Dubai<br/>United Arab Emirates</span></span>'
);

// Replace Phone
content = content.replace(
  /<span className="flex items-center gap-2"><Phone size=\{16\} className="text-brand-primary" \/> \+971 50 123 4567<\/span>/g,
  '<span className="flex items-center gap-2"><Phone size={16} className="text-brand-primary" /> +971 4 28 444 52</span>\n              <span className="flex items-center gap-2"><MessageCircle size={16} className="text-brand-primary" /> +971 55 8090 292</span>'
);

// Replace Email
content = content.replace(
  /<span className="flex items-center gap-2"><Mail size=\{16\} className="text-brand-primary" \/> sales@azmgroup\.ae<\/span>/g,
  '<span className="flex items-center gap-2"><Mail size={16} className="text-brand-primary" /> sales@alzahrabm.com</span>\n              <span className="flex items-center gap-2 text-xs mt-2 text-white/60">Business Hours: Mon - Sun | 9:00 AM - 9:00 PM</span>\n              <a href="https://www.google.com/maps?q=25.161985,55.461234" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-white px-4 py-2 mt-4 text-xs font-bold uppercase tracking-wider rounded transition-colors w-fit"><MapPin size={14} /> View on Google Maps</a>'
);

// Copyright
content = content.replace(
  /<p>&copy; \{new Date\(\)\.getFullYear\(\)\} AZM Group UAE\. All rights reserved\.<\/p>/g,
  '<p>&copy; {new Date().getFullYear()} Al Zahra Al Malakia Bldg. Mat. Tr. LLC. All Rights Reserved.</p>'
);

// Add Inquiry Modal imports and state
content = content.replace(
  /import \{ AnalyticsManager \} from "\.\/AnalyticsManager";/,
  'import { AnalyticsManager } from "./AnalyticsManager";\nimport { InquiryModal } from "./InquiryModal";'
);
content = content.replace(
  /const \[activeMegaMenu, setActiveMegaMenu\] = useState<string \| null>\(null\);/,
  'const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);\n  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);'
);

// Replace floating Email button with Modal Trigger
content = content.replace(
  /<button\s+className="w-14 h-14 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform group relative"\s+title="Product Inquiry"\s*>\s*<Mail size=\{24\} \/>\s*<span className="absolute right-full mr-4 bg-stone-900 text-white px-3 py-1\.5 text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">\s*Email Inquiry\s*<\/span>\s*<\/button>/,
  `<button
          onClick={() => setIsInquiryModalOpen(true)}
          className="w-14 h-14 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform group relative"
          title="Product Inquiry"
        >
          <Mail size={24} />
          <span className="absolute right-full mr-4 bg-stone-900 text-white px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Request Inquiry
          </span>
        </button>`
);

// Replace floating WhatsApp button href
content = content.replace(
  /<button\s+className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform group relative"\s+title="WhatsApp Order"\s*>\s*<MessageCircle size=\{28\} \/>\s*<span className="absolute right-full mr-4 bg-stone-900 text-white px-3 py-1\.5 text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">\s*WhatsApp Order\s*<\/span>\s*<\/button>/,
  `<a href="https://wa.me/971558090292" target="_blank" rel="noopener noreferrer"
          className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform group relative"
          title="WhatsApp Order"
        >
          <MessageCircle size={28} />
          <span className="absolute right-full mr-4 bg-stone-900 text-white px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            WhatsApp Order
          </span>
        </a>`
);

// Add the modal component at the end
content = content.replace(
  /<\/div>\s*<\/footer>\s*<\/div>\s*\)\;\s*\}\s*$/,
  `      </div>\n      </footer>\n      <InquiryModal isOpen={isInquiryModalOpen} onClose={() => setIsInquiryModalOpen(false)} />\n    </div>\n  );\n}\n`
);

fs.writeFileSync('src/components/Layout.tsx', content);
