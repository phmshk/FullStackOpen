import Togglable from "./Togglable";
import BlogFrom from "./BlogFrom";

import { useRef, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  selectBlogsStatus,
  addNewBlog,
  fetchBlogs,
} from "../features/blogsSlice";
import { getUser } from "../features/userSlice";
import blogService from "../services/blogs";
import { useShowNotification } from "../features/showNotification";

const CreateNew = () => {
  const blogFormRef = useRef();
  const dispatch = useDispatch();
  const showNotification = useShowNotification();

  const blogsStatus = useSelector(selectBlogsStatus);
  const user = useSelector(getUser);

  const createNewBlog = (blogObj) => {
    try {
      blogService.setToken(user.token);
      dispatch(addNewBlog(blogObj));
      showNotification(`a new blog ${blogObj.title} added`, "success");
      blogFormRef.current.toggleVisibility();
    } catch {
      showNotification("Wrong blog format", "error");
    }
  };

  useEffect(() => {
    if (blogsStatus === "idle") {
      dispatch(fetchBlogs());
    }
  }, [blogsStatus, dispatch]);

  return (
    <>
      <div>
        <h2>create new</h2>
        <Togglable buttonLabel={"new blog"} ref={blogFormRef}>
          <BlogFrom createBlog={createNewBlog} />
        </Togglable>
      </div>
    </>
  );
};

export default CreateNew;
