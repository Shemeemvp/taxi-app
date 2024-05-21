import React, { useRef } from "react";
import "./Register.css";
import { Link } from "react-router-dom";
function Register() {
  const passwordEle = useRef(null);
  function togglePasswordVisibility() {
    if (passwordEle.current.type == "text") {
      passwordEle.current.type = "password";
    } else {
      passwordEle.current.type = "text";
    }
  }

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card bg-transparent text-white my-5 mt-0"
              style={{ borderRadius: "1rem", border: "3px solid #fff" }}
            >
              <div className="card-body p-4 py-5">
                <div className="mb-md-3 pb-3">
                  <h2 className="text-uppercase text-center mb-4">
                    Create an account
                  </h2>

                  <form
                    action="{% url 'registerUser' %}"
                    method="post"
                    className="form"
                    onsubmit="return validateForm()"
                  >
                    <div className="form-outline mb-3">
                      <input
                        type="text"
                        id="fullName"
                        name="full_name"
                        className="form-control form-control-lg"
                        required
                      />
                      <label className="form-label text-left" for="fullName">
                        Full Name
                      </label>
                    </div>

                    <div className="form-outline mb-3">
                      <input
                        type="text"
                        id="userName"
                        name="user_name"
                        className="form-control form-control-lg"
                        required
                      />
                      <div className="text-danger" id="userNameErr"></div>
                      <label className="form-label text-left" for="userName">
                        User Name
                      </label>
                    </div>

                    <div className="form-outline mb-3">
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        onchange="checkPhone(this)"
                        className="form-control form-control-lg"
                        required
                      />
                      <div className="text-danger" id="warnphone"></div>
                      <label className="form-label text-left" for="mobile">
                        Mobile
                      </label>
                    </div>

                    <div className="form-outline mb-3 position-relative">
                      <input
                        type="password"
                        id="password"
                        ref={passwordEle}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                        name="password"
                        className="form-control form-control-lg"
                        required
                      />
                      <i
                        className="fa fa-eye eye-icon"
                        style={{ color: "#152733" }}
                        onClick={togglePasswordVisibility}
                      ></i>
                      <label className="form-label text-left" for="password">
                        Password
                      </label>
                      <div
                        className="text-danger"
                        style={{ fontSize: "0.85rem", width: "max-content" }}
                        id="passErr"
                      ></div>
                    </div>

                    <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-outline-light px-5"
                        type="submit"
                      >
                        Register
                      </button>
                    </div>
                  </form>
                </div>

                <div>
                  <p className="mb-0 text-center">
                    Already have an account?
                    <Link to={"/"}>
                      <a className="text-white-50 fw-bold">Login</a>
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

export default Register;
