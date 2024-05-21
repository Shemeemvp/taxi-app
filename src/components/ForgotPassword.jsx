import React, { useRef } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
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
              className="card bg-transparent text-white mb-5"
              style={{ borderRadius: "1rem", border: "3px solid #fff" }}
            >
              <Link to={'/'} className="ms-4 mt-4">
                <span
                  style={{cursor: "pointer"}}
                >
                  <i className="fa fa-arrow-left fw-bold text-white"></i>
                </span>
              </Link>
              <div className="card-body p-4 pt-2 py-5">
                <div className="mb-md-3 pb-3">
                  <h2 className="text-uppercase text-center mb-4">
                    Forgot Password.?
                  </h2>

                  <form
                    action="{% url 'updatePassword' %}"
                    method="post"
                    className="form"
                    onsubmit="return validateForm()"
                  >
                    <div className="form-outline mb-3 position-relative">
                      <input
                        type="text"
                        id="userName"
                        name="username"
                        className="form-control form-control-lg"
                        required
                      />
                      <label className="form-label text-left" for="userName">
                        User Name
                      </label>
                      <div
                        className="text-danger"
                        style={{ fontSize: "0.85rem", width: "max-content" }}
                        id="userErr"
                      ></div>
                    </div>

                    <div className="form-outline mb-3 position-relative">
                      <input
                        type="text"
                        id="password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                        name="password"
                        className="form-control form-control-lg"
                        required
                      />
                      <label className="form-label text-left" for="password">
                        Password
                      </label>
                      <div
                        className="text-danger"
                        style={{ fontSize: "0.85rem", width: "max-content" }}
                        id="passErr"
                      ></div>
                    </div>

                    <div className="form-outline mb-3 position-relative">
                      <input
                        type="password"
                        id="confirmPassword"
                        ref={passwordEle}
                        name="confirm_password"
                        className="form-control form-control-lg"
                        required
                      />
                      <i
                        className="fa fa-eye eye-icon"
                        style={{color: "#152733"}}
                        onClick={togglePasswordVisibility}
                      ></i>
                      <label class="form-label text-left" for="confirmPassword">
                        Confirm Password
                      </label>
                      <div
                        className="text-danger"
                        style={{ fontSize: "0.85rem", width: "max-content" }}
                        id="confirmPassErr"
                      ></div>
                    </div>

                    <div className="d-flex justify-content-center">
                      <button className="btn btn-outline-light px-5" type="submit">
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
