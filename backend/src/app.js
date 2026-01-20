import Router from "./lib/Router.js";
import { registerBusinessRoutes } from "./modules/business/business.routes.js";
import { registerUserRoutes } from "./modules/user/user.routes.js";
import { registerReviewRoutes } from "./modules/review/review.routes.js";
import { registerDeliveryRoutes } from "./modules/delivery/delivery.routes.js";
import { registerMenuRoutes } from "./modules/menu/menu.routes.js";
import { registerApplicationRoutes } from "./modules/application/application.routes.js";
import { runMiddleware } from "./lib/middleware.js";
import { corsMiddleware } from "./middleware/corsMiddleware.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { jsonBodyParser } from "./middleware/bodyParser.js";
import { errorHandler } from "./lib/middleware.js";

const app = new Router();

// Register Routes
registerBusinessRoutes(app);
registerUserRoutes(app);
registerReviewRoutes(app);
registerDeliveryRoutes(app);
registerMenuRoutes(app);
registerApplicationRoutes(app);

// Simple Health Check Route
app.get("/api/health", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "Gebeta API is online" }));
});

/**
 * Main Request Handler
 * Entry point for all incoming requests
 */
export const handleRequest = async (req, res) => {
  console.log(`[DEBUG] START Request: ${req.method} ${req.url}`);

  // 1. Define Global Middleware Chain
  const globalMiddlewares = [
    requestLogger,   // Log every request
    corsMiddleware,  // Handle CORS & Preflight
    jsonBodyParser   // Parse JSON body with limits
  ];

  // 2. Execute Middleware Chain
  console.log('[DEBUG] Running Global Middlewares...');
  const shouldContinue = await runMiddleware(req, res, globalMiddlewares);
  console.log(`[DEBUG] Global Middleware Complete. Continue? ${shouldContinue}`);

  // 3. If middlewares passed, run the application router
  if (shouldContinue) {
    try {
      // Since the router methods (GET, POST) are not async by default in the custom router,
      // we just call it. If you update Router to be async, await this.
      console.log('[DEBUG] Handing off to Router...');
      app.handleRoutes(req, res);
    } catch (err) {
      // Catch any synchronous errors in routing
      console.error('[DEBUG] Router Error:', err);
      errorHandler(err, req, res);
    }
  }
};
