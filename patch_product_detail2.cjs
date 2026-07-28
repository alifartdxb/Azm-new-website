const fs = require('fs');

let content = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');

// Insert after `}, [product]);`
content = content.replace(/  }, \[product\]\);/, function(match) {
  return match + "\n\n  if (loading) {\n    return (\n      <div className=\"flex-grow flex items-center justify-center min-h-[50vh]\">\n        <div className=\"w-8 h-8 border-4 border-stone-200 border-t-brand-primary rounded-full animate-spin\"></div>\n      </div>\n    );\n  }\n\n  if (!product) {\n    return <NotFoundPage />;\n  }\n";
});

fs.writeFileSync('src/pages/ProductDetail.tsx', content);
