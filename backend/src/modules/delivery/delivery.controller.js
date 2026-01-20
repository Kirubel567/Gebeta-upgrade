import { Delivery } from "../../models/Delivery.js";
import Business from "../../models/Business.js";
import { parseBody } from "../../utils/parseBody.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

// @desc Create a delivery request
// @route POST /api/delivery
export const createRequest = async (req, res) => {
    try {
        if (!req.user) throw new ApiError(401, "Not authorized");

        const body = await parseBody(req);
        const { businessId, orderItems, deliveryAddress, contactNumber, instructions, totalAmount, campusLocation } = body;

        // Validate
        if (!businessId || !orderItems || orderItems.length === 0 || !deliveryAddress || !contactNumber || !campusLocation) {
            throw new ApiError(400, "Please provide complete order details (business, items, address, contact, campus location)");
        }

        const business = await Business.findById(businessId);
        if (!business) throw new ApiError(404, "Business not found");

        const delivery = await Delivery.create({
            user: req.user._id,
            business: businessId,
            orderItems,
            deliveryAddress,
            contactNumber,
            instructions,
            campusLocation,
            deliveryFee: 15, // Example ETB fee
            totalAmount,
            status: "Pending"
        });

        await delivery.save();

        const response = new ApiResponse(201, delivery, "Delivery request created");
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
    } catch (error) {
        console.log("error message:", error)
        throw new ApiError(500, "Failed to create delivery request");
    }
};

// @desc Get my deliveries
// @route GET /api/delivery/me
export const getMyDeliveries = async (req, res) => {
    try {
        if (!req.user) throw new ApiError(401, "Not authorized");

        const deliveries = await Delivery.find({ user: req.user._id })
            .populate("business", "name image")
            .sort("-createdAt");

        const response = new ApiResponse(200, deliveries, "My Deliveries");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
    } catch (error) {
        throw new ApiError(500, "Failed to fetch deliveries");
    }
};

// @desc Update delivery status (Admin/Business Owner)
// @route PATCH /api/delivery/:id/status
export const updateStatus = async (req, res) => {
    
    try{
        const { id } = req.params;
        const { status } = await parseBody(req);

        const validStatuses = ["Pending", "Accepted", "In Transit", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            throw new ApiError(400, "Invalid status");
        }

        const delivery = await Delivery.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!delivery) throw new ApiError(404, "Delivery not found");

        const response = new ApiResponse(200, delivery, "Status updated");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
    } catch (error) {
        throw new ApiError(500, "Failed to update delivery status");
    }
};
