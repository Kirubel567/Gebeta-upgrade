import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      address: { type: String },
      dormitories: [{ type: String }],
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    description: {
      type: String,
      maxLength: 1000,
    },
    applicantEmail: {
      type: String,
    },
    applicantPhone: {
      type: String,
    },

    // Business Data Fields
    image: [
      {
        url: { type: String, required: true },
        alt: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    category: {
      type: String,
      enum: ["on-campus", "off-campus", "delivery"],
    },
    features: {
      priceRange: {
        type: String,
        enum: ["$", "$$", "$$$"],
        default: "$$",
      },
      hasDelivery: Boolean,
      isGroupFriendly: Boolean
    },
    contact: {
      phone: String,
      telegram: String,
      instagram: String
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    //admin review
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewNotes: {
      type: String,
    },
    reviewedAt: {
      type: Date,
    },

    //if approved, link to created business
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  {
    timestamps: true,
  },
);

ApplicationSchema.index({ status: 1, createdAt: -1 });
ApplicationSchema.index({ name: 1 }, { unique: true });

export const Application = mongoose.model("Application", ApplicationSchema);
