import { useEffect } from "react";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./features/userSlice";
import { loginUser, userAdded } from "./features/userSlice";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import CreateNew from "./components/CreateNew";
import { useShowNotification } from "./features/showNotification";
import BlogsList from "./components/BlogsList";
import Users from "./components/Users";
import SingleUserPage from "./components/SingleUserPage";
import SingleBlogPage from "./components/SingleBlogPAge";
import { Navbar } from "./components/Navbar";

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector(getUser);
  const showNotification = useShowNotification();

  const handleLogin = async (userObj) => {
    try {
      dispatch(loginUser(userObj));
    } catch (error) {
      showNotification("Wrong credentials", "error");
    }
  };

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("user");
    if (loggedUser) {
      dispatch(userAdded(JSON.parse(loggedUser)));
    }
  }, []);

  if (!user) {
    return (
      <>
        <Notification />
        <h1>Blog App</h1>

        <LoginForm loginUser={handleLogin} />
      </>
    );
  }

  return (
    <BrowserRouter>
      <div>
        <h1>Blog App</h1>
        <Navbar />
        <Notification />

        <h2>blogs</h2>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <CreateNew />
                <BlogsList />
              </>
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:userId" element={<SingleUserPage />} />
          <Route path="/blogs/:blogId" element={<SingleBlogPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
