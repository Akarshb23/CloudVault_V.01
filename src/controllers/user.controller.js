import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadCloudinary } from "../config/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {

    const { fullName, email, userName, password } = req.body;

    // Validation
    if (
        [fullName, email, userName, password].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // Check existing user
    const existedUser = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    username: userName.toLowerCase(),
                },
                {
                    email,
                },
            ],
        },
    });

    if (existedUser) {
        throw new ApiError(
            409,
            "Username or email already exists"
        );
    }

    // Avatar
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    // Cover Image
    const coverImageLocalPath =
        req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(
            400,
            "Avatar is required"
        );
    }

    // Upload avatar
    const avatar = await uploadCloudinary(
        avatarLocalPath
    );

    if (!avatar) {
        throw new ApiError(
            500,
            "Avatar upload failed"
        );
    }

    // Upload cover image
    let coverImage = null;

    if (coverImageLocalPath) {
        coverImage = await uploadCloudinary(
            coverImageLocalPath
        );
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    // Create User
    const user = await prisma.user.create({
        data: {
            fullName,
            username: userName.toLowerCase(),
            email,
            password: hashedPassword,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
        },
    });

    // Fetch user without password
    const createdUser = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
        select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
            avatar: true,
            coverImage: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;

    if (
        [userName, password].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // Find user
    const user = await prisma.user.findUnique({
        where: {
            username: userName.toLowerCase(),
        },
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Remove password before sending response
    const { password: _, ...loggedInUser } = user;

    return res.status(200).json(
        new ApiResponse(
            200,
            loggedInUser,
            "User logged in successfully"
        )
    );
});
export { registerUser , loginUser };