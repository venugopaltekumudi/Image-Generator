// import express from "express";
// import * as dotenv from "dotenv";
// import OpenAI from "openai";
// import cors from "cors";

// dotenv.config();

// const router = express.Router();

// // Apply CORS middleware to this router (still good to have)
// router.use(cors());

// // <--- ADD THIS EXPLICIT OPTIONS HANDLER --->
// // This ensures that OPTIONS requests (preflight requests) receive a 200 OK response.
// router.options("/", cors());
// // <------------------------------------------>

// // Initialize OpenAI with the new syntax
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// router.route("/").get((req, res) => {
//   res.status(200).json({ message: "Hello from DALL-E!" });
// });

// router.route("/").post(async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Prompt is required" });
//     }

//     console.log(`[DalleRoutes] Received prompt for DALL-E: "${prompt}"`);

//     const aiResponse = await openai.images.generate({
//       model: "dall-e-3",
//       prompt,
//       n: 1,
//       size: "1024x1024",
//       response_format: "b64_json",
//     });

//     const image = aiResponse.data.data[0].b64_json;
//     res.status(200).json({ photo: image });
//     console.log(`[DalleRoutes] DALL-E image generated successfully.`);
//   } catch (error) {
//     console.error(`[DalleRoutes] Error generating DALL-E image:`, error);

//     if (error instanceof OpenAI.APIError) {
//       console.error(`[DalleRoutes] OpenAI API Status: ${error.status}`);
//       console.error(`[DalleRoutes] OpenAI API Message: ${error.message}`);
//       console.error(`[DalleRoutes] OpenAI API Code: ${error.code}`);
//       return res.status(error.status).send(error.message);
//     } else {
//       console.error(`[DalleRoutes] Generic Error:`, error.message);
//       return res.status(500).send("Something went wrong with image generation");
//     }
//   }
// });

// export default router;
// server/routes/dalleRoutes.js
// server/routes/dalleRoutes.js
// server/routes/dalleRoutes.js
import express from "express";
import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate prompt
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required and must be a non-empty string",
      });
    }

    console.log("Calling DALL·E with prompt:", prompt);

    const response = await openai.images.generate({
      model: "dall-e-3", // or "dall-e-2" if you don't have access to 3
      prompt: prompt.trim(),
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const image = response.data[0].b64_json;
    res.status(200).json({ photo: image });

  } catch (error) {
    console.error("DALL-E Error:", error);

    const errorMessage = error?.error?.message || "Unknown error";
    res.status(500).json({
      success: false,
      message: `Image generation failed: ${errorMessage}`,
    });
  }
});

export default router;
