
import express from "express";
import path from "path";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import adminRoutes from "./routes/admin.js";
import apiRoutes from "./routes/api.js";

dotenv.config();

// Connection to mongodb
const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
const db = client.db(process.env.DB_NAME);
console.log("Connected to MongoDB Atlas");

// Set Up Express App
const app = express();
const port = process.env.PORT || 8888;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.locals.db = db;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Routes
app.use("/admin", adminRoutes);
app.use("/api", apiRoutes);

// Default Route
app.get("/", (req, res) => res.redirect("/admin"));

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
