// chatService.js
import {
  createChat,
  addMessage,
  getUserChats,
  getChatMessages,
} from "../repositories/chatRepository.js";

export async function saveConversation({
  email,
  problem,
  answer,
}) {
  if (!email) throw new Error("EMAIL_REQUIRED");

  const chatId = new Date().toISOString();

  // 🔹 TÍTULO HARDCODEADO (por ahora)
  const title = "Consulta matemática";

  await createChat({ email, chatId, title });

  await addMessage({
    chatId,
    role: "user",
    content: problem,
    index: 1,
  });

  await addMessage({
    chatId,
    role: "assistant",
    content: answer,
    index: 2,
  });

  return { chatId, title };
}

export async function listChats(email) {
  if (!email) throw new Error("EMAIL_REQUIRED");
  return getUserChats(email);
}

export async function getConversation(chatId) {
  return getChatMessages(chatId);
}
