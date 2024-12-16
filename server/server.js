const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

let ideas = [];
let idCounter = 1;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/ideas", (req, res) => res.json(ideas));

app.post("/ideas", (req, res) => {
  const { title, description } = req.body;
  const newIdea = { id: idCounter++, title, description };
  ideas.push(newIdea);
  res.status(201).json(newIdea);
});

app.delete("/ideas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  ideas = ideas.filter(idea => idea.id !== id);
  res.status(204).end();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
