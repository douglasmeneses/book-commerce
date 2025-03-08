import { Router } from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware"; 

const router = Router();

router.post("/", userController.register);
router.post("/login", userController.login);
router.get("/:uuid", authMiddleware, userController.getProfile);
router.put("/:uuid", authMiddleware, userController.updateProfile);
router.delete("/:uuid", authMiddleware, userController.deleteProfile);

export default router;
