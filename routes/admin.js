import express from "express";
import { ObjectId } from "mongodb";
import multer from "multer";
import path from "path";

const router = express.Router();

/* image upload setup */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* admin dashboard */
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

/* menu routes */
router.get("/menu", async (req, res) => {
  const db = req.app.locals.db;
  const menu = await db.collection("menuItems").find({}).toArray();
  res.render("admin/menu-list", { title: "Menu List", menu });
});

router.get("/menu/add", (req, res) => {
  res.render("admin/menu-add", { title: "Add Menu Item" });
});

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

router.get("/menu/delete/:id", async (req, res) => {
  const db = req.app.locals.db;

  await db
    .collection("menuItems")
    .deleteOne({ _id: new ObjectId(req.params.id) });

  res.redirect("/admin/menu");
});

/* reservation routes */
router.get("/reservation", async (req, res) => {
  const db = req.app.locals.db;
  const reservations = await db.collection("reservations").find({}).toArray();

  res.render("admin/reservation-list", {
    title: "Reservation List",
    reservations,
  });
});

router.get("/reservation/add", (req, res) => {
  res.render("admin/reservation-add", { title: "Add Reservation" });
});

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

router.get("/reservation/delete/:id", async (req, res) => {
  const db = req.app.locals.db;

  await db
    .collection("reservations")
    .deleteOne({ _id: new ObjectId(req.params.id) });

  res.redirect("/admin/reservation");
});

/* contact routes */
router.get("/contacts", async (req, res) => {
  const db = req.app.locals.db;
  const contacts = await db.collection("contacts").find({}).toArray();

  res.render("admin/contact-list", {
    title: "Contact Messages",
    contacts,
  });
});

router.get("/contacts/delete/:id", async (req, res) => {
  const db = req.app.locals.db;

  await db
    .collection("contacts")
    .deleteOne({ _id: new ObjectId(req.params.id) });

  res.redirect("/admin/contacts");
});


export default router;
