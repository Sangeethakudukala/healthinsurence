import React from "react";
// import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import p1 from "../../images/p3.jpeg";

function Nav() {
  return (
    <div style={{ height: "100%" }}>
      <nav className="navbar navbar-light bg-light py-3">
        <div className="ms-4">
          {/* <Link to="/"> Wrap the logo in a Link */}
            <img
              src={p1}
              alt="Logo"
              width="180px"
              height="45px"
              style={{ cursor: "pointer" }}
            />
          {/* </Link> */}
        </div>

        <div className="d-flex align-items-center me-4">
          <AccountCircleIcon fontSize="large" className="text-dark" />
        </div>
      </nav>
    </div>
  );
}

export default Nav;
