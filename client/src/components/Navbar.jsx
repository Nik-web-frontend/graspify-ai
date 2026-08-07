import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/", { replace: true });

    };

    return (
        <button onClick={handleLogout} style={{height: '60px'}}>
            Logout
        </button>
    );
}

export default Navbar;