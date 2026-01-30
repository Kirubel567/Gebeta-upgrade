import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business", // The restaurant/shop
            required: true,
        },
        deliveryService: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Business", // The service provider (category: "delivery")
            required: true,
        },
        // Reference for the person making the delivery
        deliverer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        orderItems: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, required: true, default: 1 },
                price: { type: Number, required: true }, // Price in ETB at time of order
            },
        ],
        deliveryAddress: {
            type: String,
            required: [true, "Please provide delivery address"],
        },
        // Alignment with campus locations defined in API.md
        campusLocation: {
            type: String,
            enum: ["4k", "5k", "6k"],
            required: [true, "Please specify campus location (4k, 5k, or 6k)"],
        },
        contactNumber: {
            type: String,
            required: [true, "Please provide contact number"],
        },
        status: {
            type: String,
            // Matched with common status flows in delivery platforms
            enum: ["Pending", "Accepted", "Preparing", "In Transit", "Delivered", "Cancelled"],
            default: "Pending",
        },
        instructions: {
            type: String, // e.g., "Meet at the gate of 5k dormitory"
        },
        deliveryFee: {
            type: Number,
            default: 0, // Usually set based on campus distance
        },
        totalAmount: {
            type: Number
        },
        paymentMethod: {
            type: String,
            enum: ["Cash on Delivery", "Telebirr", "CBE Birr"],
            default: "Cash on Delivery",
        }
    },
    {
        timestamps: true,
    }
);

// Middleware to calculate totalAmount before saving

deliverySchema.pre("save", async function () {
    // 'this' refers to the document being saved
    if (this.orderItems && this.orderItems.length > 0) {
        const itemsTotal = this.orderItems.reduce(
            (acc, item) => acc + (item.price * item.quantity), 
            0
        );
        this.totalAmount = itemsTotal + (this.deliveryFee || 0);
    }
    // No need to call next() if using async or simply modifying 'this'
});

export const Delivery = mongoose.model("Delivery", deliverySchema);