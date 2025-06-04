const bcrypt = require("bcrypt");
const User = require("../models/User");
const helper = require("./test_helper");
const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);
const mongoose = require("mongoose");

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "name",
      name: "more name",
      password: "1234",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "name",
      password: "123",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if username or password too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUserShortName = {
      username: "na",
      name: "name",
      password: "123",
    };

    const newUserShortPassword = {
      username: "name",
      name: "name",
      password: "12",
    };

    const resultName = await api
      .post("/api/users")
      .send(newUserShortName)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const resultPass = await api
      .post("/api/users")
      .send(newUserShortPassword)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      resultName.body.error.includes(
        "is shorter than the minimum allowed length"
      )
    );
    assert(
      resultPass.body.error.includes(
        "Password is required and must be at least 3 characters long"
      )
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
