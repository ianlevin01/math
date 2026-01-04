import { Router } from "express";
import multer from "multer";
import { solveMathProblem } from "../ai/solveMathProblem.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /math
 * multipart/form-data
 * - problem: string
 * - image?: file
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { problem } = req.body;
    const imageFile = req.file || null;

    if (!problem || typeof problem !== "string") {
      return res.status(400).json({ error: "INVALID_PROBLEM" });
    }

    const result = await solveMathProblem(problem, imageFile);
    console.log(result)
    return res.status(200).json(result);

  } catch (error) {
    console.error("Error en /math:", error);
    return res.status(500).json({ error: "SOLVER_ERROR" });
  }
});

export default router;
