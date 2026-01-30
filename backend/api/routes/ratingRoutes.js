import express from "express";

import { requireAuth } from "../middlewares/requireAuth.js";
import {
  postRating,
  getRating,
  getRatingSent,
} from "../controllers/ratingController.js";

const router = express.Router();

router.post("/:id/ratings", requireAuth, postRating);
router.get("/:id/ratings", requireAuth, getRating);
router.get("/:id/ratings/sent", requireAuth, getRatingSent)
export default router;
