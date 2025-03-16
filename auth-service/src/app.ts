import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

export default app;
