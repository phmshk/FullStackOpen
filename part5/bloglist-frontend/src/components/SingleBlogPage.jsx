import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { getUser } from "../features/userSlice";
import { selectBlogById } from "../features/blogsSlice";
import { useShowNotification } from "../features/showNotification";
import { deleteBlog, updateBlog } from "../features/blogsSlice";
import blogService from "../services/blogs";

const SingleBlogPage = () => {
  const { blogId } = useParams();
  const user = useSelector(getUser);
  const showNotification = useShowNotification();

  const dispatch = useDispatch();
  const blog = useSelector((state) => selectBlogById(state, blogId));

  const handleDeleteBlog = (id) => {
    if (window.confirm(`Remove Blog "${blog.title}" by ${blog.author}?`)) {
      try {
        blogService.setToken(user.token);
        dispatch(deleteBlog(id));
      } catch (error) {
        showNotification(`Something went wrong: ${error.message}`, "error");
      }
    }
  };

  const likeBlog = (id, newBlog) => {
    try {
      dispatch(updateBlog({ id, newBlog }));
    } catch (error) {
      showNotification(`Something went wrong: ${error.message}`, "error");
    }
  };

  if (!blog) {
    return (
      <section>
        <h2>Blog not found!</h2>
      </section>
    );
  }

  return (
    <>
      <h2>
        &quot;{blog.title}&quot; by {blog.author}
      </h2>
      URL:
      <div className="url">{blog.url}</div>
      <div className="likes">
        likes: <span data-testid="like-count">{blog.likes}</span>{" "}
        <button
          onClick={() =>
            likeBlog(blog.id, {
              ...blog,
              user: blog.user.id,
              likes: blog.likes + 1,
            })
          }
          data-testid="like-button"
        >
          like
        </button>
      </div>
      <div>added by {blog.user.name}</div>
      {user.name === blog.user.name && (
        <button onClick={() => handleDeleteBlog(blog.id)}>delete</button>
      )}
    </>
  );
};

export default SingleBlogPage;
