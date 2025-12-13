import express from "express";
import { ObjectId } from "mongodb";
import multer from "multer";
import path from "path";

// Configure upload folder
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

/* Dashboard */
router.get("/", (req, res) => {
  res.render("admin/dashboard", { title: "Admin Dashboard" });
});

// List all menu items
router.get("/menu", async (req, res) => {
  const db = req.app.locals.db;
  const menu = await db.collection("menuItems").find({}).toArray();
  res.render("admin/menu-list", { title: "Menu List", menu });
});

// Add menu item form
router.get("/menu/add", (req, res) => {
  res.render("admin/menu-add", { title: "Add Menu Item" });
});

// Add menu item (submit form)
router.post("/menu/add/submit", upload.single("image"), async (req, res) => {
  const db = req.app.locals.db;
  const newItem = {
    name: req.body.name,
    price: parseFloat(req.body.price),
    description: req.body.description,
    image: `/uploads/${req.file.filename}`, // save local file path
  };
  await db.collection("menuItems").insertOne(newItem);
  // console.log("Menu item added with image");
  res.redirect("/admin/menu");
});

// Edit menu item form
router.get("/menu/edit", async (req, res) => {
  const db = req.app.locals.db;
  const item = await db
    .collection("menuItems")
    .findOne({ _id: new ObjectId(req.query.itemId) });
  res.render("admin/menu-edit", { title: "Edit Menu Item", editItem: item });
});

// Edit menu item (submit form)
router.post("/menu/edit/submit", upload.single("newImage"), async (req, res) => {
  const db = req.app.locals.db;
  const filter = { _id: ObjectId.createFromHexString(String(req.body.itemId)) };


  // Get the existing item from DB
  const existingItem = await db.collection("menuItems").findOne(filter);

  // Build the updated item
  const updatedItem = {
    name: req.body.name,
    price: parseFloat(req.body.price),
    description: req.body.description,
    image: req.file
      ? `/uploads/${req.file.filename}` 
      : existingItem.image,             
  };

  await db.collection("menuItems").updateOne(filter, { $set: updatedItem });
  console.log("Menu item updated");
  res.redirect("/admin/menu");
});


// Delete menu item
router.get("/menu/delete", async (req, res) => {
  const db = req.app.locals.db;
  await db
    .collection("menuItems")
    .deleteOne({ _id: new ObjectId(req.query.itemId) });
  console.log("Menu item deleted successfully");
  res.redirect("/admin/menu");
});


/*  RESERVATION CRUD */

// List all reservations
router.get("/reservation", async (req, res) => {
  const db = req.app.locals.db;
  const reservations = await db.collection("reservations").find({}).toArray();
  res.render("admin/reservation-list", {
    title: "Reservation List",
    reservations,
  });
});

// Add reservation form
router.get("/reservation/add", (req, res) => {
  res.render("admin/reservation-add", { title: "Add Reservation" });
});

// Add reservation submission
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
  console.log("Reservation added");
  res.redirect("/admin/reservation");
});

// Edit reservation form
router.get("/reservation/edit", async (req, res) => {
  const db = req.app.locals.db;
  const resToEdit = await db
    .collection("reservations")
    .findOne({ _id: new ObjectId(req.query.resId) });
  res.render("admin/reservation-edit", {
    title: "Edit Reservation",
    editRes: resToEdit,
  });
});

// Edit reservation submission
router.post("/reservation/edit/submit", async (req, res) => {
  const db = req.app.locals.db;
  const filter = { _id: new ObjectId(req.body.resId) };
  const updatedRes = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    date: req.body.date,
    time: req.body.time,
    guests: parseInt(req.body.guests),
    message: req.body.message,
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
    .deleteOne({ _id: new ObjectId(req.query.resId) });
  console.log("Reservation deleted");
  res.redirect("/admin/reservation");
});

/* Contact Us Messages */

// List all contact messages
router.get("/contacts", async (req, res) => {
  const db = req.app.locals.db;
  const contacts = await db.collection("contacts").find({}).toArray();
  res.render("admin/contact-list", {
    title: "Contact Messages",
    contacts,
  });
});

// Delete a contact message
router.get("/contacts/delete", async (req, res) => {
  const db = req.app.locals.db;
  await db
    .collection("contacts")
    .deleteOne({ _id: new ObjectId(req.query.contactId) });
  console.log("Contact message deleted");
  res.redirect("/admin/contacts");
});


export default router;
