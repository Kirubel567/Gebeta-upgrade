import { Review } from "../../models/Review.js";
import Business from "../../models/Business.js";
import { parseBody } from "../../utils/parseBody.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

// @desc Add a new review
// @route POST /api/reviews
export const addReview = async (req, res) => {
  try {
    // Get user from auth (req.user)
    if (!req.user) {
      throw new ApiError(401, "Not authorized");
    }

    const { rating, body, businessId, menuItem } = req.body;
    const userId = req.user.id; // Assuming you have auth middleware

    if (!businessId || !rating || !body) {
      throw new ApiError(400, "Please provide businessId, rating, and body");
    }

    // Check if business exists
    const business = await Business.findById(businessId);
    if (!business) {
      throw new ApiError(404, "Business not found");
    }

    // 1. Check if user already reviewed this specific target
    const query = { user: userId, business: businessId, menuItem: menuItem || null };

    const existingReview = await Review.findOne(query);
    if (existingReview) {
      return res.status(400).json({
        message: `You have already reviewed this ${menuItem ? "item" : "business"}.`,
      });
    }

    // 2. Create the review
    const review = await Review.create({
      rating,
      body,
      business: businessId,
      menuItem: menuItem || null, // This will be undefined if not provided, which is fine
      user: userId,
    });

    const response = new ApiResponse(201, review, "Review added successfully");
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.code === 11000) {
      throw new ApiError(400, "Duplicate review detected.");
    }
    throw new ApiError(500, err.message || "Failed to add review");
  }
};

// @desc Get reviews for a business
// @route GET /api/reviews/:businessId
export const getReviews = async (req, res) => {
  try {
    const { businessId } = req.params;

    const reviews = await Review.find({ business: businessId })
      .populate("user", "name avatar") // Populate reviewer name/avatar
      .sort("-createdAt"); // Newest first

    const response = new ApiResponse(
      200,
      reviews,
      "Reviews fetched successfully",
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (error) {
    throw new ApiError(500, "Failed to fetch reviews");
  }
};

//@desc update my review
// @route PUT /api/reviews/:reviewId
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const reqBody = await parseBody(req);
    const { rating, body } = reqBody;

    if (!rating || !body) {
      throw new ApiError(400, "Please provide rating and body");
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        rating,
        body,
      },
      { new: true },
    );

    const response = new ApiResponse(
      200,
      review,
      "Review updated successfully",
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (error) {
    throw new ApiError(500, "Failed to update review");
  }
};

// @desc Get reviews by user ID
// @route GET /api/reviews/user/:userId
export const getReviewsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ user: userId })
      .populate("business", "name category location") // Populate business details
      .sort("-createdAt"); // Newest first

    const response = new ApiResponse(
      200,
      reviews,
      "User reviews fetched successfully",
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (error) {
    throw new ApiError(500, "Failed to fetch user reviews");
  }
};
