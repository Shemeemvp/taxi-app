import "./Login.css";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../functions/config";
import axios from "axios";
import Cookies from "js-cookie";

function Login() {
  const passwordEle = useRef(null);
  function togglePasswordVisibility() {
    if (passwordEle.current.type == "text") {
      passwordEle.current.type = "password";
    } else {
      passwordEle.current.type = "text";
    }
  }

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [responseData, setResponseData] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${config.base_url}/user_login/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // setResponseData(response.data);
      Cookies.set("access", response.data.access);

      console.log('===RESPONSE===',response);
      if (response.data.userID) {
        navigate("/");
      }

    } catch (error) {
      if(error.response.data.non_field_errors != ""){
        alert(error.response.data.non_field_errors)
      }
      console.log('===ERROR===',error);
    }
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card bg-transparent text-white"
              style={{ borderRadius: "1rem", border: "3px solid #fff" }}
            >
              <div className="card-body p-4 py-5">
                <div className="mb-md-3 pb-3">
                  <h2 className="fw-bold mb-4 text-uppercase text-center">
                    Login
                  </h2>

                  <form action="#" method="POST" className="form" onSubmit={handleSubmit}>
                    <div className="form-outline mb-3">
                      <input
                        type="text"
                        id="typeUsernameX"
                        name="username"
                        className="form-control form-control-lg"
                        onChange={handleInputChange}
                        value={formData.username}
                        required
                      />
                      <label
                        className="form-label text-left"
                        for="typeUsernameX"
                      >
                        User Name
                      </label>
                    </div>
                    <div className="form-outline position-relative mb-3">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        ref={passwordEle}
                        className="form-control form-control-lg"
                        onChange={handleInputChange}
                        value={formData.password}
                        required
                      />
                      <i
                        className="fa fa-eye eye-icon"
                        style={{ color: "#152733" }}
                        onClick={togglePasswordVisibility}
                      ></i>
                      <label className="form-label" for="password">
                        Password
                      </label>
                    </div>
                    <p className="small mb-3 pb-lg-2 text-center">
                      <Link to={"/forgot_password"}>
                        <a className="text-white-50">Forgot password?</a>
                      </Link>
                    </p>
                    <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-outline-light px-5"
                        type="submit"
                      >
                        Login
                      </button>
                    </div>
                  </form>
                </div>

                <div>
                  <p className="mb-0 text-center">
                    Don't have an account?{" "}
                    <Link to="/sign_up">
                      <a className="text-white-50 fw-bold">Sign Up</a>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
