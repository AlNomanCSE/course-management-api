import "dotenv/config";
import express from "express";
import connectDB from "./config/database.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";
import purchaseRoutes from "./routes/purchases.js";

connectDB();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use(errorHandler);
app.use("*", (req, res) =>
  res.status(404).json({ message: "Route not found" })
);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
