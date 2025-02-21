import express from "express";
import cors from "cors";
const PORT = process.env.PORT || 3003;

const app = express();

app.use(express.json());
app.use(cors());

// apagar isso depois
app.get("/", (req, res) => {
  res.send("Hello World!s");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
