require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Allow JSON data

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Define Schema and Model
const scoreSchema = new mongoose.Schema({
  username: String,
  score: Number,
});

const Score = mongoose.model("Score", scoreSchema);

// API: Save User Score
app.post("/submit-score", async (req, res) => {
  try {
    const { username, score } = req.body;
    const newScore = new Score({ username, score });
    await newScore.save();
    res.status(201).json({ message: "Score saved!" });
  } catch (error) {
    res.status(500).json({ error: "Error saving score" });
  }
});

// API: Get Leaderboard (Top 10 Scores)
app.get("/leaderboard", async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 }).limit(10);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: "Error fetching leaderboard" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
