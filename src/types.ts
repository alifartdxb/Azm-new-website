export interface NavItem {
  name: string;
  path: string;
  children?: { name: string; path: string }[];
}

export interface ProductCatalog {
  sku: string;
  name: string;
  brand: 'VADO' | 'JAQUAR' | 'ITALIAN STANDARDS' | 'NOURK' | 'SANIT' | 'SONET' | string;
  category: string;
  series: string;
  collectionName?: string;
  installationType?: string[];
  color?: string[];
  application?: string[];
  description: string;
  features: string[];
  finish: string[];
  dimensions: string;
  images: string[];
  downloads: {
    technicalDatasheet?: string;
    brochurePdf?: string;
    installationGuide?: string;
  };
  warrantyInformation: string;
  relatedProducts: string[]; // Array of related SKUs
}
