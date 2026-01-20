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
  //CRUD actions on the businesses
  app.post(
    "/api/businesses",
    applyMiddleware(
      authMiddleware,
      authorize("admin"),
      asyncHandler(BussinessController.create),
    ),
  );
  app.put(
    "/api/businesses/:id",
    applyMiddleware(
      authMiddleware,
      authorize("admin"),
      asyncHandler(BussinessController.update),
    ),
  );
  app.delete(
    "/api/businesses/:id",
    applyMiddleware(
      authMiddleware,
      authorize("admin"),
      asyncHandler(BussinessController.remove),
    ),
  );
};
