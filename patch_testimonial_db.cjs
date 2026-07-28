const fs = require('fs');
let content = fs.readFileSync('src/components/TestimonialCarousel.tsx', 'utf8');

// Add db import
content = content.replace(
  /import \{ Quote, Star, ChevronLeft, ChevronRight \} from 'lucide-react';/,
  "import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';\nimport { getCollection } from '../services/db';"
);

// Replace static testimonials with state
content = content.replace(
  /const TESTIMONIALS = \[\s*\{[\s\S]*?\}\s*\];/,
  `const DEFAULT_TESTIMONIALS = [
  { quote: "AZM Group has consistently delivered exceptional product quality and technical support for our luxury residential developments. Their understanding of high-end brassware is unmatched.", author: "Sarah Al Mansoori", role: "Principal Architect, Dubai", type: "Architects" },
  { quote: "The VADO collections supplied by AZM transformed our hotel's bathrooms into true sanctuaries. Flawless execution and reliable post-sales service.", author: "James Peterson", role: "Project Director, Hospitality Group", type: "Hotels" },
  { quote: "A reliable partner for large-scale commercial projects. Their ability to source premium European ceramics and deliver on tight timelines is highly commendable.", author: "Ahmed Tariq", role: "Lead Developer, Abu Dhabi", type: "Commercial Projects" }
];`
);

content = content.replace(
  /export function TestimonialCarousel\(\) \{/,
  `export function TestimonialCarousel() {\n  const [testimonials, setTestimonials] = useState<any[]>(DEFAULT_TESTIMONIALS);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    async function fetchTestimonials() {\n      try {\n        const data = await getCollection('testimonials');\n        if (data && data.length > 0) {\n          setTestimonials(data.filter((t: any) => t.status !== 'Draft'));\n        }\n      } catch (e) {\n        console.error("Failed to load testimonials", e);\n      } finally {\n        setLoading(false);\n      }\n    }\n    fetchTestimonials();\n  }, []);`
);

// Replace TESTIMONIALS with testimonials
content = content.replace(/TESTIMONIALS\.length/g, 'testimonials.length');
content = content.replace(/TESTIMONIALS\[/g, 'testimonials[');
content = content.replace(/TESTIMONIALS\.map/g, 'testimonials.map');

fs.writeFileSync('src/components/TestimonialCarousel.tsx', content);
