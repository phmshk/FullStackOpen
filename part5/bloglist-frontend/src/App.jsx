import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import loginService from "./services/login";
import BlogFrom from "./components/BlogFrom";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  const [notification, setNotification] = useState({ text: "", type: null });
  const showNotification = (text, type) => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification({ text: "", type: null });
    }, 5000);
  };

  const deleteBlog = async (id) => {
    try {
      blogService.setToken(user.token);
      await blogService.deleteBlog(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      showNotification(`Something went wrong: ${error.message}`, "error");
    }
  };

  const likeBlog = async (id, newBlog) => {
    try {
      const updatedBlog = await blogService.update(id, newBlog);
      setBlogs(
        blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
      );
    } catch (error) {
      showNotification(`Something went wrong: ${error.message}`, "error");
    }
  };

  const createNewBlog = async (blogObj) => {
    try {
      blogService.setToken(user.token);
      const newBlog = await blogService.create(blogObj);
      setBlogs([...blogs, newBlog]);
      showNotification(`a new blog ${newBlog.title} added`, "success");
      blogFormRef.current.toggleVisibility();
    } catch {
      showNotification("Wrong blog format", "error");
    }
  };

  const logoutUser = () => {
    window.localStorage.removeItem("user");
    setUser(null);
  };

  const loginUser = async (userObj) => {
    try {
      const user = await loginService.login(userObj);
      setUser(user);
      window.localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      showNotification("Wrong credentials", "error");
    }
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("user");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, []);

  if (!user) {
    return (
      <>
        <Notification notification={notification} />
        <h1>Blog App</h1>

        <LoginForm loginUser={loginUser} />
      </>
    );
  }

  return (
    <div>
      <h1>Blog App</h1>

      <Notification notification={notification} />

      <h2>blogs</h2>
      <div>
        <span>{user.name} logged in </span>
        <button onClick={logoutUser}>Log out</button>
      </div>

      <div>
        <h2>create new</h2>
        <Togglable buttonLabel={"new blog"} ref={blogFormRef}>
          <BlogFrom createBlog={createNewBlog} />
        </Togglable>
      </div>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={likeBlog}
            deleteBlog={deleteBlog}
          />
        ))}
    </div>
  );
};

export default App;
