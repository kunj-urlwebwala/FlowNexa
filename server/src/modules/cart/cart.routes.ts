import { Router } from "express";
import { cartController } from "./cart.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { addItemSchema, updateItemSchema, removeItemSchema } from "./cart.dto";

const router = Router();

// All cart routes require authentication
router.use(authMiddleware);

router.get("/", cartController.getCart);
router.post("/items", validateRequest(addItemSchema), cartController.addItem);
router.patch("/items/:itemId", validateRequest(updateItemSchema), cartController.updateItem);
router.delete("/items/:itemId", validateRequest(removeItemSchema), cartController.removeItem);
router.delete("/", cartController.clearCart);

export default router;
