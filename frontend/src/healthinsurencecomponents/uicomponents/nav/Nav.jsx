
// import React from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import p1 from "../../images/p3.jpeg";

function Nav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session (if applicable)
    localStorage.removeItem("user"); // If you're storing user info

    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 2000, // Toast disappears after 2 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });

    setTimeout(() => {
      navigate("/"); // Redirect to homepage after toast
    }, 2000);
    console.log("lihkugy hi")
  };

  return (
    <div style={{ height: "100%" }}>
      <nav className="navbar navbar-light bg-light py-3">
        <div className="ms-4">
          <img
            src={p1}
            alt="Logo"
            width="180px"
            height="45px"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
        </div>

        <div className="d-flex align-items-center me-4">
          <div className="dropdown">
            <AccountCircleIcon
              fontSize="large"
              className="text-dark dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ cursor: "pointer" }}
            />
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => navigate("/my-account")}
                >
                  My Account
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => navigate("/my-policies")}
                >
                  My Policies
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout} // Logout function added here
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
}

export default Nav;
