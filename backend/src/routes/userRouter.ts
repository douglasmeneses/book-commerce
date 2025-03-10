import { Router } from "express";
import userController from "../controllers/userController";

const router = Router();

router.post("/", userController.register);
router.post("/login", userController.login);
router.get("/:uuid", userController.getProfile); 
router.put("/:uuid", userController.updateProfile); 
router.delete("/:uuid", userController.deleteProfile); 

export default router;
