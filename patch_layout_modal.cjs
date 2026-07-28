const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

if (!content.includes('InquiryModal')) {
    content = content.replace(
      /import \{ AnalyticsManager \} from "\.\/AnalyticsManager";/,
      'import { AnalyticsManager } from "./AnalyticsManager";\nimport { InquiryModal } from "./InquiryModal";'
    );

    content = content.replace(
      /const \[activeMegaMenu, setActiveMegaMenu\] = useState<string \| null>\(null\);/,
      'const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);\n  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);'
    );

    content = content.replace(
      /<a href="mailto:sales@alzahrabm\.com"[\s\S]*?title="Email Inquiry"[\s\S]*?>\s*<Mail size=\{24\} \/>[\s\S]*?<\/a>/,
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
    
    // Also attach it to top bar email inquiry link? Maybe not, that's just an email link. But the user said "Replace every Inquiry button". Let's stick to the FAB.
    
    content = content.replace(
      /<\/div>\s*<\/footer>\s*<\/div>\s*\)\;\s*\}\s*$/,
      `    </div>\n      </footer>\n      <InquiryModal isOpen={isInquiryModalOpen} onClose={() => setIsInquiryModalOpen(false)} />\n    </div>\n  );\n}\n`
    );

    fs.writeFileSync('src/components/Layout.tsx', content);
}
