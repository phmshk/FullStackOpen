const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/Blog");
const User = require("../models/User");
const helper = require("./test_helper");

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
];

let testUserId;
let testUserToken;

describe("when there is initially some blogs saved", () => {
  beforeEach(async () => {
    const userData = await helper.setupTestUser();
    testUserId = userData.testUserId;
    testUserToken = userData.testUserToken;

    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("right number of posts returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  describe("correct naming of fields", () => {
    test("unique identifier property of the blog posts is named id, not _id", async () => {
      const response = await api.get("/api/blogs");
      assert.strictEqual(Object.hasOwn(response.body[0], "id"), true);
      assert.strictEqual(Object.hasOwn(response.body[0], "_id"), false);
    });
  });

  describe("adding new blog post", () => {
    test("POST request successfully creates a new blog post", async () => {
      const newBlog = {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${testUserToken}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");
      const titles = response.body.map((r) => r.title);

      assert.strictEqual(response.body.length, initialBlogs.length + 1);
      assert(titles.includes("Type wars"));
    });

    test("POST request without token does not create a new blog post", async () => {
      const newBlog = {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
      };

      await api.post("/api/blogs").send(newBlog).expect(401);

      const response = await api.get("/api/blogs");
      const titles = response.body.map((r) => r.title);

      assert.strictEqual(response.body.length, initialBlogs.length);
      assert(!titles.includes("Type wars"));
    });
  });

  describe("deleting post", () => {
    test("deleting existing post by owner works", async () => {
      const newBlog = {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
      };

      const blogPosted = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${testUserToken}`)
        .send(newBlog);

      const response = await api
        .delete(`/api/blogs/${blogPosted.body.id}`)
        .set("Authorization", `Bearer ${testUserToken}`);

      const all = await api.get("/api/blogs");

      assert.strictEqual(response.status, 204);
      assert.strictEqual(all.body.length, initialBlogs.length);
    });

    test("deleting existing post with invalid token doesnt work", async () => {
      const newBlog = {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
      };

      const blogPosted = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${testUserToken}`)
        .send(newBlog);

      const response = await api.delete(`/api/blogs/${blogPosted.body.id}`);

      const all = await api.get("/api/blogs");

      assert.strictEqual(response.status, 401);
      assert.strictEqual(all.body.length, initialBlogs.length + 1);
    });
  });

  describe("updating post", () => {
    test("updating existing post title and likes", async () => {
      const posts = await api.get("/api/blogs");
      const idOfFirstPost = posts.body[0].id;
      const newTitle = "Some Awesome Title";
      const newLikes = 37;
      const updatedData = {
        ...posts.body[0],
        title: newTitle,
        likes: newLikes,
      };
      await api.put(`/api/blogs/${idOfFirstPost}`).send(updatedData);
      const response = await api.get("/api/blogs");
      const updatedPost = response.body.filter(
        (post) => post.id === idOfFirstPost
      );

      assert.strictEqual(response.status, 200);
      assert.deepStrictEqual(updatedPost[0], updatedData);
    });
  });

  describe("handling missing fields", () => {
    test("if the likes property is missing from the request, it will default to the value 0", async () => {
      const newBlog = {
        title: "Star wars",
        author: "Robert Not The Previous One",
        url: "http://www.someblog.maybe",
        userId: "683efeec57c5ec1d149a73a1",
      };

      const POSTresponse = await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `Bearer ${testUserToken}`);
      const response = await api.get("/api/blogs");
      const addedBlog = response.body.find(
        (r) => r.title === POSTresponse.body.title
      );
      assert(Object.hasOwn(addedBlog, "likes"));
      assert.strictEqual(addedBlog.likes, 0);
    });

    test("if the title or body propertiy is missing from the request, the backend responds with the status code 400 Bad Request", async () => {
      const newBlogWithoutTitle = {
        author: "Robert Not The Previous One",
        url: "http://www.someblog.maybe",
      };

      const newBlogWithoutUrl = {
        title: "Star wars",
        author: "Robert Not The Previous One",
      };

      const POSTresponseTitle = await api
        .post("/api/blogs")
        .send(newBlogWithoutTitle)
        .set("Authorization", `Bearer ${testUserToken}`);
      const POSTresponseUrl = await api
        .post("/api/blogs")
        .send(newBlogWithoutUrl)
        .set("Authorization", `Bearer ${testUserToken}`);

      assert.strictEqual(POSTresponseTitle.status, 400);
      assert.strictEqual(POSTresponseUrl.status, 400);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
