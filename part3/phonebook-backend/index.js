const express = require("express");
const morgan = require("morgan");
const app = express();

morgan.token("post-request", function (req, res) {
  if ((req.method === "POST" || req.method === "PUT") && req.body) {
    return JSON.stringify(req.body);
  }
  return " ";
});

app.use(express.json());
app.use(express.static("dist"));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :post-request"
  )
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Welcome to the PhoneBook main page</h1>");
});

app.get("/info", (request, response) => {
  const infoHTML = `<div>
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${new Date().toString()}</p>
  </div>`;
  response.send(infoHTML);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  const nameAlreadyExists = persons.find(
    (person) =>
      person.name.toLocaleLowerCase() === body.name.toLocaleLowerCase()
  );

  if (nameAlreadyExists) {
    return response.status(409).json({
      error: "name must be unique",
    });
  }

  const newId = Math.floor(Math.random() * 10000000);
  const newPerson = {
    id: String(newId),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
