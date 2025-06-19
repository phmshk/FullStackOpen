import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const initialState = {
  blogs: [],
  status: "idle", // "idle" | "pending" | "completed" | "failed"
  error: null,
};

export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async () => {
  const result = await blogService.getAll();
  return result;
});

export const addNewBlog = createAsyncThunk(
  "blogs/addNewBlog",
  async (newBlog) => {
    const result = await blogService.create(newBlog);
    return result;
  }
);

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async (object) => {
    const { id, newBlog } = object;
    const updatedBlog = await blogService.update(id, newBlog);
    return updatedBlog;
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (blogId) => {
    await blogService.deleteBlog(blogId);
  }
);

export const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = "completed";
        state.blogs.push(...action.payload);
      })
      .addCase(fetchBlogs.rejected, (state) => {
        state.status = "failed";
        state.error = "Error";
      })
      .addCase(addNewBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        const deletedBlogId = action.meta.arg;
        state.blogs = state.blogs.filter((blog) => blog.id !== deletedBlogId);
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const updated = state.blogs.find(
          (blog) => blog.id === action.payload.id
        );
        updated.likes += 1;
      });
  },
});

export default blogsSlice.reducer;

const selectAllBlogs = (state) => state.blogs.blogs;
const selectBlogId = (state, blogId) => blogId;

export const selectSortedBlogs = createSelector([selectAllBlogs], (blogs) => {
  return [...blogs].sort((a, b) => b.likes - a.likes);
});
export const selectBlogById = createSelector(
  [selectAllBlogs, selectBlogId],
  (blogs, blogId) => {
    return blogs.find((blog) => blog.id === blogId);
  }
);

export const selectBlogsStatus = (state) => state.blogs.status;
