import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Get all registered users
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email and password match
   const matchingUser = savedUsers.find(
  (user) =>
    user.email?.toLowerCase() === email.trim().toLowerCase() &&
    user.password === password
);

if (!matchingUser) {
  setError("Incorrect email or password.");
  return;
}

localStorage.setItem(
  "currentUser",
  JSON.stringify(matchingUser)
);

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
          <label htmlFor="email">Email:</label>

          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          {error && (
            <p
              style={{
                color: "red",
                textAlign: "center",
                marginTop: "0.75rem",
                marginBottom: "0.5rem",
              }}
            >
              {error}
            </p>
          )}

          <div
            style={{
              textAlign: "right",
              marginTop: "0.5rem",
              marginBottom: "1rem",
            }}
          >
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
            <button type="submit">Log In</button>

            <button
              type="button"
              className="secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
            }}
          >
            Don't have an account?{" "}
            <Link to="/create-account">Create one here.</Link>
          </p>
        </form>
      </article>
    </main>
  );
}

export default Login;