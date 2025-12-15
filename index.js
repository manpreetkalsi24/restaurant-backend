import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import adminRoutes from "./routes/admin.js";
import apiRoutes from "./routes/api.js"; 
dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "https://restaurant-website-eatery.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
const db = client.db(process.env.DB_NAME);
app.locals.db = db;
console.log("Connected to MongoDB");

// View engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/admin", adminRoutes);
app.use("/api", apiRoutes); 

app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 8888;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
