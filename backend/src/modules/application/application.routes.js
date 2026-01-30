import * as AppController from "./application.controller.js";
import { applyMiddleware, asyncHandler } from "../../lib/middleware.js";
import { authMiddleware, authorize } from "../../middleware/authMiddleware.js";
export const registerApplicationRoutes = (app) => {
  //public routes
  // (none now, simplified)

  //protected user routes
  // Submit Application
  app.post(
    "/api/applications",
    applyMiddleware(
      authMiddleware,
      asyncHandler(AppController.submitApplication)
    )
  );

  // Get My Applications
  app.get(
    "/api/applications/my-applications",
    applyMiddleware(
      authMiddleware,
      asyncHandler(AppController.getMyApplications)
    )
  );

  // Update Application
  app.put(
    "/api/applications/:id",
    applyMiddleware(
      authMiddleware,
      asyncHandler(AppController.updateApplication)
    )
  );

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
