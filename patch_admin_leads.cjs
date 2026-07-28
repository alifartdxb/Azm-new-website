const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminLeads.tsx', 'utf8');

// Rename title
content = content.replace(
  /<h1 className="text-2xl font-bold font-display text-brand-secondary">Leads Management<\/h1>/,
  '<h1 className="text-2xl font-bold font-display text-brand-secondary">Inquiries Management</h1>'
);

content = content.replace(
  /<p className="text-stone-500 text-sm">Manage incoming inquiries and contact requests\.<\/p>/,
  '<p className="text-stone-500 text-sm">Manage incoming product inquiries, quotes, and contact requests.</p>'
);

// Add Product and SKU to table header
content = content.replace(
  /<th className="px-6 py-4">Contact<\/th>/,
  '<th className="px-6 py-4">Contact</th>\n                    <th className="px-6 py-4">Product/SKU</th>'
);

// Add Product and SKU to table body
content = content.replace(
  /<td className="px-6 py-4 text-stone-600">\s*<div>{lead\.email}<\/div>\s*<div className="text-xs text-stone-400">{lead\.phone}<\/div>\s*<\/td>/,
  `<td className="px-6 py-4 text-stone-600">
                        <div>{lead.email}</div>
                        <div className="text-xs text-stone-400">{lead.phone}</div>
                        {lead.company && <div className="text-xs font-medium text-stone-500">{lead.company}</div>}
                      </td>
                      <td className="px-6 py-4 text-stone-600">
                        {lead.productName ? (
                           <>
                             <div className="font-bold text-stone-700 text-xs truncate max-w-[150px]">{lead.productName}</div>
                             <div className="text-[10px] text-stone-400 uppercase tracking-wider">{lead.sku}</div>
                           </>
                        ) : (
                           <span className="text-xs text-stone-400 italic">General Inquiry</span>
                        )}
                      </td>`
);

// Add more options to select
content = content.replace(
  /<option value="New">New<\/option>\s*<option value="Contacted">Contacted<\/option>\s*<option value="Closed">Closed<\/option>/,
  '<option value="New">New</option>\n                          <option value="In Progress">In Progress</option>\n                          <option value="Quotation Sent">Quotation Sent</option>\n                          <option value="Closed">Closed</option>\n                          <option value="Spam">Spam</option>'
);

// Adjust viewing details
content = content.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*\)\}\s*<\/div>\s*<\/div>\s*\);\s*\}\s*$/,
  `              {viewingLead.productName && (
                <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 mt-4">
                  <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-2">Product Inquiry Details</p>
                  <p className="font-medium text-stone-800 text-sm mb-1">{viewingLead.productName}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                    {viewingLead.sku && <div><span className="text-stone-400">SKU:</span> {viewingLead.sku}</div>}
                    {viewingLead.brand && <div><span className="text-stone-400">Brand:</span> {viewingLead.brand}</div>}
                    {viewingLead.quantity && <div><span className="text-stone-400">Qty:</span> {viewingLead.quantity}</div>}
                    {viewingLead.projectName && <div><span className="text-stone-400">Project:</span> {viewingLead.projectName}</div>}
                  </div>
                  {viewingLead.productUrl && (
                    <a href={viewingLead.productUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-primary hover:underline mt-2 inline-block">View Product Page</a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
`
);

// Add export function
content = content.replace(
  /<div className="flex justify-between items-center">\s*<div>/,
  `<div className="flex justify-between items-center flex-wrap gap-4">
        <div>`
);

content = content.replace(
  /<\/p>\s*<\/div>\s*<\/div>/,
  `</p>
        </div>
        <button onClick={() => {
          const headers = ['id', 'name', 'company', 'email', 'phone', 'productName', 'sku', 'status', 'createdAt', 'message'];
          const csv = [headers.join(','), ...leads.map(l => headers.map(h => \`"\${(l[h]||'').toString().replace(/"/g, '""')}"\`).join(','))].join('\\n');
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = \`inquiries-\${new Date().toISOString().split('T')[0]}.csv\`;
          a.click();
        }} className="px-4 py-2 bg-brand-primary text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-brand-secondary transition-colors">
          Export CSV
        </button>
      </div>`
);

// Collection Name Change from leads to inquiries
content = content.replace(
  /getCollection\('leads'\)/g,
  "getCollection('inquiries')"
);
content = content.replace(
  /deleteDocument\('leads',/g,
  "deleteDocument('inquiries',"
);
content = content.replace(
  /updateDocument\('leads',/g,
  "updateDocument('inquiries',"
);

fs.writeFileSync('src/pages/admin/AdminLeads.tsx', content);
