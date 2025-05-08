import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import swaggerSpec from "./swagger";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(
    `Documentação Swagger disponível em http://localhost:${port}/docs`
  );
});

export default app;
