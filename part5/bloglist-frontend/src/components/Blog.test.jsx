import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import BlogFrom from "./BlogFrom";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";

test("renders blog", () => {
  const blog = {
    author: "Some Author",
    likes: 3,
    title: "Blog 31",
    url: "123",
    user: {
      name: "user",
      username: "username",
    },
  };

  const { container } = render(<Blog blog={blog} />);

  const element = container.querySelector(".blog");
  expect(element).toBeDefined();
});

test("content of rendered blog is only title and author by default", () => {
  const blog = {
    author: "Some Author",
    likes: 3,
    title: "Blog 31",
    url: "123",
    user: {
      name: "user",
      username: "username",
    },
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText(`"${blog.title}" by ${blog.author}`);
  expect(element).toBeDefined();
});

test("likes are not visible by default", () => {
  const blog = {
    author: "Some Author",
    likes: 3,
    title: "Blog 31",
    url: "123",
    user: {
      name: "user",
      username: "username",
    },
  };

  const { container } = render(<Blog blog={blog} />);

  const element = container.querySelector(".likes");
  expect(element).not.toBeVisible();
});

test("url is not visible by default", () => {
  const blog = {
    author: "Some Author",
    likes: 3,
    title: "Blog 31",
    url: "123",
    user: {
      name: "user",
      username: "username",
    },
  };

  const { container } = render(<Blog blog={blog} />);

  const element = container.querySelector(".url");
  expect(element).not.toBeVisible();
});

test("clicking 'show' button makes likes and url visible", async () => {
  const blog = {
    author: "Some Author",
    likes: 3,
    title: "Blog 31",
    url: "123",
    user: {
      name: "user",
      username: "username",
    },
  };

  const { container } = render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText("show");
  await user.click(button);

  const urlElement = container.querySelector(".url");
  const likesElement = container.querySelector(".likes");

  expect(urlElement).toBeVisible();
  expect(likesElement).toBeVisible();
});

test("clicking 'like' button twice invokes eventHandler twice", async () => {
  const blog = {
    author: "Some Author",
    likes: 3,
    title: "Blog 31",
    url: "123",
    user: {
      name: "user",
      username: "username",
    },
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} likeBlog={mockHandler} />);

  const user = userEvent.setup();
  const likeButton = screen.getByText("like");
  const showButton = screen.getByText("show");
  await user.click(showButton);
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});

test("form calls the event handler with the right details when a new blog is created", async () => {
  const blog = {
    author: "Some Author",
    title: "Blog 31",
    url: "123",
  };

  const mockHandler = vi.fn();
  const user = userEvent.setup();

  const { container } = render(<BlogFrom createBlog={mockHandler} />);

  const titleInput = container.querySelector("#title-input");
  const authorInput = container.querySelector("#author-input");
  const urlInput = container.querySelector("#url-input");
  const submitButton = screen.getByText("create");

  await user.type(titleInput, blog.title);
  await user.type(authorInput, blog.author);
  await user.type(urlInput, blog.url);
  await user.click(submitButton);

  expect(mockHandler.mock.calls[0][0]).toStrictEqual(blog);
});
