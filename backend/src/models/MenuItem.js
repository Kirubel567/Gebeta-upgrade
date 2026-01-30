import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "ETB",
    },

    category: {
      type: String, //main, breakfast, fasting...
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],

    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

menuItemSchema.index({ business: 1, category: 1 });
menuItemSchema.index({ business: 1, isPopular: -1 });

menuItemSchema.index({ name: 1, business: 1 }, { unique: true });

export const MenuItem = mongoose.model("MenuItem", menuItemSchema);
