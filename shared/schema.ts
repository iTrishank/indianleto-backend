import { z } from "zod";

// Price tier for wholesale pricing
export const priceTierSchema = z.object({
  minQty: z.number(),
  maxQty: z.number().nullable(),
  price: z.number(),
});

export type PriceTier = z.infer<typeof priceTierSchema>;

// Size measurements
export const measurementsSchema = z.object({
  skirtLength: z.number().optional(),
  bust: z.number().optional(),
  waist: z.number().optional(),
  hips: z.number().optional(),
});

export type Measurements = z.infer<typeof measurementsSchema>;

// Product attributes
export const productAttributesSchema = z.object({
  color: z.string(),
  sizes: z.array(z.string()),
  measurements: z.record(z.string(), measurementsSchema).optional(),
});

export type ProductAttributes = z.infer<typeof productAttributesSchema>;

// Product schema
export const productSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  priceTiers: z.array(priceTierSchema),
  attributes: productAttributesSchema,
  minOrder: z.number().default(1),
  sku: z.string(),
  hasPromo: z.boolean().default(true),
});

export type Product = z.infer<typeof productSchema>;

// Cart item variant
export const cartItemVariantSchema = z.object({
  size: z.string(),
  color: z.string(),
});

export type CartItemVariant = z.infer<typeof cartItemVariantSchema>;

// Cart item
export const cartItemSchema = z.object({
  productId: z.string(),
  productTitle: z.string(),
  variant: cartItemVariantSchema,
  quantity: z.number().min(1),

  // optional / derived on backend
  productImage: z.string().optional(),
  unitPrice: z.number().optional(),
});


export type CartItem = z.infer<typeof cartItemSchema>;

// Customer info for quotation
export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required"),
});

export type Customer = z.infer<typeof customerSchema>;

// Quotation request
export const quotationRequestSchema = z.object({
  customer: customerSchema,
  cart: z.array(cartItemSchema),
  notes: z.string().optional(),
});

export type QuotationRequest = z.infer<typeof quotationRequestSchema>;

// Quotation response
export const quotationResponseSchema = z.object({
  success: z.boolean(),
  quoteId: z.string().optional(),
  message: z.string().optional(),
});

export type QuotationResponse = z.infer<typeof quotationResponseSchema>;

// Helper function to calculate price based on quantity
export function getPriceForQuantity(priceTiers: PriceTier[], quantity: number): number {
  for (const tier of priceTiers) {
    if (quantity >= tier.minQty && (tier.maxQty === null || quantity <= tier.maxQty)) {
      return tier.price;
    }
  }
  // Return the last tier price if quantity exceeds all tiers
  return priceTiers[priceTiers.length - 1]?.price || 0;
}

// Helper function to get price range string
export function getPriceRange(priceTiers: PriceTier[]): string {
  if (priceTiers.length === 0) return "Price on request";
  const prices = priceTiers.map(t => t.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return `INR${min.toFixed(2)} - INR${max.toFixed(2)}`;
}
