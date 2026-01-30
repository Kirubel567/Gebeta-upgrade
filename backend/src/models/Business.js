import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["on-campus", "off-campus", "delivery"],
    },
    tags: [
      {
        type: String,
      },
    ],
    location: {
      address: { type: String },
      dormitories: [{ type: String }],
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    description: { type: String, maxLength: 1000 },
    image: [
      {
        url: { type: String, required: true },
        alt: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    hours: {
      openTime: { type: String },
      closeTime: { type: String },
      closedDays: [{ type: String }],
    },
    contact: {
      phone: String,
      telegram: String,
      instagram: String,
      facebook: String,
      twitter: String,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    features: {
      hasDelivery: {
        type: Boolean,
        default: false,
      },
      isGroupFriendly: {
        type: Boolean,
        default: false,
      },
      priceRange: {
        type: String,
        enum: ["$", "$$", "$$$"],
        default: "$$",
      },
    },
    isFeatured: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// This creates the link to the MenuItem model
BusinessSchema.virtual("menuItems", {
  ref: "MenuItem",
  localField: "_id",
  foreignField: "business",
});

BusinessSchema.index({ category: 1, "rating.average": -1 });
BusinessSchema.index({ name: "text", description: "text" });
BusinessSchema.index({ isFeatured: 1, "rating.average": -1 });

// backend/src/models/Business.js

BusinessSchema.pre("save", async function () {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }
});
const Business = mongoose.model("Business", BusinessSchema);
export default Business;
