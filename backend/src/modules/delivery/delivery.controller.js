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
        const { businessId, orderItems, deliveryService, deliveryAddress, contactNumber, instructions, campusLocation } = body;

        // Validate
        if (!businessId || !orderItems || orderItems.length === 0 || !deliveryAddress || !contactNumber || !campusLocation || !deliveryService) {
            throw new ApiError(400, "Please provide complete order details (business, items, address, delivery service provider, contact, campus location)");
        }

        const business = await Business.findById(businessId);
        if (!business) throw new ApiError(404, "Business not found");

        const delivery = await Delivery.create({
            user: req.user._id,
            business: businessId,
            deliveryService: deliveryService,
            orderItems,
            deliveryAddress,
            contactNumber,
            instructions,
            campusLocation,
            deliveryFee: 15, // Example ETB fee
            // totalAmount,
            status: "Pending"
        });

        

        const response = new ApiResponse(201, delivery, "Delivery request created");
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
    } catch (error) {
        console.log("error message:", error)
        throw new ApiError(500, "Failed to create delivery request", [error]);
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

// @desc Get all delivery services
// @route GET /api/delivery
export const getAllServices = async (req, res) => {
    try {
        // We filter the Business model for the "delivery" category
        const services = await Business.find({ category: "delivery" })
            .sort("-rating.average");

        const response = new ApiResponse(200, services, "Delivery services fetched");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
    } catch (error) {
        throw new ApiError(500, "Failed to fetch services");
    }
};

// @desc Get delivery service by id
// @route GET /api/delivery/:id
export const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        //  Find business that is specifically in the 'delivery' category
        const service = await Business.findOne({ 
            _id: id, 
            category: "delivery" 
        });
        if (!service) throw new ApiError(404, "Delivery Service not found");

        const response = new ApiResponse(200, service, "Service fetched");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
    } catch (error) {
        throw new ApiError(500, "Failed to fetch service");
    }
};

// @desc get top 5 rated deliveries
// @route GET /api/delivery/top
export const getTopRatedServices = async (req, res) => {
    try {
        const topProviders = await Business.find({ category: "delivery" })
            .sort({ "rating.average": -1 })
            .limit(5);

        const response = new ApiResponse(200, topProviders, "Top rated providers");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Failed to fetch top services");
    }
};

// @desc cancel delivery
// @route DELETE /api/delivery/:id
export const cancelDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        const delivery = await Delivery.findById(id);
        if (!delivery) throw new ApiError(404, "Delivery not found");

        if (delivery.status !== "Pending") {
            throw new ApiError(400, "Only pending deliveries can be cancelled");
        }

        delivery.status = "Cancelled";
        await delivery.save();

        const response = new ApiResponse(200, delivery, "Delivery cancelled");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
    } catch (error) {
        throw new ApiError(500, "Failed to cancel delivery");
    }
};
