const jwt = require("jsonwebtoken");
const logger = require("./logger");
const config = require("./config");
const User = require("../models/User");
const requestLogger = (request, response, next) => {
  logger.logInfo("Method: ", request.method);
  logger.logInfo("Path:   ", request.path);
  logger.logInfo("Body:   ", request.body);
  logger.logInfo("--------");
  next();
};

const errorHandler = (error, request, response, next) => {
  logger.logError(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

const tokenExtractor = (request, response, next) => {
  const token = getTokenFrom(request);
  request.token = token;
  next();
};

const userExtractor = async (request, response, next) => {
  if (request.method === "GET" || request.method === "PUT") {
    return next();
  }
  const token = getTokenFrom(request);
  if (token) {
    try {
      const decodedToken = jwt.verify(token, config.SECRET);
      if (decodedToken && decodedToken.id) {
        const user = await User.findById(decodedToken.id);
        request.user = user;
        next();
      } else {
        return response.status(401).json({ error: "token invalid" });
      }
    } catch (error) {
      next(error);
    }
  } else {
    return response.status(401).json({ error: "token invalid" });
  }
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
