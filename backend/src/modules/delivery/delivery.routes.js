import * as DeliveryController from "./delivery.controller.js";
import { applyMiddleware } from "../../lib/middleware.js";
import { authMiddleware, authorize } from "../../middleware/authMiddleware.js";

export const registerDeliveryRoutes = (app) => {
    // Create new delivery request (User)
    app.post(
        "/api/delivery",
        applyMiddleware(authMiddleware, DeliveryController.createRequest)
    );

    // Get my deliveries (User)
    app.get(
        "/api/delivery/me",
        applyMiddleware(authMiddleware, DeliveryController.getMyDeliveries)
    );

    // Update Status (Admin/Business Owner)
    app.patch(
        "/api/delivery/:id/status",
        applyMiddleware(
            authMiddleware,
            authorize("admin", "business_owner"),
            DeliveryController.updateStatus
        )
    );
};
