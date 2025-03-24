import express from "express";
import cors from "cors";
import bookRouter from "./routes/bookRouter";
import favoriteRouter from "./routes/favoriteRouter";
import cartRouter from "./routes/cartRouter";
import userRouter from "./routes/userRouter";

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/books", bookRouter);
app.use("/favorites", favoriteRouter);
app.use("/carts", cartRouter);
app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});