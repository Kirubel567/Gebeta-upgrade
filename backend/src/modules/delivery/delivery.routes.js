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

    // Get all delivery services
    app.get(
        "/api/delivery",
        applyMiddleware(authMiddleware, DeliveryController.getAllServices)
    );
    // Get top rated delivery services
    app.get(
        "/api/delivery/top",
        applyMiddleware(authMiddleware, DeliveryController.getTopRatedServices)
    );

    // Get delivery service by id
    app.get(
        "/api/delivery/:id",
        applyMiddleware(authMiddleware, DeliveryController.getServiceById)
    );

    

    // Cancel delivery (User)
    app.delete(
        "/api/delivery/:id",
        applyMiddleware(authMiddleware, authorize("user", "admin", "business_owner"),DeliveryController.cancelDelivery)
    );
};
