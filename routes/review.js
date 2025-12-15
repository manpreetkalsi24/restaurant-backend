import express from "express";

const router = express.Router();

// Submit a review
router.post("/", async (req, res) => {
  const db = req.app.locals.db;

  const review = {
    name: req.body.name,
    rating: parseInt(req.body.rating),
    message: req.body.message,
    isPublished: false,
    createdAt: new Date(),
  };

  await db.collection("reviews").insertOne(review);
  res.status(201).json({ message: "Review submitted for approval" });
});

// Get published reviews
router.get("/", async (req, res) => {
  const db = req.app.locals.db;

  const reviews = await db
    .collection("reviews")
    .find({ isPublished: true })
    .sort({ createdAt: -1 })
    .toArray();

  res.json(reviews);
});

export default router;
