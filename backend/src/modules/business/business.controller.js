import Business from "../../models/Business.js";
import { User } from "../../models/User.js";
import mongoose from "mongoose";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

//@desc get all businesses with search and category filter
//@route GET
export const getAll = async (req, res) => {
  try {
    // 1. Use req.query (already parsed by your Router)
    // We use || to provide defaults if the user doesn't send them
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;

    // 2. Calculate skip clearly
    const skip = (page - 1) * limit;

    const category = req.query?.category;
    const search = req.query?.search;
    const sort = req.query?.sort;

    let query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };

    let sortOption = {};
    if (sort === "rating") sortOption = { "rating.average": -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };
    else if (sort === "name") sortOption = { name: 1 };

    // 3. Database operation
    const businesses = await Business.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Business.countDocuments(query);

    // Use standardized ApiResponse format
    const response = new ApiResponse(200, businesses, "Businesses fetched successfully", {
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (err) {
    // This catches the "skip is not defined" error if it happens
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};

//@desc 2. get businesses by id
//@route GET
export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Invalid ID format" }));
    }
    // .populate('reviews') can be added later once reviews are built
    const business = await Business.findById(id);

    if (!business) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: false, message: "Business not found" }));
    }

    const response = new ApiResponse(200, business, "Business fetched successfully");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Invalid ID" }));
  }
};

//@desc 3. get featured businesses
//@route
export const getFeatured = async (req, res) => {
  try {
    //so featured section for those with the highes ratings
    const featured = await Business.find({ isFeatured: true })
      .sort({ "rating.average": -1 })
      .limit(5);

    const response = new ApiResponse(200, featured, "Featured businesses fetched successfully");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Failed to fetch featured" }));
  }
};

//@desc 4. get by category
//@route
export const getByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const businesses = await Business.find({ category });

    const response = new ApiResponse(200, businesses, "Businesses by category fetched successfully");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Category fetch failed" }));
  }
};
//desc create a business list
//@route
export const create = async (req, res) => {
  try {
    const data = req.body;

    // Assign the current user as the owner
    // if (req.user) {
    //   data.owner = req.user._id;
    // }

    const doc = await Business.create(data);

    // Upgrade user role to business_owner if they are a standard user
    if (req.user && req.user.role === "user") {
      await User.findByIdAndUpdate(req.user._id, { role: "business_owner" });
    }

    const response = new ApiResponse(201, doc, "Business created successfully");
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};

//@desc update a business
//@route
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await Business.findByIdAndUpdate(id, data, { new: true });

    const response = new ApiResponse(200, updated, "Business updated successfully");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Failed to update" }));
  }
};
//@desc delete a business
//@route
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Business.findByIdAndDelete(id);

    const response = new ApiResponse(200, { deleted: true }, "Business deleted successfully");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Failed to delete" }));
  }
};
