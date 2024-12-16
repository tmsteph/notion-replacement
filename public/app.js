const form = document.getElementById("idea-form");
const ideaList = document.getElementById("idea-list");

async function fetchIdeas() {
  const res = await fetch("/ideas");
  const ideas = await res.json();
  ideaList.innerHTML = "";
  renderIdeas(ideas, ideaList);
}

function renderIdeas(ideas, container) {
  ideas.forEach((idea) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${idea.title}</strong><p>${idea.description}</p>
      <button onclick="addSubIdea(${idea.id})">Add Sub-Idea</button>
      <button onclick="deleteIdea(${idea.id})">Delete</button>`;

    const subIdeaList = document.createElement("ul");
    renderIdeas(idea.children, subIdeaList);
    li.appendChild(subIdeaList);
    container.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  await fetch("/ideas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });

  form.reset();
  fetchIdeas();
});

async function addSubIdea(parentId) {
  const title = prompt("Enter sub-idea title:");
  const description = prompt("Enter sub-idea description:");
  if (title && description) {
    await fetch("/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, parentId }),
    });
    fetchIdeas();
  }
}

async function deleteIdea(id) {
  await fetch(`/ideas/${id}`, { method: "DELETE" });
  fetchIdeas();
}

fetchIdeas();
