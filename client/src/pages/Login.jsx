import { useState } from "react";
import { loginUser } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    try {
      const response = await loginUser({
        email,
        password,
      });

      if (response.success) {
        localStorage.setItem("token", response.token);

        console.log("Logged In Successful:", response);

        setEmail("");
        setPassword("");

        navigate("/dashboard", { replace: true });
      }

    } catch (error) {
      console.error(
        "Login Failed:",
        error.response?.data || error.message
      );

      setErrorMessage(
        error.response?.data?.message ||
        "Login failed. Please check your email and password."
      );
    }
  };

  return (
    <div className="login-page">

      {/* Header */}
      <header className="login-header">

        <Link to="/" className="login-logo">
          <span className="login-logo-icon">G</span>
          <span>Graspify AI</span>
        </Link>

        <p className="login-header-text">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>

      </header>


      {/* Login Section */}
      <main className="login-section">

        <div className="login-card">

          {/* Heading */}
          <div className="login-heading">

            <span className="login-badge">
              ✨ AI-Powered Study Companion
            </span>

            <h1>
              Welcome back
            </h1>

            <p>
              Login to continue learning with Graspify AI.
            </p>

          </div>


          {/* Login Form */}
          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* Email */}
            <div className="login-form-group">

              <label htmlFor="login-email">
                Email
              </label>

              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>


            {/* Password */}
            <div className="login-form-group">

              <label htmlFor="login-password">
                Password
              </label>

              <div className="login-password-input">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* Login Button */}
            <button
              type="submit"
              className="login-submit"
            >
              Login →
            </button>

          </form>

          {errorMessage && (
            <div className="login-error-message">
              ✕ {errorMessage}
            </div>
          )}


          {/* Register Link */}
          <div className="login-register">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create Account
            </Link>

          </div>

        </div>

      </main>


      {/* Footer */}
      <footer className="login-footer">

        <p>
          © 2026 Graspify AI. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Login;