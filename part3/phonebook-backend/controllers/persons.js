const personsRouter = require("express").Router();
const Person = require("../models/Person");

personsRouter.get("/", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

personsRouter.get("/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

personsRouter.post("/", (request, response, next) => {
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
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

personsRouter.delete("/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

personsRouter.put("/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findById(request.params.id, { runValidators: true })
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }

      person.name = name;
      person.number = number;

      return person.save().then((person) => {
        response.json(person);
      });
    })
    .catch((error) => next(error));
});

module.exports = personsRouter;
