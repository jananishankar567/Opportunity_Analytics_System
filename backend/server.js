require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/auth", require("./routes/authRoutes"));
//app.use("/opportunities", require("./routes/opportunityRoutes"));
const opportunityRoutes = require("./routes/opportunityRoutes");
app.use("/opportunities", opportunityRoutes);
// Global Error Handler (IMPORTANT)
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({
    message: err.message || "Server Error"
  });
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});