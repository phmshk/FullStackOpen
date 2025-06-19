import { useParams } from "react-router-dom";
import { useState } from "react";
import userService from "../services/users";

const SingleUserPage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();

  useState(() => {
    const getUserById = async (userId) => {
      const users = await userService.getAll();
      const user = users.find((user) => user.id === userId);
      setUser(user);
    };

    getUserById(userId);
  });

  if (!user) return <p>No user data found</p>;
  return (
    <>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.length > 0 ? (
          user.blogs.map((blog, index) => <li key={index}>{blog.title}</li>)
        ) : (
          <li>No blogs added by this user</li>
        )}
      </ul>
    </>
  );
};

export default SingleUserPage;
