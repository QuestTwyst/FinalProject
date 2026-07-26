import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PasswordReset() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage("Password reset successful! You can now log in with your new password.");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <main className="container">
      <article>
        <h2 style={{ textAlign: "center" }}>Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {message && <p>{message}</p>}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <button type="submit">Reset Password</button>

            <button
              type="button"
              className="secondary"
              onClick={() => navigate("/login")}
            >
              Cancel
            </button>
          </div>
        </form>
      </article>
    </main>
  );
}

export default PasswordReset;