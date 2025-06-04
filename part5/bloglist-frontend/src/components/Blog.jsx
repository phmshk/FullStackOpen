import { useEffect, useState } from "react";

const Blog = ({ blog, likeBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const showWhenVisible = {
    display: visible ? "" : "none",
  };

  const handleClickLike = (blog) => {
    likeBlog(blog.id, { ...blog, user: blog.user.id, likes: blog.likes + 1 });
  };

  const handleClickDelete = (blog) => {
    if (window.confirm(`Remove Blog "${blog.title}" by ${blog.author}?`)) {
      deleteBlog(blog.id);
    }
  };

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem("user")).name;
    setCurrentUser(user);
  }, []);

  return (
    <div
      style={{
        ...blogStyle,
        backgroundColor: currentUser === blog.user.name ? "#ede9e8" : "",
        borderColor: visible ? "blue" : "",
      }}
    >
      <div>
        "{blog.title}" by {blog.author}{" "}
        <button onClick={() => setVisible(!visible)}>
          {visible ? "hide" : "show"}
        </button>
      </div>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          likes: {blog.likes}{" "}
          <button onClick={() => handleClickLike(blog)}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {currentUser === blog.user.name && (
          <button onClick={() => handleClickDelete(blog)}>delete</button>
        )}
      </div>
    </div>
  );
};

export default Blog;
