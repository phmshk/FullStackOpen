import { useEffect, useState } from "react";
import usersService from "../services/users";
import { Link } from "react-router-dom";
const Users = () => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const result = await usersService.getAll();
        setUsers(result);
      } catch (err) {
        console.error("An Error occured: ", err.message);
      }
    };
    getUsers();
  }, []);

  if (!users) {
    return <p>No users found</p>;
  }

  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <th style={{ textAlign: "left" }} scope="row">
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </th>
              <td style={{ textAlign: "center" }}>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Users;
