import express from "express";
import { Request, Response } from "express";
import {
  loginUser,
  refreshToken,
  verifyToken,
} from "../controllers/authController";

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  loginUser(req, res);
});

router.post("/refresh-token", async (req: Request, res: Response) => {
  refreshToken(req, res);
});

router.post("/verify-token", async (req: Request, res: Response) => {
  verifyToken(req, res);
});

export default router;
