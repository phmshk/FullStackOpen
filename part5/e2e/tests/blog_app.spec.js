const { test, expect, beforeEach, describe } = require("@playwright/test");
const helpers = require("./tests_helper");

const testBlog = {
  title: "Completely Different Title",
  author: "King Arthur",
  url: "Some Url 1",
};

const testBlog1 = {
  title: "Some Title 2",
  author: "John Wick",
  url: "Some Url 2",
};

const testUser1 = {
  username: "test_user",
  password: "123456",
  name: "Test User 1",
};
const testUser2 = {
  username: "test_user_2",
  password: "123456",
  name: "Test User 2",
};

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await helpers.resetDB(request, testUser1);

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await helpers.loginUser(page, testUser1);

      await expect(page.getByText(`${testUser1.name} logged in`)).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await helpers.loginUser(page, {
        username: "test_user",
        password: "12345",
      });

      await expect(page.getByText("Wrong credentials")).toBeVisible();
    });
  });
});

describe("When logged in", () => {
  beforeEach(async ({ page, request }) => {
    await helpers.resetDB(request, testUser1);

    await page.goto("http://localhost:5173");
    await helpers.loginUser(page, testUser1);
  });

  test("a new blog can be created", async ({ page }) => {
    await helpers.createBlog(page, testBlog);

    await expect(
      page.getByText(`"${testBlog.title}" by ${testBlog.author}`)
    ).toBeVisible();
  });

  test("a blog can be liked", async ({ page }) => {
    await helpers.createBlog(page, testBlog);

    await page.getByRole("button", { name: "show" }).click();
    await expect(page.getByText("likes: 0")).toBeVisible();
    await page.getByRole("button", { name: "like" }).click();
    await expect(page.getByText("likes: 1")).toBeVisible();

    await expect(
      page.getByText(`"${testBlog.title}" by ${testBlog.author}`)
    ).toBeVisible();
  });

  test("own blog can be deleted", async ({ page }) => {
    await helpers.createBlog(page, testBlog);

    page.on("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "show" }).click();
    await page.getByRole("button", { name: "delete" }).click();

    await expect(
      page.getByText(`"${testBlog.title}" by ${testBlog.author}`)
    ).not.toBeVisible();
  });

  test("only own blog can be deleted", async ({ page, request }) => {
    await helpers.createBlog(page, testBlog);
    await page.getByRole("button", { name: "Log out" }).click();
    await helpers.addUser(request, testUser2);
    await helpers.loginUser(page, testUser2);
    await page.getByRole("button", { name: "show" });
    await expect(
      page.getByRole("button", { name: "delete" })
    ).not.toBeVisible();
  });

  test("blogs are arranged in the order according to the likes, the blog with the most likes first", async ({
    page,
  }) => {
    await helpers.createBlog(page, testBlog);
    await helpers.createBlog(page, testBlog1);

    const postA_locator = page.locator(
      `[data-testid="blog-post-item"]:has-text('${testBlog.author}')`
    );
    const postB_locator = page.locator(
      `[data-testid="blog-post-item"]:has-text('${testBlog1.author}')`
    );

    await postA_locator.getByRole("button", { name: "show" }).click();
    await postA_locator.getByRole("button", { name: "like" }).click();

    await postB_locator.getByRole("button", { name: "show" }).click();
    await postB_locator.getByRole("button", { name: "like" }).click();
    await postB_locator.getByRole("button", { name: "like" }).click();

    await expect(
      page.locator('[data-testid="blog-post-item"]').first()
    ).toContainText(`"${testBlog1.title}" by ${testBlog1.author}`);

    const blogItems = page.locator('[data-testid="blog-post-item"]');

    const likesOfFirstPost = await blogItems
      .nth(0)
      .locator('[data-testid="like-count"]')
      .innerText();

    const likesOfSecondPost = await blogItems
      .nth(1)
      .locator('[data-testid="like-count"]')
      .innerText();

    const firstLikes = parseInt(likesOfFirstPost);
    const secondLikes = parseInt(likesOfSecondPost);

    console.log(`First blog likes ${firstLikes}`);
    console.log(`Second blog likes ${secondLikes}`);

    expect(firstLikes).toBe(2);
    expect(secondLikes).toBe(1);
  });
});
