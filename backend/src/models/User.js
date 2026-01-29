import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },

    //university info
    university: {
      type: String,
      default: "AAU",
    },
    dormitory: {
      type: String,
    },
    yearOfStudy: {
      type: String,
    },
    description: {
      type: String,
      default: "",
    },
    followers:{
      type: String,
      default: "",
    },
    following:{
      type: String,
      default: "",
    },

    //roles and status
    role: {
      type: String,
      enum: ["user", "admin", "business_owner", "super_admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    //time stamps
    createdAt: {
      type: Date,
      default: Date.now(),
    },

    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJson: { virtuals: true },
  }
);

//use virtuals for review count
userSchema.virtual("reviewCount", {
  ref: "Review",
  localField: "_id",
  foreignField: "user",
  count: true,
});

userSchema.index({ email: 1 });
userSchema.index({ university: 1, dormitory: 1 });

export const User = mongoose.model("User", userSchema);
