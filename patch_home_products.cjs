const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!content.includes('import { getCollection }')) {
  content = content.replace(
    /import \{ TestimonialCarousel \} from "\.\.\/components\/TestimonialCarousel";/,
    'import { TestimonialCarousel } from "../components/TestimonialCarousel";\nimport { getCollection } from "../services/db";'
  );
}

content = content.replace(
  /const \[currentSlide, setCurrentSlide\] = useState\(0\);/,
  `const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await getCollection('products');
        if (data && data.length > 0) {
          // Sort by newly created, active products
          const active = data.filter((p: any) => p.status !== 'Draft');
          const sorted = active.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setFeaturedProducts(sorted.slice(0, 4));
        } else {
          setFeaturedProducts(PRODUCTS_DATA.slice(0, 4));
        }
      } catch (e) {
        console.error(e);
        setFeaturedProducts(PRODUCTS_DATA.slice(0, 4));
      }
    }
    loadFeatured();
  }, []);`
);

content = content.replace(
  /\{PRODUCTS_DATA\.slice\(0, 4\)\.map\(\(product, idx\) => \(/,
  `{featuredProducts.map((product, idx) => (`
);

content = content.replace(
  /<OptimizedImage src=\{product\.images\[0\]\} alt=\{product\.name\}/g,
  `<OptimizedImage src={product.mainImage || product.thumbnail || (product.images && product.images[0]) || 'https://placehold.co/400'} alt={product.name}`
);

fs.writeFileSync('src/pages/Home.tsx', content);
