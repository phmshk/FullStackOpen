const express = require("express");
const morgan = require("morgan");
const Person = require("./models/Person");
const mongoose = require("mongoose");
const { logInfo } = require("./utils/logger");
const { MONGODB_URI } = require("./utils/config");
const personsRouter = require("./controllers/persons");
const { errorHandler, unknownEndpoint } = require("./utils/middleware");

mongoose.set("strictQuery", false);

const url = MONGODB_URI;
logInfo(`connecting to ${url}`);
mongoose
  .connect(url)
  .then(() => {
    logInfo("connected to MongoDB");
  })
  .catch((error) => {
    logInfo(`error connecting to MongoDB: ${error.message}`);
  });

const app = express();

morgan.token("post-request", function (req) {
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

app.use("/api/persons", personsRouter);

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

app.use(unknownEndpoint);

app.use(errorHandler);

module.exports = app;
