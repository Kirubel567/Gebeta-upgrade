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
     menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: false, 
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
reviewSchema.index({ business: 1, menuItem: 1, user: 1 }, { unique: true });

// Updated Static method to calculate avg rating for either Business or MenuItem
reviewSchema.statics.calculateAverageRating = async function (id, targetType) {
    // Determine which field to match based on targetType ('business' or 'menuItem')
    const matchField = targetType === 'business' ? { business: id } : { menuItem: id };

    const obj = await this.aggregate([
        {
            $match: matchField,
        },
        {
            $group: {
                _id: null, // We just need the average of the matched group
                averageRating: { $avg: "$rating" },
                count: { $sum: 1 },
            },
        },
    ]);

    try {
        // Get the correct model dynamically
        const ModelName = targetType === 'business' ? "Business" : "MenuItem";
        const TargetModel = mongoose.model(ModelName);

        if (obj.length > 0) {
            await TargetModel.findByIdAndUpdate(id, {
                "rating.average": Math.round(obj[0].averageRating * 10) / 10,
                "rating.count": obj[0].count,
            });
        } else {
            // Reset if no reviews left
            await TargetModel.findByIdAndUpdate(id, {
                "rating.average": 0,
                "rating.count": 0,
            });
        }
    } catch (err) {
        console.error(`Error updating ${targetType} rating:`, err);
    }
};

// Middleware: Call calculateAverageRating after save
reviewSchema.post("save", function () {
    // If menuItem exists, calculate for menu item. Otherwise, calculate for business.
    if (this.menuItem) {
        this.constructor.calculateAverageRating(this.menuItem, 'menuItem');
    } else if (this.business) {
        this.constructor.calculateAverageRating(this.business, 'business');
    }
});

// Middleware: Handle updates and deletions
reviewSchema.post(/^findOneAnd/, async function (doc) {
    if (doc) {
        if (doc.menuItem) {
            await doc.constructor.calculateAverageRating(doc.menuItem, 'menuItem');
        } else if (doc.business) {
            await doc.constructor.calculateAverageRating(doc.business, 'business');
        }
    }
});

export const Review = mongoose.model("Review", reviewSchema);
