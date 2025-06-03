const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
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

app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
