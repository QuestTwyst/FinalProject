import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateAccount() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/");
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!formData.username.trim()) {
      nextErrors.username = "Username is required.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      setSubmitMessage("Please fix the highlighted fields before continuing.");
      return;
    }

    setSubmitMessage("Registration successful! Redirecting to login...");
    setTimeout(() => navigate("/login"), 750);
  };

  return (
    <main className="auth-page">
      <article className="auth-card">
        <h2>Create Account</h2>

        {submitMessage && <p className="form-note">{submitMessage}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid-3">
            <div>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <p className="field-error">{errors.firstName}</p>}
            </div>

            <div>
              <label htmlFor="middleName">Middle Name</label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <p className="field-error">{errors.lastName}</p>}
            </div>
          </div>

          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="field-error">{errors.username}</p>}

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}

          <div className="auth-actions">
            <button type="submit">Create Account</button>
            <button type="button" className="secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>

        <p className="form-footer">Already have an account? Log in <span onClick={() => navigate('/login')} className="link-like">here</span>.</p>
      </article>
    </main>
  );
}

export default CreateAccount;