const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../utils/config");

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const setupTestUser = async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("secret", 10);

  const user = new User({
    username: "testuser",
    name: "Test User",
    passwordHash,
  });

  const savedUser = await user.save();
  const testUserId = savedUser._id.toString();

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  };
  const testUserToken = jwt.sign(userForToken, config.SECRET);

  return { testUserId, testUserToken };
};

module.exports = {
  usersInDb,
  blogsInDb,
  setupTestUser,
};
