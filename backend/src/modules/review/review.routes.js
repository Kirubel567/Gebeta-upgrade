import * as ReviewController from "./review.controller.js";
import { applyMiddleware } from "../../lib/middleware.js";
import { asyncHandler } from "../../lib/middleware.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

export const registerReviewRoutes = (app) => {
    // Add Review (Protected)
    app.post(
        "/api/reviews",
        applyMiddleware(authMiddleware, ReviewController.addReview)
    );

    // Get Reviews (Public)
    app.get(
        "/api/reviews/:businessId",
        asyncHandler(ReviewController.getReviews)
    );

    // Update Review (Protected)
    app.put(
        "/api/reviews/:reviewId",
        applyMiddleware(authMiddleware, ReviewController.updateReview)
    );

    // Get Reviews by User ID (Public)
    app.get(
        "/api/reviews/user/:userId",
        asyncHandler(ReviewController.getReviewsByUserId)
    );
};
