const express = require("express");
const router = express.Router();
const Opportunity = require("../models/Opportunity");
const auth = require("../middleware/auth"); // <-- your file name

// Get all opportunities
router.get("/", auth, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ userId: req.user.id });
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single opportunity (FOR EDIT)
router.get("/:id", auth, async (req, res) => {
  try {
    const opportunity = await Opportunity.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.json(opportunity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create opportunity
router.post("/", auth, async (req, res) => {
  try {
    const newOpportunity = new Opportunity({
      ...req.body,
      userId: req.user.id,
    });

    await newOpportunity.save();
    res.status(201).json(newOpportunity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update opportunity (FOR EDIT SAVE)
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedOpportunity = await Opportunity.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedOpportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.json(updatedOpportunity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete opportunity
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedOpportunity = await Opportunity.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedOpportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.json({ message: "Opportunity deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;