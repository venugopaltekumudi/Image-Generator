import express from "express";
import * as dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    const encodedPrompt = encodeURIComponent(prompt.trim());
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=512&height=512&seed=${seed}&nologo=true`;

    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("AI provider error");

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    // Important: Include the full data URI prefix
    res.status(200).json({ photo: `data:image/jpeg;base64,${base64}` });
  } catch (error) {
    res.status(500).json({ message: "Generation failed" });
  }
});

export default router;
