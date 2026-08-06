import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/", { replace: true });

    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}

export default Navbar;