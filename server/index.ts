import "dotenv/config";

import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";

const app = express();
const httpServer = createServer(app);

/**
 * =========================================================
 * 🔥 CORS — MUST BE FIRST
 * =========================================================
 */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://indianleto.com");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/**
 * =========================================================
 * 🔥 BODY PARSER — HARD MODE (NO EXPRESS MAGIC)
 * =========================================================
 */
app.use(express.raw({ type: "*/*" }));

/**
 * =========================================================
 * LOGGER
 * =========================================================
 */
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

/**
 * =========================================================
 * ROUTES + ERROR HANDLER + SERVER START
 * =========================================================
 */
(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("UNHANDLED ERROR:", err);
    res.status(500).json({ message: "Internal Server Error" });
  });

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
