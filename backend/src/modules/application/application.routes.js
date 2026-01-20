import * as AppController from "./application.controller.js";

export const registerApplicationRoutes = (app) => {
  app.post("/api/applications", AppController.submitApplication);

  //admin only routes
  app.get("/api/applications", AppController.listApplications);
  app.put("/api/applications/:id/approve", AppController.approveApplication);
  app.put("/api/applications/:id/reject", AppController.rejectApplication);
};


