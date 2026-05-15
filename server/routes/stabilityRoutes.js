import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ message: "Prompt is required" });

    // Use Pollinations AI (Free, no balance required)
    const encodedPrompt = encodeURIComponent(prompt.trim());
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=512&height=512&seed=${seed}&nologo=true`;

    const response = await fetch(imageUrl);

    if (!response.ok)
      return res.status(500).json({ message: "AI provider error" });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    // Return the full data URI
    return res.status(200).json({ photo: `data:image/jpeg;base64,${base64}` });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ message: "Generation failed" });
  }
});

export default router;
