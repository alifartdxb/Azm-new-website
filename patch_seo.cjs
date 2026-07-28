const fs = require('fs');
let content = fs.readFileSync('src/components/SEO.tsx', 'utf8');

// Title
content = content.replace(
  /AZM Group \| Luxury Bathroom & Kitchen Solutions UAE/,
  'Al Zahra Al Malakia Bldg. Mat. Tr. LLC | Luxury Bathroom Solutions UAE'
);

// Description
content = content.replace(
  /AZM Group is the leading supplier of luxury bathroom solutions, sanitary ware, and VADO UK products in Dubai and the UAE\./,
  'Al Zahra Al Malakia Bldg. Mat. Tr. LLC is the leading supplier of luxury bathroom solutions, sanitary ware, and VADO UK products in Dubai and the UAE.'
);

// Site URL
content = content.replace(
  /https:\/\/www\.azmgroup\.ae/g,
  'https://www.alzahrabm.com'
);

// Default Schema
content = content.replace(
  /"name": "AZM Group",/g,
  '"name": "Al Zahra Al Malakia Bldg. Mat. Tr. LLC",'
);
content = content.replace(
  /Leading B2B supplier of luxury sanitaryware and bathroom solutions in the UAE\./,
  'Leading B2B supplier of luxury sanitaryware, building materials, and bathroom solutions in the UAE.'
);
content = content.replace(
  /AZM Group/g,
  'Al Zahra Al Malakia'
);

// Phone
content = content.replace(
  /\+971-4-123-4567/,
  '+971-4-28-444-52'
);

fs.writeFileSync('src/components/SEO.tsx', content);
