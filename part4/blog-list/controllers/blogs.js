const blogsRouter = require("express").Router();
const Blog = require("../models/Blog");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (!body.title || !body.url || !body.author) {
    return response.status(400).json({ error: "title, url or author missing" });
  }

  try {
    const user = request.user;

    if (!user) {
      console.log("$======400");
      return response
        .status(400)
        .json({ error: "userId missing or not valid" });
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    });

    const savedBlog = await blog.save();
    savedBlog.populate("user", { username: 1, name: 1 });
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const user = request.user;

    if (!user) {
      return response.status(400).json({ error: "userID missing or invalid" });
    }

    const userBlogs = user.blogs;

    if (userBlogs.find((blog) => blog.toString() === request.params.id)) {
      await Blog.findByIdAndDelete(request.params.id);
      userBlogs.filter((blog) => blog.id !== request.params.id);
      await user.save();
      response.status(204).end();
    } else {
      response.status(400).json({
        error: "deleting a blog is attempted by an invalid user",
      });
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;
  const blogUpdate = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      blogUpdate,
      { new: true, runValidators: true }
    ).populate("user", { username: 1, name: 1 });
    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
