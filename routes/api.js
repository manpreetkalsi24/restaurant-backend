import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all menu items
router.get("/menu", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const menu = await db.collection("menuItems").find({}).toArray();
    res.json(menu);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ message: "Error fetching menu items" });
  }
});

// Add new menu item
router.post("/menu", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const newItem = {
      name: req.body.name,
      category: req.body.category,
      price: parseFloat(req.body.price),
      description: req.body.description,
      createdAt: new Date(),
    };
    await db.collection("menuItems").insertOne(newItem);
    res.status(201).json({ message: "Menu item added successfully" });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ message: "Error adding menu item" });
  }
});

// Get all reservations
router.get("/reservations", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const reservations = await db.collection("reservations").find({}).toArray();
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Error fetching reservations" });
  }
});

// Add new reservation
router.post("/reservations", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const newReservation = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      date: req.body.date,
      time: req.body.time,
      guests: parseInt(req.body.guests),
      message: req.body.message || "",
      createdAt: new Date(),
    };
    await db.collection("reservations").insertOne(newReservation);
    res.status(201).json({ message: "Reservation created successfully" });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: "Error creating reservation" });
  }
});

// Get a single reservation by ID
router.get("/reservations/:id", async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid reservation ID" });
    }
    const reservation = await db
      .collection("reservations")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.json(reservation);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({ message: "Error fetching reservation" });
  }
});

// Delete a reservation by ID
router.delete("/reservations/:id", async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid reservation ID" });
    }
    await db
      .collection("reservations")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ message: "Error deleting reservation" });
  }
});

export default router;
