import * as UserController from "./user.controller.js";
import { applyMiddleware } from "../../lib/middleware.js";
import { asyncHandler } from "../../lib/middleware.js";
import { authMiddleware, authorize } from "../../middleware/authMiddleware.js";

// Note: We wrap controllers in asyncHandler to ensure errors are caught
// (Although applyMiddleware usually handles this automatically for async functions, 
// using asyncHandler on public routes is good practice if not using applyMiddleware)

export const registerUserRoutes = (app) => {
    // Public Routes (Login/Register)
    app.post("/api/users/register", asyncHandler(UserController.register));
    app.post("/api/users/login", asyncHandler(UserController.login));
    app.post("/api/users/logout", asyncHandler(UserController.logout));

    // Protected Routes (Profile)
    // We use applyMiddleware to chain authMiddleware -> controller
    app.get(
        "/api/users/me",
        applyMiddleware(authMiddleware, UserController.getProfile)
    );

    app.put(
        "/api/users/me",
        applyMiddleware(authMiddleware, UserController.updateProfile)
    );

    //private and role based route
      app.post(
        "/api/admin/make-admin",
        applyMiddleware(
          authMiddleware,
          authorize("super_admin"),
          asyncHandler(UserController.makeAdmin),
        )
    )
};
