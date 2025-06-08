const resetDB = async (request, user) => {
  await request.post("http://localhost:3003/api/testing/reset");
  await request.post("http://localhost:3003/api/users", {
    data: user,
  });
};

const addUser = async (request, user) => {
  await request.post("http://localhost:3003/api/users", {
    data: user,
  });
};

const loginUser = async (page, { username, password }) => {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, { title, author, url }) => {
  await page.getByRole("button", { name: "new blog" }).click();
  await page.getByTestId("title-input").fill(title);
  await page.getByTestId("author-input").fill(author);
  await page.getByTestId("url-input").fill(url);
  await page.getByRole("button", { name: "create" }).click();
};

module.exports = {
  resetDB,
  loginUser,
  createBlog,
  addUser,
};
