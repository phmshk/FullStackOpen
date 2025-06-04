import { useState } from "react";

const BlogFrom = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (e) => {
    e.preventDefault();
    createBlog({ title, author, url });
    setAuthor("");
    setTitle("");
    setUrl("");
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        {" "}
        <label>
          title:{" "}
          <input
            type="text"
            required
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          author:{" "}
          <input
            type="text"
            required
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          url:{" "}
          <input
            type="text"
            required
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogFrom;
