const express = require("express");
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const app = express();

const mongoUrl = MONGODB_URI;
mongoose.connect(mongoUrl);

app.use(express.json());
app.use("/api/blogs", blogsRouter);

module.exports = app;
