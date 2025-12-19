import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { storage } from "./storage";
import { quotationRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  /**
   * =========================================================
   * STATIC ASSETS
   * =========================================================
   */
  app.use("/assets", express.static(path.join(process.cwd(), "assets")));

  /**
   * =========================================================
   * CREATE QUOTATION
   * =========================================================
   */
  app.post("/api/quote", async (req, res) => {
    try {
      let body: any;

      // 🔒 SAFE JSON PARSING (RAW BODY)
      try {
        const rawBody = req.body?.toString("utf8") || "{}";
        body = JSON.parse(rawBody);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON payload",
        });
      }

      // ✅ ZOD VALIDATION
      const validatedData = quotationRequestSchema.parse(body);

      // 💾 SAVE QUOTATION
      const result = await storage.createQuotation(validatedData);

      // ✅ SUCCESS RESPONSE
      return res.json({
        success: true,
        quoteId: result.quoteId,
        message: "Quotation submitted successfully",
      });
    } catch (error) {
      // ❌ VALIDATION ERROR
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      }

      // ❌ UNEXPECTED ERROR
      console.error("QUOTE ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to process quotation",
      });
    }
  });

  /**
   * =========================================================
   * GET QUOTATION BY ID
   * =========================================================
   */
  app.get("/api/quote/:quoteId", async (req, res) => {
    try {
      const { quoteId } = req.params;
      const quotation = await storage.getQuotation(quoteId);

      if (!quotation) {
        return res.status(404).json({
          success: false,
          message: "Quotation not found",
        });
      }

      return res.json({
        success: true,
        quotation,
      });
    } catch (error) {
      console.error("Error fetching quotation:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch quotation",
      });
    }
  });

  return httpServer;
}
