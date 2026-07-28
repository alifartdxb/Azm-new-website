const fs = require('fs');
let content = fs.readFileSync('src/pages/BrandDetail.tsx', 'utf8');

if (!content.includes('import { getCollection }')) {
  content = content.replace(
    /import \{ getBrandBySlug, getProductsByBrand, CATEGORIES_DATA \} from '\.\.\/data';/,
    `import { getBrandBySlug, CATEGORIES_DATA } from '../data';\nimport { getCollection } from '../services/db';`
  );
}

content = content.replace(
  /const allProducts = useMemo\(\(\) => brand \? getProductsByBrand\(brand\.id\) : \[\], \[brand\]\);/,
  `const [allProducts, setAllProducts] = useState<any[]>([]);
  
  useEffect(() => {
    async function fetchProducts() {
      if (!brand) return;
      try {
        const data = await getCollection('products');
        const active = data.filter((p: any) => p.status !== 'Draft' && p.brandId === brand.id);
        setAllProducts(active);
      } catch (e) {
        console.error(e);
      }
    }
    fetchProducts();
  }, [brand]);`
);

content = content.replace(
  /import React, \{ useState, useMemo \} from 'react';/,
  `import React, { useState, useMemo, useEffect } from 'react';`
);

content = content.replace(
  /\{filteredProducts\.map\(\(product\) => \(/g,
  `{filteredProducts.map((product: any) => (`
);

content = content.replace(
  /src=\{product\.images\[0\]\}/g,
  `src={product.mainImage || product.thumbnail || (product.images && product.images[0]) || 'https://placehold.co/400'}`
);

fs.writeFileSync('src/pages/BrandDetail.tsx', content);
