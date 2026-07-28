const fs = require('fs');

let content = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');

// We need to move these 3 lines:
// const [dbBrand, setDbBrand] = useState<any>(null);
// const [dbCategory, setDbCategory] = useState<any>(null);
// useEffect(() => { ... }, [product])
// Before the `if (loading) { return ... }`

// First, remove the `if (loading)` and `if (!product)` returns
content = content.replace(/if \(loading\) \{\s+return \(\s+<div className="flex-grow flex items-center justify-center min-h-\[50vh\]">\s+<div className="w-8 h-8 border-4 border-stone-200 border-t-brand-primary rounded-full animate-spin"><\/div>\s+<\/div>\s+\);\s+\}\s+if \(loading\) return <div className="py-24 text-center">Loading\.\.\.<\/div>;\s+if \(!product\) \{\s+return <NotFoundPage \/>;\s+\}/, "/* EARLY RETURNS MOVED DOWN */");

content = content.replace(/  const \[dbBrand, setDbBrand\] = useState<any>\(null\);\s+const \[dbCategory, setDbCategory\] = useState<any>\(null\);\s+useEffect\(\(\) => \{\s+async function loadBrandAndCat\(\) \{\s+if \(!product\) return;\s+try \{\s+if \(product\.brandId\) \{\s+const b = await getDocument\('brands', product\.brandId\);\s+if \(b\) setDbBrand\(b\);\s+\}\s+if \(product\.categoryId\) \{\s+const c = await getDocument\('categories', product\.categoryId\);\s+if \(c\) setDbCategory\(c\);\s+\}\s+\} catch \(e\) \{\s+console\.error\(e\);\s+\}\s+\}\s+loadBrandAndCat\(\);\s+\}, \[product\]\);/, function(match) {
  return match + "\n\n  if (loading) {\n    return (\n      <div className=\"flex-grow flex items-center justify-center min-h-[50vh]\">\n        <div className=\"w-8 h-8 border-4 border-stone-200 border-t-brand-primary rounded-full animate-spin\"></div>\n      </div>\n    );\n  }\n\n  if (!product) {\n    return <NotFoundPage />;\n  }\n";
});

// Since the `/* EARLY RETURNS MOVED DOWN */` was where it used to be, let's remove that.
content = content.replace(/\/\* EARLY RETURNS MOVED DOWN \*\//, "");

fs.writeFileSync('src/pages/ProductDetail.tsx', content);
