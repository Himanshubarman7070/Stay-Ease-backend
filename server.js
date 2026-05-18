import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import tiffinRoutes from "./routes/tiffinRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import groceryRoutes from "./routes/groceryRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import cancellationRoutes from "./routes/cancellationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Allow all origins — safe for this project (single-tenant PG app)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "StayEase API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tiffin", tiffinRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/grocery", groceryRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/cancellations", cancellationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/payments", paymentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
