import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import loginService from "./services/login";
import BlogFrom from "./components/BlogFrom";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const [notification, setNotification] = useState({ text: "", type: null });
  const showNotification = (text, type) => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification({ text: "", type: null });
    }, 5000);
  };

  const handleNewBlog = async (e) => {
    e.preventDefault();
    try {
      blogService.setToken(user.token);
      const newBlog = await blogService.create({ title, author, url });
      setBlogs([...blogs, newBlog]);
      showNotification(`a new blog ${newBlog.title} added`, "success");

      setTitle("");
      setAuthor("");
      setUrl("");
    } catch {
      showNotification("Wrong blog format", "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("user");
    setUser(null);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      window.localStorage.setItem("user", JSON.stringify(user));
      setUsername("");
      setPassword("");
    } catch (error) {
      showNotification("Wrong credentials", "error");
    }
  };

  const loginProps = {
    username,
    password,
    setUsername,
    setPassword,
    handleLogin,
  };

  const blogProps = {
    title,
    author,
    url,
    setTitle,
    setAuthor,
    setUrl,
    handleNewBlog,
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, []);

  if (!user) {
    return (
      <>
        <Notification notification={notification} />

        <LoginForm {...loginProps} />
      </>
    );
  }

  return (
    <div>
      <Notification notification={notification} />

      <h2>blogs</h2>
      <div>
        <span>{user.name} logged in </span>
        <button onClick={handleLogout}>Log out</button>
      </div>

      <div>
        <h2>create new</h2>
        <BlogFrom {...blogProps} />
      </div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
