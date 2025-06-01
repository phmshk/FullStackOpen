require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/Person");

const app = express();

morgan.token("post-request", function (req) {
  if ((req.method === "POST" || req.method === "PUT") && req.body) {
    return JSON.stringify(req.body);
  }
  return " ";
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.json());
app.use(express.static("dist"));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :post-request"
  )
);

app.get("/", (request, response) => {
  response.send("<h1>Welcome to the PhoneBook main page</h1>");
});

app.get("/info", (request, response, next) => {
  Person.countDocuments({})
    .then((result) => {
      const infoHTML = `<div>
    <p>Phonebook has info for ${result} people.</p>
    <p>${new Date().toString()}</p>
  </div>`;
      response.send(infoHTML);
    })
    .catch((error) => next(error));
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((foundPerson) => {
      if (foundPerson) {
        response.json(foundPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  const id = request.params.id;
  Person.findById(id, { runValidators: true })
    .then((foundPerson) => {
      if (!foundPerson) {
        return response.status(404).end();
      }

      foundPerson.number = number;
      foundPerson.name = name;
      return foundPerson.save().then((result) => response.json(result));
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
