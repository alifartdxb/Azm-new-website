const fs = require('fs');
let content = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');

// Add InquiryModal import
content = content.replace(
  /import { OptimizedImage } from '\.\.\/components\/OptimizedImage';/,
  "import { OptimizedImage } from '../components/OptimizedImage';\nimport { InquiryModal } from '../components/InquiryModal';"
);

// Add modal state
content = content.replace(
  /const \[activeImage, setActiveImage\] = useState\(0\);/,
  "const [activeImage, setActiveImage] = useState(0);\n  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);"
);

// Update CTA Buttons section
const ctaSection = `{/* CTA Buttons */}
            <div className="flex flex-col gap-4 mb-12">
              <button onClick={() => setIsInquiryModalOpen(true)} className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-brand-secondary transition-colors shadow-lg hover:shadow-xl">
                Request a Quote <FileText size={18} />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => setIsInquiryModalOpen(true)} className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-green-600 transition-colors shadow-lg">
                  WhatsApp Inquiry <MessageSquare size={18} />
                </button>
                <a href="tel:+97142844452" className="w-full flex items-center justify-center gap-2 bg-stone-800 text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-stone-900 transition-colors shadow-lg">
                  Call Now <Phone size={18} />
                </a>
              </div>
              <button onClick={() => setIsInquiryModalOpen(true)} className="w-full flex items-center justify-center gap-2 bg-stone-100 text-stone-800 border border-stone-200 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors">
                  Email Inquiry <Mail size={18} />
              </button>
            </div>`;

content = content.replace(
  /{\/\* CTA Buttons \*\/}[\s\S]*?{\/\* Downloads \*\/}/,
  ctaSection + '\n\n            {/* Downloads */}'
);

// Add phone import if not exists
if (!content.includes('Phone')) {
    content = content.replace(/import { (.*?) } from 'lucide-react';/, "import { $1, Phone } from 'lucide-react';");
}


// Add modal component before closing div
content = content.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)$/,
  `          </div>
          </div>
        </div>
      </div>
      <InquiryModal 
        isOpen={isInquiryModalOpen} 
        onClose={() => setIsInquiryModalOpen(false)} 
        product={{
          name: product.name,
          sku: product.sku,
          brand: product.brand || '',
          category: product.category || ''
        }}
      />
    </div>
  )`
);

// Need a more robust regex for the end replacement
const endMatch = content.match(/<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*\);/);

if(endMatch) {
    content = content.replace(endMatch[0], 
        endMatch[0].replace(');', '') + `\n      <InquiryModal 
        isOpen={isInquiryModalOpen} 
        onClose={() => setIsInquiryModalOpen(false)} 
        product={{
          name: product.name,
          sku: product.sku,
          brand: product.brand || '',
          category: product.category || ''
        }}
      />\n    );`
    );
} else {
    // simpler replacement, add before final closing div and parenthesis
    content = content.replace(/(\n\s*<\/div>\n\s*\);)/, 
        `\n      <InquiryModal \n        isOpen={isInquiryModalOpen} \n        onClose={() => setIsInquiryModalOpen(false)} \n        product={{\n          name: product.name,\n          sku: product.sku,\n          brand: product.brand || '',\n          category: product.category || ''\n        }}\n      />$1`
    );
}

fs.writeFileSync('src/pages/ProductDetail.tsx', content);
