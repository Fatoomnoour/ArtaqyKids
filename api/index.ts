import express from "express";
import fs from "fs";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { registerStorageProxy } from "../server/_core/storageProxy";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
registerStorageProxy(app);
registerOAuthRoutes(app);
app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));

const publicDir = path.resolve(process.cwd(), "dist", "public");
if (!fs.existsSync(publicDir)) {
  console.warn(`[Vercel] Compiled public directory not found: ${publicDir}`);
}
app.use(express.static(publicDir));
app.use((_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

export default app;
