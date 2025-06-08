import { useState } from "react";

const LoginForm = ({ loginUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser({ username, password });
    setUsername("");
    setPassword("");
  };

  return (
    <form onSubmit={handleSubmit}>
      {" "}
      <div>
        {" "}
        username{" "}
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          required
          data-testid="username"
        />{" "}
      </div>{" "}
      <div>
        {" "}
        password{" "}
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          required
          data-testid="password"
        />{" "}
      </div>{" "}
      <button type="submit">login</button>{" "}
    </form>
  );
};

export default LoginForm;
