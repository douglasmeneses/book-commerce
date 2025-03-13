import { Router, Request, Response } from "express";
import userController from "../controllers/userController";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  userController.register(req, res);
});
router.post("/login", (req: Request, res: Response) => {
    userController.login(req, res);
})
router.get("/:uuid", (req: Request, res: Response) => {
    userController.getProfile(req, res)
})
router.put("/:uuid", (req: Request, res: Response) =>{
    userController.updateProfile(req, res)
})
router.get("/:uuid", (req: Request, res: Response) => {
    userController.deleteProfile(req, res)
})

export default router;
