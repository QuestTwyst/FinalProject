import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api.js";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const nextErrors = {};

    if (!formData.username.trim()) {
      nextErrors.username = "Username is required.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors((current) => ({ ...current, [e.target.name]: "" }));
    setSubmitMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setSubmitMessage("Please fix the highlighted fields before continuing.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.username.trim(),
          password_hash: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitMessage(data.error || "Invalid email or password.");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(data.user));
      setSubmitMessage("Login submitted. Redirecting to the story intro...");
      setTimeout(() => navigate("/intro"), 750);
    } catch (error) {
      setSubmitMessage("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <main className="auth-page">
      <article className="auth-card">
        <h2>Log In</h2>

        {submitMessage && <p className="form-note">{submitMessage}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="field-error">{errors.username}</p>}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}

          <div className="auth-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
            <button type="button" className="secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>

        <p className="form-footer">
          Don't have an account? <Link to="/register">Create one here</Link>.
        </p>
      </article>
    </main>
  );
}

export default Login;