const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema({
  title: String,
  category: String,
  status: String,
  deadline: Date,
  value: Number,
  description: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

module.exports = mongoose.model("Opportunity", opportunitySchema);