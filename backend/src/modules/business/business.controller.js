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
    const response = new ApiResponse(
      200,
      businesses,
      "Businesses fetched successfully",
      {
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    );

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
    const business = await Business.findById(id)
      .populate("menuItems")
      .populate("owner", "name");

    if (!business) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ success: false, message: "Business not found" }),
      );
    }

    const response = new ApiResponse(
      200,
      business,
      "Business fetched successfully",
    );
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

    const response = new ApiResponse(
      200,
      featured,
      "Featured businesses fetched successfully",
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, error: "Failed to fetch featured" }),
    );
  }
};

//@desc 4. get by category
//@route
export const getByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const businesses = await Business.find({ category });

    const response = new ApiResponse(
      200,
      businesses,
      "Businesses by category fetched successfully",
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Category fetch failed" }));
  }
};
//@desc get current user's business
//@route GET /api/businesses/my-business
export const getMyBusiness = async (req, res) => {
  try {
    if (!req.user) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ success: false, message: "Unauthorized" }),
      );
    }

    // Find business owned by current user
    const business = await Business.findOne({ owner: req.user._id })
      .populate("menuItems")
      .populate("owner", "name email");

    if (!business) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ success: false, message: "No business found for this user" }),
      );
    }

    const response = new ApiResponse(
      200,
      business,
      "Business fetched successfully",
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};

//@desc get all businesses owned by current user
//@route GET /api/businesses/my-businesses
export const getMyBusinesses = async (req, res) => {
  try {
    if (!req.user) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ success: false, message: "Unauthorized" }),
      );
    }

    // Find all businesses owned by current user
    const businesses = await Business.find({ owner: req.user._id })
      .populate("menuItems")
      .populate("owner", "name email")
      .sort({ createdAt: -1 }); // Most recent first

    const response = new ApiResponse(
      200,
      businesses,
      "Businesses fetched successfully",
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};


//desc create a business list
//@route POST /api/businesses
export const create = async (req, res) => {
  try {
    const data = { ...req.body };

    // Handle Base64 image (similar to UserProfile avatar)
    if (data.image && typeof data.image === 'string' && data.image.startsWith('data:image')) {
      // Store Base64 image directly
      data.image = [{
        url: data.image,
        alt: data.name || 'Business image',
        isPrimary: true
      }];
    } else if (data.image && typeof data.image === 'string') {
      // If it's a URL string
      data.image = [{
        url: data.image,
        alt: data.name || 'Business image',
        isPrimary: true
      }];
    }

    // Assign the current user as the owner
    if (req.user) {
      data.owner = req.user._id;
    }

    // Set isApproved to false by default (pending approval)
    data.isApproved = false;

    const doc = await Business.create(data);

    // Role upgrade is now handled in the approve controller
    // if (req.user && req.user.role === "user") {
    //   await User.findByIdAndUpdate(req.user._id, { role: "business_owner" });
    // }

    const response = new ApiResponse(201, doc, "Business created successfully. Pending admin approval.");
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};

//@desc approve a business and upgrade owner role
//@route PATCH /api/businesses/:id/approve
export const approve = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check if user is admin (Double check, though middleware should handle this)
    if (!req.user || req.user.role !== 'admin') {
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: false, message: "Not authorized. Admin access required." }));
    }

    // 2. Find business
    const business = await Business.findById(id);
    if (!business) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: false, message: "Business not found" }));
    }

    // 3. Approve business
    business.isApproved = true;
    await business.save();

    // 4. Find owner and upgrade role if they are just a 'user'
    if (business.owner) {
      const owner = await User.findById(business.owner);
      if (owner && owner.role === 'user') {
        owner.role = 'business_owner';
        await owner.save();
        console.log(`User ${owner._id} upgraded to business_owner`);
      }
    }

    const response = new ApiResponse(
      200,
      business,
      "Business approved successfully. Owner role updated."
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));

  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};

//@desc update a business
//@route PUT /api/businesses/:id
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    // Verify ownership
    const existingBusiness = await Business.findById(id);
    if (!existingBusiness) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ success: false, message: "Business not found" }),
      );
    }

    // Only owner or admin can update
    if (req.user && existingBusiness.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ success: false, message: "Not authorized to update this business" }),
      );
    }

    // Handle Base64 image (similar to UserProfile avatar)
    if (data.image && typeof data.image === 'string' && data.image.startsWith('data:image')) {
      // Store Base64 image directly
      data.image = [{
        url: data.image,
        alt: data.name || existingBusiness.name || 'Business image',
        isPrimary: true
      }];
    } else if (data.image && typeof data.image === 'string') {
      // If it's a URL string
      data.image = [{
        url: data.image,
        alt: data.name || existingBusiness.name || 'Business image',
        isPrimary: true
      }];
    }

    const updated = await Business.findByIdAndUpdate(id, data, { new: true });

    const response = new ApiResponse(
      200,
      updated,
      "Business updated successfully",
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};

//@desc delete a business
//@route
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Business.findByIdAndDelete(id);

    const response = new ApiResponse(
      200,
      { deleted: true },
      "Business deleted successfully",
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Failed to delete" }));
  }
};
