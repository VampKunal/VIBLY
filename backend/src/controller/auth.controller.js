import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertUser } from "../lib/stream.js";
import { generateAvatarUrl, normalizeProfilePic } from "../lib/avatar.js";

const isProduction =
  process.env.NODE_ENV === "production" || process.env.RENDER === "true";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  sameSite: isProduction ? "lax" : "strict",
};

async function syncStreamUser(user) {
  try {
    await upsertUser({
      id: user._id.toString(),
      name: user.fullname,
      image: user.profilePic,
    });
  } catch (error) {
    console.error("Stream sync failed (app will still work):", error.message);
  }
}

export async function signup(req, res) {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const profilePic = generateAvatarUrl(fullname, email);
    const newUser = await User.create({
      fullname,
      email,
      password,
      profilePic,
    });

    await syncStreamUser(newUser);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "User created successfully",
      user: normalizeProfilePic(newUser),
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      user: normalizeProfilePic(user),
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function logout(req, res) {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({
    message: "Logout successful",
  });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;
    const { fullname, bio, nativeLanguage, learningLanguage, location, profilePic } = req.body;

    if (!fullname || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const resolvedProfilePic =
      profilePic ||
      req.user.profilePic ||
      generateAvatarUrl(fullname, userId.toString());

    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        fullname,
        bio,
        nativeLanguage,
        learningLanguage,
        location,
        profilePic: resolvedProfilePic,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await syncStreamUser(updateUser);

    res.status(200).json({
      message: "User onboarded successfully",
      user: normalizeProfilePic(updateUser),
    });
  } catch (error) {
    console.error("Error during onboarding:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
