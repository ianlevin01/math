import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mathRoutes from "./routes/math-routes.js";

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

// Server
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
