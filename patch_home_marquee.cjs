const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!content.includes('import { PartnerMarquee }')) {
  content = content.replace(
    /import \{ OptimizedImage \} from '\.\.\/components\/OptimizedImage';/,
    'import { OptimizedImage } from "../components/OptimizedImage";\nimport { PartnerMarquee } from "../components/PartnerMarquee";'
  );
}

const section2Regex = /\{\/\* 2\. Featured Brands \*\/\}\s*<section className="py-12 bg-white border-b border-stone-100">\s*<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">\s*<p className="text-center text-xs font-semibold uppercase tracking-widest text-stone-400 mb-8">Exclusive Partner Network<\/p>\s*<div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;

content = content.replace(section2Regex, '{/* 2. Featured Brands */}\n      <PartnerMarquee />');

fs.writeFileSync('src/pages/Home.tsx', content);
