import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api.js";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setSubmitMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      setSubmitMessage(
        "Please fix the highlighted fields before continuing.",
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitMessage(data.error || "Invalid email or password.");
        return;
      }

      localStorage.setItem(
        "currentUser",
        JSON.stringify(data.user),
      );

      localStorage.setItem("authToken", data.token);

      setSubmitMessage(
        "Login successful. Redirecting to the story intro...",
      );

      setTimeout(() => {
        navigate("/intro");
      }, 750);
    } catch (error) {
      console.error("Login request failed:", error);

      setSubmitMessage(
        "Could not reach the server. Please try again.",
      );
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

        {submitMessage && (
          <p className="form-note">{submitMessage}</p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />

          {errors.email && (
            <p className="field-error">{errors.email}</p>
          )}

          <label htmlFor="password">Password</label>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
          />

          {errors.password && (
            <p className="field-error">{errors.password}</p>
          )}

          <div className="auth-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>

            <button
              type="button"
              className="secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>

        <p className="form-footer">
          Don&apos;t have an account?{" "}
          <Link to="/register">Create one here</Link>.
        </p>
      </article>
    </main>
  );
}

export default Login;