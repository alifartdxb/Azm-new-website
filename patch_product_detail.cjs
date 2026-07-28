const fs = require('fs');
let content = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');

if (!content.includes('import { getCollection }')) {
  content = content.replace(
    /import \{ getProductBySlug, BRANDS_DATA, CATEGORIES_DATA, getRelatedProducts \} from '\.\.\/data';/,
    `import { BRANDS_DATA, CATEGORIES_DATA } from '../data';\nimport { getCollection, getDocument } from '../services/db';`
  );
}

content = content.replace(
  /const product = getProductBySlug\(sku \|\| ''\);/,
  `const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!sku) return;
      try {
        // Find product by slug or sku
        const data = await getCollection('products');
        const found = data.find((p: any) => p.sku === sku || p.urlSlug === sku);
        setProduct(found || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [sku]);`
);

content = content.replace(
  /const relatedProducts = product \? getRelatedProducts\(product\.sku\) : \[\];/,
  `const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  
  useEffect(() => {
    async function loadRelated() {
      if (!product) return;
      try {
        const data = await getCollection('products');
        const related = data.filter((p: any) => p.status !== 'Draft' && p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
        setRelatedProducts(related);
      } catch (e) {
        console.error(e);
      }
    }
    loadRelated();
  }, [product]);`
);

content = content.replace(
  /if \(!product\) \{/,
  `if (loading) return <div className="py-24 text-center">Loading...</div>;
  if (!product) {`
);

content = content.replace(
  /import React, \{ useState, useEffect, useRef \} from 'react';/,
  `import React, { useState, useEffect, useRef } from 'react';`
);

// We need to fix images logic
content = content.replace(
  /const \[activeImage, setActiveImage\] = useState\(0\);/,
  `const imagesList = product?.images && product.images.length > 0 ? product.images : (product?.mainImage ? [product.mainImage] : ['https://placehold.co/400']);
  const [activeImage, setActiveImage] = useState(0);`
);

content = content.replace(
  /src=\{product\.images\[activeImage\]\}/g,
  `src={imagesList[activeImage]}`
);

content = content.replace(
  /product\.images\.map/g,
  `imagesList.map`
);

content = content.replace(
  /\{relatedProducts\.map\(\(relatedProduct, idx\) => \(/g,
  `{relatedProducts.map((relatedProduct: any, idx: number) => (`
);

content = content.replace(
  /src=\{relatedProduct\.images\[0\]\}/g,
  `src={relatedProduct.mainImage || relatedProduct.thumbnail || (relatedProduct.images && relatedProduct.images[0]) || 'https://placehold.co/400'}`
);

fs.writeFileSync('src/pages/ProductDetail.tsx', content);
