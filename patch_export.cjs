const fs = require('fs');
const content = fs.readFileSync('src/pages/admin/products/ProductList.tsx', 'utf8');

const exportFn = `
  const handleExport = () => {
    if (products.length === 0) return alert('No products to export');
    
    // Simple CSV export
    const headers = ['id', 'sku', 'name', 'brand', 'category', 'status', 'finish'];
    const csvContent = [
      headers.join(','),
      ...products.map(p => headers.map(h => \`"\${(p[h] || '').toString().replace(/"/g, '""')}"\`).join(','))
    ].join('\\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', \`products-export-\${new Date().toISOString().split('T')[0]}.csv\`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
`;

const updatedContent = content.replace('const handleBulkDelete = async () => {', exportFn + '\n  const handleBulkDelete = async () => {');
fs.writeFileSync('src/pages/admin/products/ProductList.tsx', updatedContent);
