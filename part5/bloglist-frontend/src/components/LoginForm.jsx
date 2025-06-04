import { useState } from "react";

const LoginForm = ({
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
}) => {
  return (
    <form onSubmit={handleLogin}>
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
        />{" "}
      </div>{" "}
      <button type="submit">login</button>{" "}
    </form>
  );
};

export default LoginForm;
