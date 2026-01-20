import { Application } from "../../models/Application.js";
import Business from "../../models/Business.js";
import mongoose from "mongoose";

//@desc submit business application (public)
//@route
export const submitApplication = async (req, res) => {
  try {
    const application = await Application.create(req.body);

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

    //create the business
    const newBusiness = await Business.create({
      name: app.name,
      description: app.description || "",
      location: { address: app.location },
      ...businessData, //additional business data from admin
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
