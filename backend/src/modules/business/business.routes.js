import * as BussinessController from "./business.controller.js";
import { applyMiddleware, asyncHandler } from "../../lib/middleware.js";
import { authMiddleware, authorize } from "../../middleware/authMiddleware.js";

export const registerBusinessRoutes = (app) => {
  //public routes
  app.get("/api/businesses", asyncHandler(BussinessController.getAll));
  //featured
  app.get(
    "/api/businesses/featured",
    asyncHandler(BussinessController.getFeatured),
  );
  //single bussiness getting using id
  app.get(
    "/api/businesses/detail/:id",
    asyncHandler(BussinessController.getById),
  );

  //category specification
  //in the manual router we created we check the url string before storing
  app.get(
    "/api/businesses/category/:category",
    asyncHandler(BussinessController.getByCategory),
  );

  //protected routes
  // Get current user's business
  app.get(
    "/api/businesses/my-business",
    applyMiddleware(
      authMiddleware,
      asyncHandler(BussinessController.getMyBusiness),
    ),
  );

  // Get all businesses owned by current user
  app.get(
    "/api/businesses/my-businesses",
    applyMiddleware(
      authMiddleware,
      asyncHandler(BussinessController.getMyBusinesses),
    ),
  );

  // Approve a business (Admin only - handled by controller or add authorize('admin') middleware if available)
  app.patch(
    "/api/businesses/:id/approve",
    applyMiddleware(
      authMiddleware,
      asyncHandler(BussinessController.approve),
    ),
  );

  //CRUD actions on the businesses
  app.post(
    "/api/businesses",
    applyMiddleware(
      authMiddleware,
      asyncHandler(BussinessController.create),
    ),
  );
  app.put(
    "/api/businesses/:id",
    applyMiddleware(
      authMiddleware,
      asyncHandler(BussinessController.update),
    ),
  );
  app.delete(
    "/api/businesses/:id",
    applyMiddleware(
      authMiddleware,
      asyncHandler(BussinessController.remove),
    ),
  );
};
