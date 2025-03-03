import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes"; 
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes); 

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
