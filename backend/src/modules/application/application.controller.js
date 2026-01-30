import { Application } from "../../models/Application.js";
import Business from "../../models/Business.js";
import mongoose from "mongoose";

//@desc submit business application (public)
//@route
import { parseBody } from "../../utils/parseBody.js";

//@desc submit business application (public)
//@route POST /api/applications
// Helper to process image data
const processImage = (data) => {
  if (data.image && typeof data.image === 'string' && data.image.startsWith('data:image')) {
    // Store Base64 image directly
    return [{
      url: data.image,
      alt: data.name || 'Business image',
      isPrimary: true
    }];
  } else if (data.image && typeof data.image === 'string') {
    // If it's a URL string
    return [{
      url: data.image,
      alt: data.name || 'Business image',
      isPrimary: true
    }];
  }
  return data.image; // Return original if array or undefined
};

export const submitApplication = async (req, res) => {
  try {
    const body = await parseBody(req);

    // Ensure owner is set from auth middleware
    if (!req.user || !req.user._id) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: false, error: "Unauthorized" }));
    }

    // Process Image
    const processedBody = { ...body };
    if (processedBody.image) {
      processedBody.image = processImage(processedBody);
    }

    const application = await Application.create({
      ...processedBody,
      owner: req.user._id,
      status: 'pending' // Default status
    });

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: application,
        message: "Application submitted successfully",
        timestamp: new Date().toISOString(),
      }),
    );
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};

//@desc get current user's applications
//@route GET /api/applications/my-applications
export const getMyApplications = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: false, error: "Unauthorized" }));
    }

    const applications = await Application.find({ owner: req.user._id })
      .populate('businessId')
      .sort({ createdAt: -1 });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: applications,
        timestamp: new Date().toISOString(),
      }),
    );
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};

//@desc update application (for user)
//@route PUT /api/applications/:id
export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const body = await parseBody(req);

    // Find application
    const app = await Application.findById(id);
    if (!app) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: false, error: "Application not found" }));
    }

    // Check ownership
    if (app.owner.toString() !== req.user._id.toString()) {
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: false, error: "Not authorized to update this application" }));
    }

    // Only allow details update if pending or rejected (not approved)
    if (app.status === 'approved') {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: false, error: "Cannot list edits for approved application. Please update the Business directly." }));
    }

    // Process Image
    const processedBody = { ...body };
    if (processedBody.image) {
      processedBody.image = processImage(processedBody);
    }

    // If rejected, allow status reset to pending if user updates it? 
    // Usually yes, or keep it pending. Let's set it to pending on update.
    const updatedApp = await Application.findByIdAndUpdate(
      id,
      {
        ...processedBody,
        status: 'pending', // Reset to pending logic usually applies on re-submission
        reviewedAt: null, // Clear review data
        reviewNotes: null
      },
      { new: true }
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: updatedApp,
        message: "Application updated successfully",
        timestamp: new Date().toISOString(),
      }),
    );
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};

//@desc list all applications for admin
//@route
export const listApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (status) {
      query.status = status;
    }

    const apps = await Application.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: apps,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
        timestamp: new Date().toISOString(),
      }),
    );
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};

//@desc approve application & create business as an admin
//@route
export const approveApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewNotes, businessData } = req.body;

    const app = await Application.findById(id);
    if (!app || app.status !== "pending") {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          success: false,
          error: "Application not found or already processed",
        }),
      );
    }

    // Create the business using Application data + Admin overrides
    const newBusiness = await Business.create({
      name: app.name,
      description: app.description || "",
      // Map Application schema to Business schema
      location: typeof app.location === 'object' ? app.location : { address: app.location },
      image: app.image,
      category: app.category,
      features: app.features,
      contact: app.contact,

      ...businessData, // Admin can override anything here

      isApproved: true, // Auto-approve the created business
      owner: app.owner // Ensure ownership is linked
    });

    //update application status
    app.status = "approved";
    app.reviewNotes = reviewNotes;
    app.reviewedAt = new Date();
    app.businessId = newBusiness._id;
    await app.save();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: { application: app, business: newBusiness },
        message: "Application approved and business created successfully",
        timestamp: new Date().toISOString(),
      }),
    );
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};

//@desc reject application as an admin
//@route
export const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewNotes } = req.body;

    const app = await Application.findByIdAndUpdate(
      id,
      {
        status: "rejected",
        reviewNotes,
        reviewedAt: new Date(),
      },
      { new: true },
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: app,
        message: "Application rejected successfully",
      }),
    );
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};
