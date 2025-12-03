import type { Product } from "@shared/schema";

import product1_1 from "@assets/image_1764759622590.png";
import product1_2 from "@assets/image_1764759632220.png";
import catalogImage from "@assets/image_1764759608053.png";

export const products: Product[] = [
  {
    id: "T1025120261",
    title: "Wholesale Women Spring And Summer Fashion Floral Print Strapless Bodycon Maxi Dress",
    description: "Floral strapless maxi dress. Material: Polyester/Spandex. Sleeve: sleeveless. Length: long dress. Type: Strapless. Style: Sexy Wind. Pattern: Floral.",
    images: [product1_1, product1_2],
    priceTiers: [
      { minQty: 1, maxQty: 5, price: 592.14 },
      { minQty: 6, maxQty: 35, price: 537.98 },
      { minQty: 36, maxQty: null, price: 503.68 }
    ],
    attributes: {
      color: "Rose",
      sizes: ["S", "M", "L"],
      measurements: {
        "S": { skirtLength: 123, bust: 72, waist: 64, hips: 82 },
        "M": { skirtLength: 125, bust: 76, waist: 68, hips: 86 },
        "L": { skirtLength: 127, bust: 80, waist: 72, hips: 90 }
      }
    },
    minOrder: 1,
    sku: "T1025120261",
    hasPromo: true
  },
  {
    id: "P2",
    title: "Floral Short Summer Dress Wholesale Women Fashion Multi-Color Print",
    description: "Short floral dress, multiple colors. Material: Polyester. Sleeve: Short. Length: Mini. Style: Casual Chic.",
    images: [catalogImage],
    priceTiers: [
      { minQty: 1, maxQty: 5, price: 1065.12 },
      { minQty: 6, maxQty: 35, price: 970.00 },
      { minQty: 36, maxQty: null, price: 850.00 }
    ],
    attributes: {
      color: "Multi",
      sizes: ["S", "M", "L"],
      measurements: {
        "S": { skirtLength: 85, bust: 70, waist: 62, hips: 80 },
        "M": { skirtLength: 87, bust: 74, waist: 66, hips: 84 },
        "L": { skirtLength: 89, bust: 78, waist: 70, hips: 88 }
      }
    },
    minOrder: 1,
    sku: "P2",
    hasPromo: true
  },
  {
    id: "P3",
    title: "Wholesale Summer Beach Floral Print Spaghetti Strap Midi Dress",
    description: "Beach-ready floral midi dress with delicate spaghetti straps. Material: Viscose blend. Perfect for resort wear.",
    images: [catalogImage],
    priceTiers: [
      { minQty: 1, maxQty: 5, price: 429.66 },
      { minQty: 6, maxQty: 35, price: 389.50 },
      { minQty: 36, maxQty: null, price: 349.00 }
    ],
    attributes: {
      color: "Yellow Floral",
      sizes: ["S", "M", "L", "XL"],
      measurements: {
        "S": { skirtLength: 110, bust: 74, waist: 66, hips: 84 },
        "M": { skirtLength: 112, bust: 78, waist: 70, hips: 88 },
        "L": { skirtLength: 114, bust: 82, waist: 74, hips: 92 },
        "XL": { skirtLength: 116, bust: 86, waist: 78, hips: 96 }
      }
    },
    minOrder: 1,
    sku: "P3",
    hasPromo: true
  },
  {
    id: "P4",
    title: "Wholesale Women Elegant Floral Print Off-Shoulder Party Dress",
    description: "Elegant off-shoulder party dress with vibrant floral print. Material: Polyester/Cotton blend. Style: Party/Evening.",
    images: [product1_1],
    priceTiers: [
      { minQty: 1, maxQty: 5, price: 698.65 },
      { minQty: 6, maxQty: 35, price: 635.50 },
      { minQty: 36, maxQty: null, price: 580.00 }
    ],
    attributes: {
      color: "Pink Floral",
      sizes: ["S", "M", "L"],
      measurements: {
        "S": { skirtLength: 95, bust: 72, waist: 64, hips: 82 },
        "M": { skirtLength: 97, bust: 76, waist: 68, hips: 86 },
        "L": { skirtLength: 99, bust: 80, waist: 72, hips: 90 }
      }
    },
    minOrder: 1,
    sku: "P4",
    hasPromo: true
  },
  {
    id: "P5",
    title: "Wholesale Women Casual Boho Floral Wrap Dress Summer Collection",
    description: "Bohemian style wrap dress with beautiful floral patterns. Material: Rayon. Comfortable and flowy design.",
    images: [catalogImage],
    priceTiers: [
      { minQty: 1, maxQty: 5, price: 519.93 },
      { minQty: 6, maxQty: 35, price: 472.80 },
      { minQty: 36, maxQty: null, price: 425.00 }
    ],
    attributes: {
      color: "Red Floral",
      sizes: ["S", "M", "L", "XL"],
      measurements: {
        "S": { skirtLength: 105, bust: 74, waist: 66, hips: 84 },
        "M": { skirtLength: 107, bust: 78, waist: 70, hips: 88 },
        "L": { skirtLength: 109, bust: 82, waist: 74, hips: 92 },
        "XL": { skirtLength: 111, bust: 86, waist: 78, hips: 96 }
      }
    },
    minOrder: 1,
    sku: "P5",
    hasPromo: true
  },
  {
    id: "P6",
    title: "Wholesale Women Spring Floral Print A-Line Vintage Dress",
    description: "Vintage-inspired A-line dress with classic floral print. Material: Cotton blend. Timeless elegance.",
    images: [product1_1],
    priceTiers: [
      { minQty: 1, maxQty: 5, price: 853.00 },
      { minQty: 6, maxQty: 35, price: 775.45 },
      { minQty: 36, maxQty: null, price: 698.00 }
    ],
    attributes: {
      color: "White Floral",
      sizes: ["S", "M", "L"],
      measurements: {
        "S": { skirtLength: 100, bust: 72, waist: 64, hips: 82 },
        "M": { skirtLength: 102, bust: 76, waist: 68, hips: 86 },
        "L": { skirtLength: 104, bust: 80, waist: 72, hips: 90 }
      }
    },
    minOrder: 1,
    sku: "P6",
    hasPromo: true
  },
  {
    id: "P7",
    title: "Wholesale Women Tropical Print Ruffle Hem Summer Dress",
    description: "Tropical print dress with playful ruffle hem. Material: Polyester. Perfect for summer collections.",
    images: [catalogImage],
    priceTiers: [
      { minQty: 1, maxQty: 5, price: 465.00 },
      { minQty: 6, maxQty: 35, price: 422.75 },
      { minQty: 36, maxQty: null, price: 380.00 }
    ],
    attributes: {
      color: "Tropical",
      sizes: ["S", "M", "L"],
      measurements: {
        "S": { skirtLength: 88, bust: 70, waist: 62, hips: 80 },
        "M": { skirtLength: 90, bust: 74, waist: 66, hips: 84 },
        "L": { skirtLength: 92, bust: 78, waist: 70, hips: 88 }
      }
    },
    minOrder: 1,
    sku: "P7",
    hasPromo: true
  },
  {
    id: "P8",
    title: "Wholesale Women Rose Print Sleeveless Bodycon Evening Dress",
    description: "Sophisticated rose print bodycon dress for evening wear. Material: Spandex blend. Elegant silhouette.",
    images: [product1_2],
    priceTiers: [
      { minQty: 1, maxQty: 5, price: 789.50 },
      { minQty: 6, maxQty: 35, price: 718.15 },
      { minQty: 36, maxQty: null, price: 645.00 }
    ],
    attributes: {
      color: "Rose Print",
      sizes: ["S", "M", "L"],
      measurements: {
        "S": { skirtLength: 118, bust: 72, waist: 64, hips: 82 },
        "M": { skirtLength: 120, bust: 76, waist: 68, hips: 86 },
        "L": { skirtLength: 122, bust: 80, waist: 72, hips: 90 }
      }
    },
    minOrder: 1,
    sku: "P8",
    hasPromo: true
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}
