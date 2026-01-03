import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mathRoutes from "./routes/math-routes.js";
import authRoutes from "./routes/auth-routes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Health check
app.get("/health", (_, res) => {
  res.send("OK");
});

// Rutas
app.use("/math", mathRoutes);
app.use("/auth", authRoutes);

// Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

