import { Router, Request, Response } from 'express';
import * as orderController from '../controllers/orderController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post("/:user_uuid", authMiddleware, (req: Request, res: Response) => {
    orderController.createOrder(req, res);
});

router.get("/:id", authMiddleware, (req: Request, res: Response) => {
    orderController.getOrderById(req, res);
});

router.put("/:user_uuid", authMiddleware, (req: Request, res: Response) => {
    orderController.updateOrder(req, res);
});

router.delete("/:user_uuid", authMiddleware, (req: Request, res: Response) => {
    orderController.deleteOrder(req, res);
});


router.get("/user/:user_uuid", authMiddleware, (req: Request, res: Response) => {
    orderController.getOrdersByUser(req, res);
});

export default router;
