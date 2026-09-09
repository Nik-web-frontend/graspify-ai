import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data.user);

      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const userName = user?.name || "User";

  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <nav className="dashboard-navbar">

      <div className="dashboard-logo">
        <span className="dashboard-logo-icon">G</span>
        <span>Graspify AI</span>
      </div>

      <div className="dashboard-nav-right">

        <div className="dashboard-user">

          <div className="dashboard-user-circle">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={userName}
              />
            ) : (
              userInitial
            )}
          </div>

          <span>{userName}</span>

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