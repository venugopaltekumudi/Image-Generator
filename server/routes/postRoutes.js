import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import Post from "../mongodb/models/post.js";

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET ALL POSTS
router.route("/").get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Fetching posts failed, please try again",
    });
  }
});

// CREATE A POST
router.route("/").post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;

    // 'photo' is now a URL from Pollinations.
    // Cloudinary can upload directly from a URL string!
    const uploadResponse = await cloudinary.uploader.upload(photo, {
      folder: "image_generator", // Optional: organizes your images in Cloudinary
    });

    const newPost = await Post.create({
      name,
      prompt,
      photo: uploadResponse.secure_url, // Use secure_url for https
    });

    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to create a post, please try again",
    });
  }
});

export default router;
