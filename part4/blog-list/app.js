const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const app = express();

const connectToMDB = async () => {
  logger.logInfo("connecting to", config.MONGODB_URI);

  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.logInfo("connected to MongoDB");
  } catch (error) {
    logger.logError("error connection to MongoDB:", error.message);
  }
};
connectToMDB();

app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/login", loginRouter);
app.use("/api/blogs", middleware.userExtractor, blogsRouter);
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
