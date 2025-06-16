import express from "express";
import * as dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error:
          "Prompt is invalid or too short. It must be a string with at least 5 characters.",
      });
    }

    console.log(`[GeminiRoutes] Received prompt from client: "${prompt}"`);

    const result = await model.generateContent(
      `Generate a detailed description for an image based on this prompt: "${prompt}". Focus on visual elements.`
    );
    const response = await result.response;
    const textOutput = response.text();

    res.status(200).json({ description: textOutput, prompt: prompt });
    console.log(`[GeminiRoutes] Image description generated successfully.`);
  } catch (error) {
    console.error(
      `[GeminiRoutes] An error occurred during Gemini content generation.`
    );
    console.error(`[GeminiRoutes] Full Error Object:`, error);
    console.error(`[GeminiRoutes] Error Message:`, error.message);
    console.error(`[GeminiRoutes] Error Code:`, error.code);
    if (error.response) {
      console.error(
        `[GeminiRoutes] Error Response Status:`,
        error.response.status
      );
      console.error(`[GeminiRoutes] Error Response Data:`, error.response.data);
    }

    let errorMessage = "An unknown error occurred during AI generation.";
    let statusCode = 500;

    if (error.response && error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error.message || errorMessage;
      if (error.response.status) {
        statusCode = error.response.status;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    if (error.status === 429) {
      statusCode = 429;
      errorMessage =
        "Quota Exceeded. Please try again later or check your Google AI Studio usage dashboard.";
    }

    res.status(statusCode).send(errorMessage);
  }
});

export default router;
