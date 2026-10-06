require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/utils/db");

const authRoutes = require("./src/routes/authRoutes");
const materialRoutes = require("./src/routes/materialRoutes");
const aiRoutes = require("./src/routes/aiRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("StudyBuddy Backend is Running");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/material", materialRoutes);
app.use("/api/ai", aiRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});