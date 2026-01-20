import * as AppController from "./application.controller.js";
import { applyMiddleware, asyncHandler } from "../../lib/middleware.js";
import { authMiddleware, authorize } from "../../middleware/authMiddleware.js";
export const registerApplicationRoutes = (app) => {
  //public routes
  app.post("/api/applications", asyncHandler(AppController.submitApplication));

  //admin only routes
  app.get(
    "/api/applications",
    applyMiddleware(
      authMiddleware,
      authorize("admin"),
      asyncHandler(AppController.listApplications),
    ),
  );
  app.put(
    "/api/applications/:id/approve",
    applyMiddleware(
      authMiddleware,
      authorize("admin"),
      asyncHandler(AppController.approveApplication),
    ),
  );
  app.put(
    "/api/applications/:id/reject",
    applyMiddleware(
      authMiddleware,
      authorize("admin"),
      asyncHandler(AppController.rejectApplication),
    ),
  );
};
