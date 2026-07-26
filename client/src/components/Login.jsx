import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      username,
      firstName: "Jerry",
      lastName: "Rogers",
      favoriteGenre: "",
      bio: "",
    };

    localStorage.setItem("currentUser", JSON.stringify(user));

    navigate("/profile");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <main className="container">
      <article>
        <h2 style={{ textAlign: "center" }}>Log In</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>

          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>

          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
            <Link to="/password-reset">Forgot Password?</Link>
            </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <button type="submit">Submit</button>

            <button
              type="button"
              className="secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </article>
    </main>
  );
}

export default Login;