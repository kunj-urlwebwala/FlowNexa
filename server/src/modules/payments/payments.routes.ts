import { Router } from "express";
import { paymentsController } from "./payments.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/create-intent", paymentsController.createIntent);

export default router;
