import express from "express";
import { ObjectId } from "mongodb";
const router = express.Router();

// Dashboard page
router.get("/", (req, res) => {
  res.render("admin/dashboard", { title: "Admin Dashboard" });
});

// List all menu items
router.get("/menu", async (req, res) => {
  const db = req.app.locals.db;
  const menu = await db.collection("menuItems").find({}).toArray();
  res.render("admin/menu-list", { title: "Menu List", menu });
});

// Show add menu item form
router.get("/menu/add", (req, res) => {
  res.render("admin/menu-add", { title: "Add Menu Item" });
});

// Add menu item to database
router.post("/menu/add/submit", async (req, res) => {
  const db = req.app.locals.db;
  const newItem = {
    name: req.body.name,
    category: req.body.category,
    price: parseFloat(req.body.price),
    description: req.body.description,
  };
  await db.collection("menuItems").insertOne(newItem);
  console.log("Menu item added");
  res.redirect("/admin/menu");
});

// Show edit menu item form
router.get("/menu/edit", async (req, res) => {
  const db = req.app.locals.db;
  const item = await db
    .collection("menuItems")
    .findOne({ _id: ObjectId.createFromHexString(req.query.itemId) });
  res.render("admin/menu-edit", { title: "Edit Menu Item", editItem: item });
});

// Update menu item
router.post("/menu/edit/submit", async (req, res) => {
  const db = req.app.locals.db;
  const filter = { _id: ObjectId.createFromHexString(req.body.itemId) };
  const updatedItem = {
    name: req.body.name,
    category: req.body.category,
    price: parseFloat(req.body.price),
    description: req.body.description,
  };
  await db.collection("menuItems").updateOne(filter, { $set: updatedItem });
  console.log("Menu item updated");
  res.redirect("/admin/menu");
});

// Delete a menu item
router.get("/menu/delete", async (req, res) => {
  const db = req.app.locals.db;
  await db
    .collection("menuItems")
    .deleteOne({ _id: ObjectId.createFromHexString(req.query.itemId) });
  console.log("Menu item deleted");
  res.redirect("/admin/menu");
});

// List all reservations
router.get("/reservation", async (req, res) => {
  const db = req.app.locals.db;
  const reservations = await db.collection("reservations").find({}).toArray();
  res.render("admin/reservation-list", {
    title: "Reservation List",
    reservations,
  });
});

// Show add reservation form
router.get("/reservation/add", (req, res) => {
  res.render("admin/reservation-add", { title: "Add Reservation" });
});

// Add reservation to database
router.post("/reservation/add/submit", async (req, res) => {
  const db = req.app.locals.db;
  const newRes = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    date: req.body.date,
    time: req.body.time,
    guests: parseInt(req.body.guests),
    message: req.body.message || "",
    createdAt: new Date(),
  };
  await db.collection("reservations").insertOne(newRes);
  console.log("Reservation added");
  res.redirect("/admin/reservation");
});

// Show edit reservation form
router.get("/reservation/edit", async (req, res) => {
  const db = req.app.locals.db;
  const resToEdit = await db
    .collection("reservations")
    .findOne({ _id: ObjectId.createFromHexString(req.query.resId) });
  res.render("admin/reservation-edit", {
    title: "Edit Reservation",
    editRes: resToEdit,
  });
});

// Update reservation
router.post("/reservation/edit/submit", async (req, res) => {
  const db = req.app.locals.db;
  const filter = { _id: ObjectId.createFromHexString(req.body.resId) };
  const updatedRes = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    date: req.body.date,
    time: req.body.time,
    guests: parseInt(req.body.guests),
    message: req.body.message || "",
  };
  await db.collection("reservations").updateOne(filter, { $set: updatedRes });
  console.log("Reservation updated");
  res.redirect("/admin/reservation");
});

// Delete reservation
router.get("/reservation/delete", async (req, res) => {
  const db = req.app.locals.db;
  await db
    .collection("reservations")
    .deleteOne({ _id: ObjectId.createFromHexString(req.query.resId) });
  console.log("Reservation deleted");
  res.redirect("/admin/reservation");
});

export default router;
