require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

//  CORS Configuration (IMPORTANT for deployment)
app.use(cors({
  origin: "https://opportunity-analytics-system-frontend.onrender.com", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());

//  Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.error(" MongoDB connection error:", err));

//  Routes
app.use("/auth", require("./routes/authRoutes"));

const opportunityRoutes = require("./routes/opportunityRoutes");
app.use("/opportunities", opportunityRoutes);

//  Health Check Route (useful for Render testing)
app.get("/", (req, res) => {
  res.send("🚀 API is running successfully");
});

//  Global Error Handler
app.use((err, req, res, next) => {
  console.error(" Global error:", err.stack);
  res.status(500).json({
    message: err.message || "Server Error",
  });
});

//  Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});