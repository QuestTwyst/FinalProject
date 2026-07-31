import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api.js";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setMessage("Email is required.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/password-reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error || "Could not reset your password.",
        );
        return;
      }

      setMessage(
        "Password reset successful! Redirecting to login...",
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Password reset failed:", error);

      setMessage(
        "Could not reach the server. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <article className="auth-card">
        <h2>Reset Password</h2>

        {message && (
          <p className="form-note">{message}</p>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>

          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            disabled={isSubmitting}
          />

          <label htmlFor="newPassword">
            New Password:
          </label>

          <input
            type="password"
            id="newPassword"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            autoComplete="new-password"
            minLength="6"
            required
            disabled={isSubmitting}
          />

          <label htmlFor="confirmPassword">
            Confirm Password:
          </label>

          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            autoComplete="new-password"
            minLength="6"
            required
            disabled={isSubmitting}
          />

          <div className="auth-actions">
            <button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Resetting..."
                : "Reset Password"}
            </button>

            <button
              type="button"
              className="secondary"
              onClick={() => navigate("/login")}
              disabled={isSubmitting}
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