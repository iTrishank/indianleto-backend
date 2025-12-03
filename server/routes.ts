import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { quotationRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/quote", async (req, res) => {
    try {
      const validatedData = quotationRequestSchema.parse(req.body);
      
      if (validatedData.cart.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty. Please add items before submitting a quotation."
        });
      }

      const result = await storage.createQuotation(validatedData);

      res.json({
        success: true,
        quoteId: result.quoteId,
        message: "Quotation submitted successfully"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        return res.status(400).json({
          success: false,
          message: `Validation error: ${errorMessages}`
        });
      }
      
      console.error("Error processing quotation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process quotation. Please try again."
      });
    }
  });

  app.get("/api/quote/:quoteId", async (req, res) => {
    try {
      const { quoteId } = req.params;
      const quotation = await storage.getQuotation(quoteId);
      
      if (!quotation) {
        return res.status(404).json({
          success: false,
          message: "Quotation not found"
        });
      }

      res.json({
        success: true,
        quotation
      });
    } catch (error) {
      console.error("Error fetching quotation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch quotation"
      });
    }
  });

  return httpServer;
}
