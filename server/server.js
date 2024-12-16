const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

let ideas = [];
let idCounter = 1;

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../public/index.html")));
app.get("/ideas", (req, res) => res.json(ideas));

app.post("/ideas", (req, res) => {
  const { title, description, parentId } = req.body;
  const newIdea = { id: idCounter++, title, description, children: [] };
  if (parentId) {
    const parent = findIdeaById(ideas, parentId);
    if (parent) parent.children.push(newIdea);
    else return res.status(404).json({ message: "Parent idea not found" });
  } else ideas.push(newIdea);
  res.status(201).json(newIdea);
});

app.delete("/ideas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  ideas = deleteIdea(ideas, id);
  res.status(204).end();
});

function findIdeaById(ideas, id) {
  for (const idea of ideas) {
    if (idea.id === id) return idea;
    const child = findIdeaById(idea.children, id);
    if (child) return child;
  }
  return null;
}

function deleteIdea(ideas, id) {
  return ideas.filter((idea) => {
    idea.children = deleteIdea(idea.children, id);
    return idea.id !== id;
  });
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
