import { applyMiddleware, asyncHandler } from "../../lib/middleware.js";
import { authorize } from "../../middleware/authMiddleware.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import * as MenuController from "./menu.controller.js";

export const registerMenuRoutes = (app) => {
  //public routes
  app.get("/api/menu/:businessId", asyncHandler(MenuController.getMenuByBusiness));
  app.get("/api/menu/:businessId/top", asyncHandler(MenuController.getTopItems));

  //protected routes
  app.post("/api/menu", applyMiddleware(
    authMiddleware,
    authorize("admin"),
    asyncHandler(MenuController.createMenuItem)));

  app.put("/api/menu/:id", applyMiddleware(
    authMiddleware,
    authorize("admin"),
    asyncHandler(MenuController.updateMenuItem)));

  app.delete("/api/menu/:id", applyMiddleware(
    authMiddleware,
    authorize("admin"),
    asyncHandler(MenuController.deleteMenuItem)));
};
