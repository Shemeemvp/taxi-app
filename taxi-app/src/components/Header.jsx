import React from "react";
import "../components/Header.css";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function Header() {
  const navigate = useNavigate();
  const refreshToken = Cookies.get("access");
  const header = {
    Authorization: `Bearer ${refreshToken}`,
  };

  if (refreshToken) {
  } else {
    navigate("/");
  }
  const handleLogout = async () => {
    try {
      Cookies.remove("access");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  function handleToggle() {
    const toggleButton = document.getElementById("navbarToggleBtn");
    const navbar = document.getElementById("navbar");
    if (navbar.classList.contains("navbar-mobile")) {
      navbar.classList.remove("navbar-mobile");
    } else {
      navbar.classList.add("navbar-mobile");
    }

    if (toggleButton.classList.contains("bi-list")) {
      toggleButton.classList.remove("bi-list");
      toggleButton.classList.add("bi-x");
    } else {
      toggleButton.classList.remove("bi-x");
      toggleButton.classList.add("bi-list");
    }
  }
  return (
    <>
      <header id="header">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="logo d-flex align-items-center">
            <div className="logo_img">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/logo_3.png`}
                alt=""
              />
            </div>
            <h1>
              <a href="#">MILAYNA CAB</a>
            </h1>
          </div>

          <nav id="navbar" className="navbar">
            <ul>
              <li>
                <a className="nav-link" href="{% url 'tripSheetPage' %}">
                  <i className="fas fa-plus"></i> New Trip
                </a>
                <span className="hover"></span>
              </li>
              <li>
                <a className="nav-link" href="{% url 'allTrips' %}">
                  <i className="fas fa-road"></i> View Trips
                </a>
                <span className="hover"></span>
              </li>
              <li>
                <a className="nav-link" >
                  <i className="fa-solid fa-comment-dots"></i> Feedbacks
                </a>
                <span className="hover"></span>
              </li>
              <li>
                <a className="nav-link" onClick={() => { handleLogout() }}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </a>
                <span className="hover"></span>
              </li>
            </ul>
            <i
              className="bi bi-list mobile-nav-toggle"
              onClick={handleToggle}
              id="navbarToggleBtn"
            ></i>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;
