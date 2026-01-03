import { Router } from "express";
import { solveMathProblem } from "../ai/solveMathProblem.js";

const router = Router();

/**
 * POST /solve
 * Body:
 * {
 *   "problem": "Maximizar f(x,y)=x^2+y^2 en el disco x^2+y^2 <= 1"
 * }
 *
 * Response:
 * JSON estructurado para explicación + Plotly
 */
router.post("/", async (req, res) => {
  try {
    const { problem } = req.body;

    if (!problem || typeof problem !== "string") {
      return res.status(400).json({
        error: "INVALID_PROBLEM"
      });
    }

    const result = await solveMathProblem(problem);

    // 🔐 Siempre devolver JSON válido
    console.log(result)
    return res.status(200).json(result);

  } catch (error) {
    console.error("Error en /solve:", error);
    return res.status(500).json({
      error: "SOLVER_ERROR"
    });
  }
});

export default router;
