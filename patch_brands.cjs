const fs = require('fs');
let content = fs.readFileSync('src/pages/Brands.tsx', 'utf8');

if (!content.includes('import { getCollection }')) {
  content = content.replace(
    /import \{ BRANDS_DATA \} from '\.\.\/data';/,
    `import { BRANDS_DATA } from '../data';\nimport { getCollection } from '../services/db';`
  );
}

content = content.replace(
  /export function Brands\(\) \{/,
  `export function Brands() {
  const [brands, setBrands] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function loadBrands() {
      try {
        const data = await getCollection('brands');
        const active = data.filter((b: any) => b.status !== 'Draft');
        setBrands(active.length > 0 ? active : BRANDS_DATA);
      } catch (e) {
        setBrands(BRANDS_DATA);
      }
    }
    loadBrands();
  }, []);`
);

content = content.replace(
  /\{BRANDS_DATA\.map\(\(brand, idx\) => \(/,
  `{brands.map((brand, idx) => (`
);

fs.writeFileSync('src/pages/Brands.tsx', content);
