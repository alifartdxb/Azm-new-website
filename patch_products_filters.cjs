const fs = require('fs');
let content = fs.readFileSync('src/pages/Products.tsx', 'utf8');

// Replace BRANDS_DATA and CATEGORIES_DATA usages in filters with dynamically derived ones
if (!content.includes('const availableBrands = ')) {
  content = content.replace(
    /const \[products, setProducts\] = useState<any\[\]>\(\[\]\);/,
    `const [products, setProducts] = useState<any[]>([]);
  const [dbBrands, setDbBrands] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);`
  );

  content = content.replace(
    /const data = await getCollection\('products'\) as any\[\];/,
    `const [data, bData, cData] = await Promise.all([
          getCollection('products'),
          getCollection('brands'),
          getCollection('categories')
        ]);
        setDbBrands(bData);
        setDbCategories(cData);`
  );

  content = content.replace(
    /<FilterSection title="Brands" options=\{BRANDS_DATA\.map\(b => \(\{id: b\.id, name: b\.name\}\)\)\} selected=\{selectedBrands\} toggle=\{\(val\) => toggleFilter\(selectedBrands, setSelectedBrands, val\)\} \/>/,
    `<FilterSection title="Brands" options={dbBrands.length > 0 ? dbBrands.map(b => ({id: b.id, name: b.name})) : BRANDS_DATA.map(b => ({id: b.id, name: b.name}))} selected={selectedBrands} toggle={(val) => toggleFilter(selectedBrands, setSelectedBrands, val)} />`
  );

  content = content.replace(
    /<FilterSection title="Categories" options=\{CATEGORIES_DATA\.map\(c => \(\{id: c\.id, name: c\.name\}\)\)\} selected=\{selectedCategories\} toggle=\{\(val\) => toggleFilter\(selectedCategories, setSelectedCategories, val\)\} \/>/,
    `<FilterSection title="Categories" options={dbCategories.length > 0 ? dbCategories.map(c => ({id: c.id, name: c.name})) : CATEGORIES_DATA.map(c => ({id: c.id, name: c.name}))} selected={selectedCategories} toggle={(val) => toggleFilter(selectedCategories, setSelectedCategories, val)} />`
  );

  content = content.replace(
    /const brand = BRANDS_DATA\.find\(b => b\.id === product\.brandId \|\| b\.name === product\.brand\);/g,
    `const brand = dbBrands.find((b:any) => b.id === product.brandId || b.name === product.brand) || BRANDS_DATA.find(b => b.id === product.brandId || b.name === product.brand);`
  );

  content = content.replace(
    /const category = CATEGORIES_DATA\.find\(c => c\.id === product\.categoryId \|\| c\.name === product\.category\);/g,
    `const category = dbCategories.find((c:any) => c.id === product.categoryId || c.name === product.category) || CATEGORIES_DATA.find(c => c.id === product.categoryId || c.name === product.category);`
  );

  fs.writeFileSync('src/pages/Products.tsx', content);
}
