import * as MenuController from "./menu.controller.js";

export const registerMenuRoutes = (app) => {
  app.get("/api/menu/:businessId", MenuController.getMenuByBusiness);
  app.get("/api/menu/:businessId/top", MenuController.getTopItems);

  app.post("/api/menu", MenuController.createMenuItem);

  app.put("/api/menu/:id", MenuController.updateMenuItem);
  app.delete("/api/menu/:id", MenuController.deleteMenuItem);
};
