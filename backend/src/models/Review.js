import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please add a rating between 1 and 5"],
    },
    // Changed from 'comment' to 'body' to match API.md
    body: {
      type: String,
      required: [true, "Please add a review text"],
      trim: true,
      maxLength: 500,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // New fields from API.md Data Models
    helpfulCount: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: true, // Auto-approve by default, change if you need moderation
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    images: [{
      url: String,
      caption: String
    }]
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per business
reviewSchema.index({ business: 1, user: 1 }, { unique: true });

// Static method to calculate avg rating
reviewSchema.statics.calculateAverageRating = async function (businessId) {
    const obj = await this.aggregate([
        {
            $match: { business: businessId },
        },
        {
            $group: {
                _id: "$business",
                averageRating: { $avg: "$rating" },
                count: { $sum: 1 },
            },
        },
    ]);

    try {
        // Dynamic import to avoid circular dependency issues if Business imports Review later
        // Logic: Update the business
        const Business = mongoose.model("Business");

        if (obj.length > 0) {
            await Business.findByIdAndUpdate(businessId, {
                "rating.average": Math.round(obj[0].averageRating * 10) / 10, // round to 1 decimal
                "rating.count": obj[0].count,
            });
        } else {
            // Reset if no reviews left
            await Business.findByIdAndUpdate(businessId, {
                "rating.average": 0,
                "rating.count": 0,
            });
        }
    } catch (err) {
        console.error(err);
    }
};

// Call calculateAverageRating after save
reviewSchema.post("save", function () {
    this.constructor.calculateAverageRating(this.business);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.business);
  }
})

export const Review = mongoose.model("Review", reviewSchema);
