const fs = require('fs');
let content = fs.readFileSync('src/pages/Contact.tsx', 'utf8');

// Update WhatsApp Link
content = content.replace(
  /https:\/\/wa.me\/971501234567/g,
  'https://wa.me/971558090292'
);

// Update Phone Link
content = content.replace(
  /tel:\+97141234567/g,
  'tel:+97142844452'
);

// Update Address
content = content.replace(
  /AZM Group Headquarters<br\/>Dubai Design District<br\/>Building 3, Office 402<br\/>Dubai, UAE/g,
  'Al Zahra Al Malakia Bldg. Mat. Tr. LLC<br/>Shop 12<br/>Building Materials Mall<br/>Warsan-3, Dubai<br/>United Arab Emirates'
);

// Update Hours
content = content.replace(
  /Mon - Fri: 9:00 AM - 6:00 PM<br\/>Sat, Sun: Closed/g,
  'Monday - Sunday<br/>9:00 AM - 9:00 PM'
);

// Update Phone text
content = content.replace(
  /\+971 4 123 4567/g,
  '+971 4 28 444 52'
);

// Update Mobile text
content = content.replace(
  /\+971 50 123 4567/g,
  '+971 55 8090 292'
);

// Update Email text
content = content.replace(
  /projects@azmgroup\.ae/g,
  'sales@alzahrabm.com'
);

// Find Contact Details section
content = content.replace(
  /<p className="font-medium text-stone-900">\+971 4 123 4567<\/p>/g,
  '<p className="font-medium text-stone-900">+971 4 28 444 52</p>'
);

// Search for the map iframe and replace it
content = content.replace(
  /<iframe[\s\S]*?src="https:\/\/www\.google\.com\/maps\/embed\?pb=[^"]+"[\s\S]*?<\/iframe>/,
  '<iframe src="https://maps.google.com/maps?q=25.161985,55.461234&z=15&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full h-full object-cover rounded-xl filter contrast-100"></iframe>'
);

// Add email replacement for sales email
content = content.replace(
  /sales@azmgroup\.ae/g,
  'sales@alzahrabm.com'
);

// Add email replacement for generic email
content = content.replace(
  /info@azmgroup\.ae/g,
  'sales@alzahrabm.com'
);


fs.writeFileSync('src/pages/Contact.tsx', content);
