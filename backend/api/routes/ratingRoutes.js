import express from "express";

import { requireAuth } from "../middlewares/requireAuth.js";
import { postRating } from "../controllers/ratingController.js";

const router = express.Router();

router.post("/:id/ratings", requireAuth, postRating);

export default router;