import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <nav className="dashboard-navbar">

      <div className="dashboard-logo">
        <span className="dashboard-logo-icon">G</span>
        <span>Graspify AI</span>
      </div>

      <div className="dashboard-nav-right">

        <div className="dashboard-user">
          <div className="dashboard-user-circle">
            Y
          </div>

          <span>Yash</span>
        </div>

        <button
          className="dashboard-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;