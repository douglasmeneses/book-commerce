import express from "express";
import cors from "cors";
import { setupSwagger } from "./swagger";
import bookRouter from "./routes/bookRouter";
import favoriteRouter from "./routes/favoriteRouter";
import cartRouter from "./routes/cartRouter";
import userRouter from "./routes/userRouter";
import reviewRouter from "./routes/reviewRouter";
import orderRouter from "./routes/orderRouter";
import "./redisClient";

const PORT = process.env.PORT || 3001;

const app = express();

setupSwagger(app);

app.use(express.json());
app.use(cors());

app.use("/orders", orderRouter);
app.use("/books", bookRouter);
app.use("/favorites", favoriteRouter);
app.use("/carts", cartRouter);
app.use("/users", userRouter);
app.use("/reviews", reviewRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(
    `Swagger documentation is running on http://localhost:${PORT}/api-docs`
  );
});
