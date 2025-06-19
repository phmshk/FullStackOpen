import { useState } from "react";

const BlogFrom = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = async (e) => {
    e.preventDefault();
    try {
      await createBlog({ title, author, url });
      setAuthor("");
      setTitle("");
      setUrl("");
    } catch (error) {
      console.error(error);
    }
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
            id="title-input"
            data-testid="title-input"
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
            id="author-input"
            data-testid="author-input"
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
            id="url-input"
            data-testid="url-input"
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogFrom;
