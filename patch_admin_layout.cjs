const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminLayout.tsx', 'utf8');

content = content.replace(
  /\{ name: 'Inquiries', icon: MessageSquare, path: '\/admin\/inquiries' \},/,
  `{ name: 'Inquiries', icon: MessageSquare, path: '/admin/inquiries' },
  { name: 'Testimonials', icon: MessageSquare, path: '/admin/testimonials' },`
);

fs.writeFileSync('src/pages/admin/AdminLayout.tsx', content);
