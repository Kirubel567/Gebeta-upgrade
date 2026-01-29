import { User } from "../../models/User.js";
import { parseBody } from "../../utils/parseBody.js";
import { signToken } from "../../utils/jwt.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import logger from "../../utils/logger.js";

//@desc register a new user
//@route POST /api/users/register
export const register = async (req, res) => {
    logger.info("Register controller hit - start");

    // Get body (middleware already parsed it, utility bridges it)
    const body = await parseBody(req);
    logger.info("Body parsed", { bodyKeys: Object.keys(body) });

    const role = "user";
    const { name, email, password, university, dormitory, yearOfStudy } = body;

    if (!name || !email || !password) {
        throw new ApiError(400, "Please provide name, email and password");
    }

    // 2. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    logger.info("Creating user in DB...");
    // Create user
    try {
        const newUser = await User.create({
            name,
            email,
            passwordHash,
            university,
            dormitory,
            yearOfStudy,
            role
        });
        logger.info("User created successfully", { userId: newUser._id });

        // Generate Token
        const token = signToken({ id: newUser._id.toString(), role: newUser.role });

        // Send Response
        const userResponse = newUser.toObject();
        delete userResponse.passwordHash;

        const response = new ApiResponse(201, { user: userResponse, token }, "User registered successfully");

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));

    } catch (dbError) {
        logger.error("Database error during user creation", dbError);
        throw dbError;
    }
};

//@desc login user
//@route POST /api/users/login
export const login = async (req, res) => {
    logger.info("Login controller hit");
    const { email, password } = await parseBody(req);

    if (!email || !password) {
        throw new ApiError(400, "Please provide email and password");
    }

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    // 3. Generate Token
    const token = signToken({ id: user._id.toString(), role: user.role });

    // 4. Send Response
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    const response = new ApiResponse(200, { user: userResponse, token }, "Login successful");

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
};

//@desc get user profile
//@route GET /api/users/me
export const getProfile = async (req, res) => {
    // The user is already attached to req by the authMiddleware
    if (!req.user) {
        throw new ApiError(401, "Not authorized");
    }

    const user = req.user.toObject();
    delete user.passwordHash;

    const response = new ApiResponse(200, user, "User profile");

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
};

//@desc update user profile
//@route PUT /api/users/me
export const updateProfile = async (req, res) => {
    const userId = req.user._id;
    const body = await parseBody(req);

    const allowedUpdates = [
        "name",
        "university",
        "dormitory",
        "yearOfStudy",
        "avatar",
        "description"
    ];

    const updates = {};
    Object.keys(body).forEach(key => {
        if (allowedUpdates.includes(key)) {
            updates[key] = body[key];
        }
    });

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    const response = new ApiResponse(200, updatedUser, "Profile updated successfully");

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
};


//@desc logging out 
// @route POST /api/users/logout
export const logout = async (req, res) => {
   
    const response = new ApiResponse(200, null, "Logged out successfully");

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
};

//@desc make a user an admin
//@route POST /api/admin/make-admin
export const makeAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    //first find the user 
    const user = await User.findOne({_id: userId}); 

    //check if the user already exists or if it is already an admin
    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "User not found" }));
    }
    
    if (user.role == "admin") {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          success: false,
          message: "the user is already an admin",
        }),
      );
    }
    //first find the user and update it
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "admin" },
      { new: true },
    ).select("-passwordHash");

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        user: updatedUser,
        message: `${updatedUser.name} is now an admin`,
      }),
    );
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
    );
  }
};


