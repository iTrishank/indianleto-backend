import { randomUUID } from "crypto";
import type { QuotationRequest, QuotationResponse, CartItem } from "@shared/schema";
import { appendQuotationToSheet, ensureSheetHeaders } from "./googleSheets";

export interface StoredQuotation {
  quoteId: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  cart: CartItem[];
  notes: string;
  totalAmount: number;
  createdAt: string;
}

export interface IStorage {
  createQuotation(request: QuotationRequest): Promise<{ quoteId: string }>;
  getQuotation(quoteId: string): Promise<StoredQuotation | undefined>;
  getAllQuotations(): Promise<StoredQuotation[]>;
}

export class MemStorage implements IStorage {
  private quotations: Map<string, StoredQuotation>;
  private spreadsheetId: string | null = null;
  private headersEnsured: boolean = false;

  constructor() {
    this.quotations = new Map();
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID || null;
  }

  private generateQuoteId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = randomUUID().slice(0, 6).toUpperCase();
    return `IL-${timestamp}-${random}`;
  }

  private calculateTotal(cart: CartItem[]): number {
    return cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  }

  private formatProductsForSheet(cart: CartItem[]): string {
    return cart.map(item => 
      `${item.productTitle} (${item.variant.size}/${item.variant.color}) x${item.quantity} @INR${item.unitPrice.toFixed(2)}`
    ).join('; ');
  }

  async createQuotation(request: QuotationRequest): Promise<{ quoteId: string }> {
    const quoteId = this.generateQuoteId();
    const totalAmount = this.calculateTotal(request.cart);
    const createdAt = new Date().toISOString();

    const storedQuotation: StoredQuotation = {
      quoteId,
      customer: request.customer,
      cart: request.cart,
      notes: request.notes || "",
      totalAmount,
      createdAt
    };

    this.quotations.set(quoteId, storedQuotation);

    if (this.spreadsheetId) {
      try {
        if (!this.headersEnsured) {
          await ensureSheetHeaders(this.spreadsheetId);
          this.headersEnsured = true;
        }

        await appendQuotationToSheet(this.spreadsheetId, {
          quoteId,
          customerName: request.customer.name,
          customerPhone: request.customer.phone,
          customerEmail: request.customer.email,
          products: this.formatProductsForSheet(request.cart),
          totalAmount,
          notes: request.notes || "",
          createdAt
        });
        console.log(`Quotation ${quoteId} saved to Google Sheets`);
      } catch (error) {
        console.error("Failed to save to Google Sheets:", error);
      }
    } else {
      console.log(`Quotation ${quoteId} saved to memory (no Google Sheet configured)`);
    }

    return { quoteId };
  }

  async getQuotation(quoteId: string): Promise<StoredQuotation | undefined> {
    return this.quotations.get(quoteId);
  }

  async getAllQuotations(): Promise<StoredQuotation[]> {
    return Array.from(this.quotations.values());
  }
}

export const storage = new MemStorage();
