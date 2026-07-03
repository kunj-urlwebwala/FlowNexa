import { z } from "zod";

export const addWishlistItemSchema = z.object({
  body: z.object({
    productId: z.string().uuid("Invalid product ID"),
  }),
});

export const removeWishlistItemSchema = z.object({
  params: z.object({
    itemId: z.string().uuid("Invalid wishlist item ID"),
  }),
});
