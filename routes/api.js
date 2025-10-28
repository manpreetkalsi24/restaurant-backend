import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

/*  Menu API  */
router.get("/menu", async (req, res) => {
  const db = req.app.locals.db;
  const menu = await db.collection("menuItems").find({}).toArray();
  res.json(menu);
});

router.get("/menu/:id", async (req, res) => {
  const db = req.app.locals.db;
  const item = await db
    .collection("menuItems")
    .findOne({ _id: new ObjectId(req.params.id) });
  res.json(item || { message: "Item not found" });
});

/* Reservation API  */
router.get("/reservations", async (req, res) => {
  const db = req.app.locals.db;
  const reservations = await db.collection("reservations").find({}).toArray();
  res.json(reservations);
});

router.get("/reservations/:id", async (req, res) => {
  const db = req.app.locals.db;
  const reservation = await db
    .collection("reservations")
    .findOne({ _id: new ObjectId(req.params.id) });
  res.json(reservation || { message: "Reservation not found" });
});

export default router;
