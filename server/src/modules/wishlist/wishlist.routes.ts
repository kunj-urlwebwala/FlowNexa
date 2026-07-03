import { Router } from "express";
import { wishlistController } from "./wishlist.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { addWishlistItemSchema, removeWishlistItemSchema } from "./wishlist.dto";

const router = Router();

// All wishlist routes require authentication
router.use(authMiddleware);

router.get("/", wishlistController.getWishlist);
router.get("/check", wishlistController.checkItem);
router.post("/", validateRequest(addWishlistItemSchema), wishlistController.addItem);
router.delete("/:itemId", validateRequest(removeWishlistItemSchema), wishlistController.removeItem);

export default router;
