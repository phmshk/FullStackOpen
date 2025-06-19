import { useSelector } from "react-redux";
import { Link } from "react-router";
import { getUser } from "../features/userSlice";

const Blog = ({ blog }) => {
  const currentUser = useSelector(getUser);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div
      style={{
        ...blogStyle,
        backgroundColor: currentUser.name === blog.user.name ? "#ede9e8" : "",
      }}
      className="blog"
      data-testid="blog-post-item"
    >
      <Link to={`/blogs/${blog.id}`}>
        &quot;{blog.title}&quot; by {blog.author}
      </Link>
    </div>
  );
};

export default Blog;
