import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/auth";
import "./register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // Clear previous messages
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await registerUser({
        name,
        email,
        password,
      });

      console.log("Registration Successful:", response);

      setSuccessMessage("Registration successful!");

      // Clear form
      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {
      console.error(
        "Registration Failed:",
        error.response?.data || error.message
      );

      setErrorMessage(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* Header */}
      <header className="register-header">

        <Link to="/" className="register-logo">
          <span className="register-logo-icon">G</span>
          <span>Graspify AI</span>
        </Link>

        <p className="register-header-text">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

      </header>


      {/* Register Section */}
      <main className="register-section">

        <div className="register-card">

          {/* Heading */}
          <div className="register-heading">

            <span className="register-badge">
              ✨ AI-Powered Study Companion
            </span>

            <h1>Create your account</h1>

            <p>
              Start learning smarter with Graspify AI.
              Upload your study material and let AI help you learn.
            </p>

          </div>


          {/* Register Form */}
          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* Full Name */}
            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

            </div>


            {/* Email */}
            <div className="form-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>


            {/* Password */}
            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="password-input">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* Submit Button */}
            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>

          </form>

          {successMessage && (
            <div className="success-message">
              ✓ {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="error-message">
              ✕ {errorMessage}
            </div>
          )}

          {/* Login */}
          <div className="register-login">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>

      </main>


      {/* Footer */}
      <footer className="register-footer">

        <p>
          © 2026 Graspify AI. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Register;