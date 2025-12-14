import express from "express";
import { ObjectId } from "mongodb";
import multer from "multer";
import path from "path";

// Configure multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const router = express.Router();

// Render admin dashboard with counts
router.get("/", async (req, res) => {
  const db = req.app.locals.db;

  const menuCount = await db.collection("menuItems").countDocuments();
  const reservationCount = await db.collection("reservations").countDocuments();
  const contactCount = await db.collection("contacts").countDocuments();

  res.render("admin/dashboard", {
    title: "Admin Dashboard",
    menuCount,
    reservationCount,
    contactCount,
  });
});

// Display all menu items
router.get("/menu", async (req, res) => {
  const db = req.app.locals.db;
  const menu = await db.collection("menuItems").find({}).toArray();
  res.render("admin/menu-list", { title: "Menu List", menu });
});

// Show add menu item form
router.get("/menu/add", (req, res) => {
  res.render("admin/menu-add", { title: "Add Menu Item" });
});

// Handle add menu item form submission
router.post("/menu/add/submit", upload.single("image"), async (req, res) => {
  const db = req.app.locals.db;

  const newItem = {
    name: req.body.name,
    price: parseFloat(req.body.price),
    description: req.body.description,
    image: req.file ? `/uploads/${req.file.filename}` : "",
  };

  await db.collection("menuItems").insertOne(newItem);
  res.redirect("/admin/menu");
});

// Show edit menu item form
router.get("/menu/edit/:id", async (req, res) => {
  const db = req.app.locals.db;

  const item = await db
    .collection("menuItems")
    .findOne({ _id: new ObjectId(req.params.id) });

  res.render("admin/menu-edit", {
    title: "Edit Menu Item",
    menu: item,
  });
});

// Handle edit menu item submission
router.post("/menu/edit/:id", upload.single("image"), async (req, res) => {
  const db = req.app.locals.db;

  const filter = { _id: new ObjectId(req.params.id) };
  const existingItem = await db.collection("menuItems").findOne(filter);

  const updatedItem = {
    name: req.body.name,
    price: parseFloat(req.body.price),
    description: req.body.description,
    image: req.file
      ? `/uploads/${req.file.filename}`
      : existingItem.image,
  };

  await db.collection("menuItems").updateOne(filter, { $set: updatedItem });
  res.redirect("/admin/menu");
});

// Delete a menu item
router.get("/menu/delete/:id", async (req, res) => {
  const db = req.app.locals.db;

  await db
    .collection("menuItems")
    .deleteOne({ _id: new ObjectId(req.params.id) });

  res.redirect("/admin/menu");
});

// Display all reservations
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

// Handle add reservation submission
router.post("/reservation/add/submit", async (req, res) => {
  const db = req.app.locals.db;

  const newRes = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    date: req.body.date,
    time: req.body.time,
    guests: parseInt(req.body.guests),
    message: req.body.message,
  };

  await db.collection("reservations").insertOne(newRes);
  res.redirect("/admin/reservation");
});

// Show edit reservation form
router.get("/reservation/edit/:id", async (req, res) => {
  const db = req.app.locals.db;

  const resToEdit = await db
    .collection("reservations")
    .findOne({ _id: new ObjectId(req.params.id) });

  res.render("admin/reservation-edit", {
    title: "Edit Reservation",
    editRes: resToEdit,
  });
});

// Handle edit reservation submission
router.post("/reservation/edit/:id", async (req, res) => {
  const db = req.app.locals.db;

  const updatedRes = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    date: req.body.date,
    time: req.body.time,
    guests: parseInt(req.body.guests),
    message: req.body.message,
  };

  await db
    .collection("reservations")
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedRes }
    );

  res.redirect("/admin/reservation");
});

// Delete a reservation
router.get("/reservation/delete/:id", async (req, res) => {
  const db = req.app.locals.db;

  await db
    .collection("reservations")
    .deleteOne({ _id: new ObjectId(req.params.id) });

  res.redirect("/admin/reservation");
});

// Display all contact messages
router.get("/contacts", async (req, res) => {
  const db = req.app.locals.db;
  const contacts = await db.collection("contacts").find({}).toArray();

  res.render("admin/contact-list", {
    title: "Contact Messages",
    contacts,
  });
});

// Delete a contact message
router.get("/contacts/delete/:id", async (req, res) => {
  const db = req.app.locals.db;

  await db
    .collection("contacts")
    .deleteOne({ _id: new ObjectId(req.params.id) });

  res.redirect("/admin/contacts");
});

export default router;
