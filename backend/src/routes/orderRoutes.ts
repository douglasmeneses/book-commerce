import { Router, Request, Response } from 'express';
import * as orderController from '../controllers/orderController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();


router.post("/", authMiddleware, (req: Request, res: Response) => {
    orderController.createOrder(req, res)
})

router.get("/:uuid", authMiddleware, (req: Request, res: Response) => {
    orderController.getOrderById(req, res)
})

router.put("/:uuid", authMiddleware, (req: Request, res: Response) => {
    orderController.updateOrder(req, res)
})


router.delete("/:uuid", authMiddleware, (req: Request, res: Response) => {
    orderController.deleteOrder(req, res)
})


export default router;
