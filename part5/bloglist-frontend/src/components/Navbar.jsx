import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userRemoved, getUser } from "../features/userSlice";

export const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const styles = {
    display: "flex",
    gap: "5px",
    alignItems: "center",
    backgroundColor: "lightgray",
    padding: "2px 3px",
  };
  const logoutUser = () => {
    window.localStorage.removeItem("user");
    dispatch(userRemoved());
  };

  return (
    <nav>
      <div style={styles}>
        <Link to="/">Blogs</Link>
        <Link to="/users">Users</Link>
        <span>{user.name} logged in </span>
        <button onClick={logoutUser}>Log out</button>
      </div>
    </nav>
  );
};
