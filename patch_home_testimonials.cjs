const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!content.includes('import { TestimonialCarousel }')) {
  content = content.replace(
    /import \{ PartnerMarquee \} from "\.\.\/components\/PartnerMarquee";/,
    'import { PartnerMarquee } from "../components/PartnerMarquee";\nimport { TestimonialCarousel } from "../components/TestimonialCarousel";'
  );
}

const testimonialRegex = /\{\/\* 11\. Testimonials \*\/\}[\s\S]*?<\/section>/;

content = content.replace(testimonialRegex, '{/* 11. Testimonials */}\n      <TestimonialCarousel />');

fs.writeFileSync('src/pages/Home.tsx', content);
