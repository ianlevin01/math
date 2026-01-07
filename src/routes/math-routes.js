import { Router } from "express";
import multer from "multer";
import { solveMathProblem } from "../ai/solveMathProblem.js";
import {
  saveConversation,
  listChats,
  getConversation,
} from "../services/chatService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /math
 * body:
 * - email
 * - problem
 */
router.post("/", authMiddleware,upload.single("image"), async (req, res) => {
  try {
    const problem = req.body.problem;
    const imageFile = req.file || null;
    const email = req.user.email

    if (!email) {
      return res.status(400).json({ error: "EMAIL_REQUIRED" });
    }

    if (!problem || typeof problem !== "string") {
      return res.status(400).json({ error: "INVALID_PROBLEM" });
    }

    const result = await solveMathProblem(problem, imageFile);

    const chat = await saveConversation({
      email,
      problem,
      answer: result.answerText ?? JSON.stringify(result),
    });

    return res.status(200).json({
      ...result,
      chat,
    });

  } catch (error) {
    console.error("Error en /math:", error);
    return res.status(500).json({ error: "SOLVER_ERROR" });
  }
});

/**
 * GET /math/chats?email=...
 */
router.get("/chats", authMiddleware,async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "EMAIL_REQUIRED" });
    }

    const chats = await listChats(email);

    res.json(
      chats.map(c => ({
        chatId: c.chatId,
        title: c.title,
        createdAt: c.createdAt,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "GET_CHATS_ERROR" });
  }
});

/**
 * GET /math/chat/:chatId
 */
router.get("/chat/:chatId", authMiddleware,async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await getConversation(chatId);
    res.json({ chatId, messages });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "GET_CHAT_ERROR" });
  }
});

export default router;
