import { ProductCatalog } from './types';

export const PRODUCTS_CATEGORIES = [
  "Bathroom Faucets",
  "Shower Systems",
  "Mixers",
  "Accessories",
  "Wash Basins",
  "Toilets",
  "Bathtubs",
  "Vanity Units",
  "Kitchen Taps",
  "Kitchen Sinks",
  "Mirrors",
  "Concealed Systems",
  "Flush Plates",
  "Thermostatic Controls",
  "Tiles",
  "Slabs"
];

export const BRANDS = [
  "VADO",
  "JAQUAR",
  "ITALIAN STANDARDS",
  "NOURK",
  "SANIT",
  "SONET"
];

export const MOCK_PRODUCTS_DATABASE: ProductCatalog[] = [
  {
    sku: "VADO-IND-100",
    name: "Individual Brushed Gold Basin Mixer",
    brand: "VADO",
    category: "Bathroom Faucets",
    series: "Individual",
    collectionName: "Individual Elements",
    installationType: ["Deck Mounted"],
    color: ["Gold", "Black", "Silver"],
    application: ["Residential", "Commercial"],
    description: "Premium single lever basin mixer with an elegant knurled detail, finished in brushed gold.",
    features: [
      "H2Eco Technology",
      "Ceramic Cartridge",
      "Knurled Accent"
    ],
    finish: ["Brushed Gold", "Brushed Black", "Chrome", "Brushed Nickel"],
    dimensions: "160mm x 140mm x 45mm",
    images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop"],
    downloads: {
      technicalDatasheet: "#",
      installationGuide: "#"
    },
    warrantyInformation: "12 Years",
    relatedProducts: ["VADO-IND-200", "VADO-IND-300"]
  },
  {
    sku: "JAQ-SENS-410",
    name: "Sensori Smart Shower System",
    brand: "JAQUAR",
    category: "Shower Systems",
    series: "Sensori",
    collectionName: "Smart Homes",
    installationType: ["Wall Mounted", "Concealed"],
    color: ["Black", "Silver"],
    application: ["Residential", "Hospitality"],
    description: "Digital shower control mapping with precision thermostatic control and memory settings.",
    features: [
      "Digital Display",
      "Memory Presets",
      "Anti-Scald Protection"
    ],
    finish: ["Matte Black", "Chrome"],
    dimensions: "200mm x 150mm",
    images: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1000&auto=format&fit=crop"],
    downloads: {
      brochurePdf: "#"
    },
    warrantyInformation: "10 Years",
    relatedProducts: []
  },
  {
    sku: "ITS-CE-990",
    name: "Milano Freestanding Bathtub",
    brand: "ITALIAN STANDARDS",
    category: "Bathtubs",
    series: "Milano",
    collectionName: "Classic Italian",
    installationType: ["Freestanding"],
    color: ["White"],
    application: ["Residential", "Hospitality"],
    description: "Architectural freestanding composite bathtub designed for luxury residential projects.",
    features: [
      "Solid Surface Material",
      "Ergonomic Slope",
      "Stain Resistant"
    ],
    finish: ["Matte White", "Gloss White"],
    dimensions: "1700mm x 800mm x 600mm",
    images: ["https://images.unsplash.com/photo-1507652313519-d4e9174296fc?q=80&w=1000&auto=format&fit=crop"],
    downloads: {
      technicalDatasheet: "#",
    },
    warrantyInformation: "25 Years",
    relatedProducts: ["VADO-IND-100"]
  }
];

export function searchProducts(query: string): ProductCatalog[] {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  
  return MOCK_PRODUCTS_DATABASE.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.sku.toLowerCase().includes(lowerQuery) ||
    product.brand.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery) ||
    product.series.toLowerCase().includes(lowerQuery)
  );
}
