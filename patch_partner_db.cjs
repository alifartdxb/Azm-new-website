const fs = require('fs');
let content = fs.readFileSync('src/components/PartnerMarquee.tsx', 'utf8');

content = content.replace(
  /import \{ Link \} from 'react-router-dom';/,
  "import { Link } from 'react-router-dom';\nimport { useState, useEffect } from 'react';\nimport { getCollection } from '../services/db';"
);

content = content.replace(
  /const BRANDS = \[[\s\S]*?\];/,
  `const DEFAULT_BRANDS = [
  { name: 'VADO' }, { name: 'JAQUAR' }, { name: 'ITALIAN STANDARDS' }, { name: 'NOURK' },
  { name: 'SANIT' }, { name: 'SONET' }, { name: 'ROMAN' }, { name: 'KLUDI RAK' }
];`
);

content = content.replace(
  /export function PartnerMarquee\(\) \{/,
  `export function PartnerMarquee() {
  const [brands, setBrands] = useState<any[]>(DEFAULT_BRANDS);
  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await getCollection('brands');
        if (data && data.length > 0) {
          const featured = data.filter((b: any) => b.status !== 'Draft');
          if (featured.length > 0) setBrands(featured);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadBrands();
  }, []);`
);

content = content.replace(/const marqueeBrands = \[\.\.\.BRANDS, \.\.\.BRANDS\];/, 'const marqueeBrands = [...brands, ...brands, ...brands];');

fs.writeFileSync('src/components/PartnerMarquee.tsx', content);
