// backend/server.js
import dotenv from "dotenv";
dotenv.config();const express = require("express");

const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();

// Endpoint to get flashcards
app.get("/flashcards", (req, res) => {
  pool.query("SELECT * FROM flashcards", (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json(results);
  });
});

// Endpoint to add a flashcard
app.post("/flashcards", (req, res) => {
  const { question, answer } = req.body;
  pool.query(
    "INSERT INTO flashcards (question, answer) VALUES (?, ?)",
    [question, answer],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
      res.status(201).json({ id: results.insertId, question, answer });
    }
  );
});

// Endpoint to update a flashcard
app.put("/flashcards/:id", (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  pool.query(
    "UPDATE flashcards SET question = ?, answer = ? WHERE id = ?",
    [question, answer, id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
      res.json({ message: "Flashcard updated" });
    }
  );
});

// Endpoint to delete a flashcard
app.delete("/flashcards/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM flashcards WHERE id = ?", [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ message: "Flashcard deleted" });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
