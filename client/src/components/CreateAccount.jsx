import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api.js";

function CreateAccount() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/");
  };

  const validate = () => {
    const nextErrors = {};
    const normalizedEmail = formData.email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!normalizedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      nextErrors.password =
        "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      nextErrors.confirmPassword =
        "Passwords do not match.";
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

    const fullName = [
      formData.firstName.trim(),
      formData.middleName.trim(),
      formData.lastName.trim(),
    ]
      .filter(Boolean)
      .join(" ");

    const normalizedEmail = formData.email
      .trim()
      .toLowerCase();

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: normalizedEmail,
          password_hash: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrors((currentErrors) => ({
            ...currentErrors,
            email: "That email is already registered.",
          }));

          setSubmitMessage(
            "Please fix the highlighted fields before continuing.",
          );
        } else {
          setSubmitMessage(
            data.error ||
              "Something went wrong. Please try again.",
          );
        }

        return;
      }

      setSubmitMessage(
        "Registration successful! Redirecting to login...",
      );

      setTimeout(() => {
        navigate("/login");
      }, 750);
    } catch (error) {
      console.error("Account creation failed:", error);

      setSubmitMessage(
        "Could not reach the server. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <article className="auth-card">
        <h2>Create Account</h2>

        {submitMessage && (
          <p className="form-note">{submitMessage}</p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid-3">
            <div>
              <label htmlFor="firstName">
                First Name
              </label>

              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="given-name"
              />

              {errors.firstName && (
                <p className="field-error">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="middleName">
                Middle Name
              </label>

              <input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                autoComplete="additional-name"
              />
            </div>

            <div>
              <label htmlFor="lastName">
                Last Name
              </label>

              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="family-name"
              />

              {errors.lastName && (
                <p className="field-error">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <label htmlFor="email">Email</label>

          <input
            type="email"
            id="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />

          {errors.email && (
            <p className="field-error">{errors.email}</p>
          )}

          <label htmlFor="password">Password</label>

          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
          />

          {errors.password && (
            <p className="field-error">
              {errors.password}
            </p>
          )}

          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />

          {errors.confirmPassword && (
            <p className="field-error">
              {errors.confirmPassword}
            </p>
          )}

          <div className="auth-actions">
            <button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating..."
                : "Create Account"}
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
          Already have an account? Log in{" "}
          <button
            type="button"
            className="link-like"
            onClick={() => navigate("/login")}
          >
            here
          </button>
          .
        </p>
      </article>
    </main>
  );
}

export default CreateAccount;