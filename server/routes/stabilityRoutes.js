// server/routes/stabilityRoutes.js
import express from "express";
import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const router = express.Router();

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from Stability AI!" });
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res
        .status(400)
        .json({ message: "Prompt must be a non-empty string" });
    }

    console.log("Calling Stability AI with prompt:", prompt);

    const response = await axios.post(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const imageBase64 = response.data.artifacts?.[0]?.base64;

    if (!imageBase64) {
      return res.status(500).json({ message: "Image generation failed" });
    }

    res.status(200).json({ photo: imageBase64 });
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      error.message ||
      "Unknown error";

    console.error("Stability AI Error:", message);

    res.status(500).json({
      message: "Image generation failed",
      error: message,
    });
  }
});

export default router;
