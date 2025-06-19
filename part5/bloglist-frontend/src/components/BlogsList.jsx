import { useSelector } from "react-redux";
import { selectSortedBlogs } from "../features/blogsSlice";
import Blog from "./Blog";

const BlogsList = () => {
  const blogs = useSelector(selectSortedBlogs);

  return (
    <>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );
};

export default BlogsList;
