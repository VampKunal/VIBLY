
import User from "../models/User.js"
import jwt from "jsonwebtoken";
import matchPassword from "../models/User.js";
import { upsertUser } from "../lib/stream.js";
export async function signup(req, res) {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) {
      return res.status(400).send("All fields are required");
    }
    if( password.length < 6) {
      return res.status(400).send("Password must be at least 6 characters long");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("Invalid email format");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists with this email");
    }   
    const idx = Math.floor(Math.random() * 100)+1;
    const randomAvatar= `https://avatar.iran.liara.run/public/${idx}.png`;
    const newUser = await  User.create({
      fullname,
      email,
      password,
      profilePic: randomAvatar,
    });

   try {
     await upsertUser({
      id: newUser._id.toString(),
      name: newUser.fullname,
      image: newUser.profilePic,
     },
     console.log("User upserted to Stream")
    );
    
   } catch (error) {
      console.error("Error upserting user to Stream:", error);
      return res.status(500).json({
        message: "Failed to create user in Stream",
        error: error.message,
      });
    
   }
    
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "30d" });


    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  sameSite: "strict",
});

    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      user: newUser
    });
  } 
  catch (error) {
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
      return res.status(400).send("Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("User not found");
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).send("Invalid password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Login successful",
      user,
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
     await res.clearCookie("token")
     res.status(200).json({
        message: "Logout successful",
      });
}   
export async function onboard(req, res) {
  try {
      const userId= req.user._id;
      const {
        fullname,
        bio,
        nativeLanguage,
        learningLanguage,
        location
      }=req.body;
      if (!fullname || !bio || !nativeLanguage || !learningLanguage || !location) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const updateUser = await User.findByIdAndUpdate(
        userId,
        {
          ...req.body,
          isOnboarded: true,
        },
        { new: true }
      );

      if(!updateUser) {
        return res.status(404).json({ message: "User not found" });
      }

      try {
        await upsertUser({
        id: updateUser._id.toString(),
        name: updateUser.fullname,
        image: updateUser.profilePic,
      });
        
      } catch (streamError) {
        console.error("Error upserting user to Stream:", error);
        return res.status(500).json({
          message: "Failed to update user in Stream",
          error: error.message,
        });
        
      }

      res.status(200).json({
        message: "User onboarded successfully",
        user: updateUser, 
      });

    
  } catch (error) {
    console.error("Error during onboarding:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
    
  }
  
}