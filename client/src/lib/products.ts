import type { Product } from "@shared/schema";

import detail1 from "@assets/detail_1.jpg";
import detail2 from "@assets/detail_2.jpg";
import detail3 from "@assets/detail_3.jpg";
import detail4 from "@assets/detail_4.jpg";
import detail5 from "@assets/detail_5.jpg";

export const productImages: Record<string, string> = {
  "P1-1.jpg": detail1,
  "P1-2.jpg": detail2,
  "P1-3.jpg": detail3,
  "P1-4.jpg": detail4,
  "P2-1.jpg": detail2,
  "P2-2.jpg": detail1,
  "P2-3.jpg": detail5,
  "P2-4.jpg": detail3,
  "P3-1.jpg": detail3,
  "P3-2.jpg": detail4,
  "P3-3.jpg": detail1,
  "P3-4.jpg": detail2,
  "P4-1.jpg": detail4,
  "P4-2.jpg": detail5,
  "P4-3.jpg": detail2,
  "P4-4.jpg": detail1,
  "P5-1.jpg": detail5,
  "P5-2.jpg": detail3,
  "P5-3.jpg": detail4,
  "P5-4.jpg": detail2,
};

export function getProductImage(imageName: string): string {
  return productImages[imageName] || detail1;
}

export const products: Product[] = [
  {
    id: "P1",
    title: "Elegant Floral Maxi Dress Summer Collection",
    description: "Beautiful floral print maxi dress perfect for summer occasions. Made with premium polyester blend fabric. Features a flattering A-line silhouette with adjustable straps.",
    images: [detail1, detail2, detail3, detail4],
    priceTiers: [
      { minQty: 1, maxQty: 5, price: 1250 },
      { minQty: 6, maxQty: 25, price: 1100 },
      { minQty: 26, maxQty: null, price: 950 }
    ],
    attributes: {
      color: "Rose Floral",
      sizes: ["S", "M", "L", "XL"],
      measurements: {
        "S": { skirtLength: 125, bust: 84, waist: 66, hips: 90 },
        "M": { skirtLength: 127, bust: 88, waist: 70, hips: 94 },
        "L": { skirtLength: 129, bust: 92, waist: 74, hips: 98 },
        "XL": { skirtLength: 131, bust: 96, waist: 78, hips: 102 }
      }
    },
    minOrder: 1,
    sku: "IL-P1-2024",
    hasPromo: true
  },
  {
    id: "P2",
    title: "Bohemian Paisley Print Midi Dress",
    description: "Stunning bohemian style midi dress with intricate paisley patterns. Lightweight rayon fabric ideal for warm weather. Features elegant flutter sleeves and a tie waist.",
    images: [detail2, detail1, detail5, detail3],
    priceTiers: [
      { minQty: 1, maxQty: 5, price: 1450 },
      { minQty: 6, maxQty: 25, price: 1280 },
      { minQty: 26, maxQty: null, price: 1100 }
    ],
    attributes: {
      color: "Blue Paisley",
      sizes: ["S", "M", "L"],
      measurements: {
        "S": { skirtLength: 100, bust: 82, waist: 64, hips: 88 },
        "M": { skirtLength: 102, bust: 86, waist: 68, hips: 92 },
        "L": { skirtLength: 104, bust: 90, waist: 72, hips: 96 }
      }
    },
    minOrder: 1,
    sku: "IL-P2-2024",
    hasPromo: true
  },
  {
    id: "P3",
    title: "Classic Striped Wrap Dress Business Casual",
    description: "Sophisticated striped wrap dress perfect for business casual settings. Premium cotton-polyester blend ensures comfort all day. True wrap design with adjustable fit.",
    images: [detail3, detail4, detail1, detail2],
    priceTiers: [
      { minQty: 1, maxQty: 5, price: 1680 },
      { minQty: 6, maxQty: 25, price: 1480 },
      { minQty: 26, maxQty: null, price: 1280 }
    ],
    attributes: {
      color: "Navy Stripe",
      sizes: ["S", "M", "L", "XL"],
      measurements: {
        "S": { skirtLength: 95, bust: 84, waist: 66, hips: 90 },
        "M": { skirtLength: 97, bust: 88, waist: 70, hips: 94 },
        "L": { skirtLength: 99, bust: 92, waist: 74, hips: 98 },
        "XL": { skirtLength: 101, bust: 96, waist: 78, hips: 102 }
      }
    },
    minOrder: 1,
    sku: "IL-P3-2024",
    hasPromo: true
  },
  {
    id: "P4",
    title: "Tropical Print Off-Shoulder Party Dress",
    description: "Vibrant tropical print party dress with off-shoulder design. Stretchy spandex blend for comfortable fit. Perfect for beach parties and summer celebrations.",
    images: [detail4, detail5, detail2, detail1],
    priceTiers: [
      { minQty: 1, maxQty: 5, price: 1350 },
      { minQty: 6, maxQty: 25, price: 1190 },
      { minQty: 26, maxQty: null, price: 1020 }
    ],
    attributes: {
      color: "Tropical Green",
      sizes: ["S", "M", "L"],
      measurements: {
        "S": { skirtLength: 88, bust: 80, waist: 62, hips: 86 },
        "M": { skirtLength: 90, bust: 84, waist: 66, hips: 90 },
        "L": { skirtLength: 92, bust: 88, waist: 70, hips: 94 }
      }
    },
    minOrder: 1,
    sku: "IL-P4-2024",
    hasPromo: true
  },
  {
    id: "P5",
    title: "Vintage Rose Print Tea Length Dress",
    description: "Elegant vintage-inspired dress featuring delicate rose prints. Tea length hem creates a timeless silhouette. Made with soft viscose fabric for all-day comfort.",
    images: [detail5, detail3, detail4, detail2],
    priceTiers: [
      { minQty: 1, maxQty: 5, price: 1550 },
      { minQty: 6, maxQty: 25, price: 1365 },
      { minQty: 26, maxQty: null, price: 1180 }
    ],
    attributes: {
      color: "Vintage Rose",
      sizes: ["S", "M", "L", "XL"],
      measurements: {
        "S": { skirtLength: 108, bust: 82, waist: 64, hips: 88 },
        "M": { skirtLength: 110, bust: 86, waist: 68, hips: 92 },
        "L": { skirtLength: 112, bust: 90, waist: 72, hips: 96 },
        "XL": { skirtLength: 114, bust: 94, waist: 76, hips: 100 }
      }
    },
    minOrder: 1,
    sku: "IL-P5-2024",
    hasPromo: true
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}
