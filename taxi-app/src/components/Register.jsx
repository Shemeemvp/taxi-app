import React, { useRef, useState } from "react";
import "../components/Register.css";
import { Link, useNavigate } from "react-router-dom";
import config from "../functions/config";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

function Register() {
  const navigate = useNavigate();
  const passwordEle = useRef(null);
  function togglePasswordVisibility() {
    if (passwordEle.current.type == "text") {
      passwordEle.current.type = "password";
    } else {
      passwordEle.current.type = "text";
    }
  }

  const [formData, setFormData] = useState({
    full_name: "",
    user_name: "",
    mobile: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = validateForm();
    if (valid) {
      try {
        const response = await axios.post(
          `${config.base_url}/register_user/`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        Cookies.set("access", response.data.access);
        if (response.data) {
          Toast.fire({
            icon: "success",
            title: "Registered successfully",
          });
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        if(!error.response.data.status){
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
      }
    }
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  function checkUserPhone(phone) {
    document.getElementById("warnphone").textContent = "";
    var phoneNo = phone;
    if (phoneNo != "") {
      let data = {
        mobile:phone
      }
      axios.post(`${config.base_url}/check_phone_number/`,data).then((res)=>{
        console.log('RESPONSE==',res)
        if (res.data.is_exists) {
          alert(res.data.message);
          document.getElementById("warnphone").textContent = "Phone Number exists.";
        } else {
          document.getElementById("warnphone").textContent = "";
        }
      }).catch((err)=>{
        console.log('ERROR==',err)
      })
    }
  }

  function checkUsername(username) {
    document.getElementById("userNameErr").textContent = "";
    var usr = username;
    if (usr != "") {
      let data = {
        userName:username
      }
      axios.post(`${config.base_url}/check_username/`,data).then((res)=>{
        console.log('RESPONSE==',res)
        if (res.data.is_exists) {
          alert(res.data.message);
          document.getElementById("userNameErr").textContent = "Username exists.";
        } else {
          document.getElementById("userNameErr").textContent = "";
        }
      }).catch((err)=>{
        console.log('ERROR==',err)
      })
    }
  }

  function handlePhoneNumber(element) {
    var phoneinput = element.value;
    var phoneregexp = /^\d{10}$/;

    if (phoneinput.match(phoneregexp)) {
      document.getElementById("warnphone").innerHTML = "";
      checkUserPhone(phoneinput);
    } else {
      if (phoneinput.length > 10) {
        alert("Number should be 10 digit.");
        element.value = phoneinput.substring(0, 10);
        return;
      }
      document.getElementById("warnphone").innerHTML =
        "Please provide a valid Phone Number";
      alert("Please provide a valid Phone Number");
    }
  }

  function handleUsername() {
    var userNameInput = document.getElementById("userName");
    var userName = userNameInput.value.trim();
    if (userName !== "") {
      checkUsername(userName);
    }
  }

  function validateForm() {
    var name = document.getElementById("fullName").value.trim();
    var Mob = document.getElementById("mobile").value.trim();

    if (name === "") {
      alert("Please enter a valid name.!");
      return false;
    }

    if (Mob.length !== 10) {
      alert("Mobile Number should be 10 digits.!");
      return false;
    }
    return true;
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
                    action="#"
                    method="POST"
                    className="form"
                    onSubmit={handleSubmit}
                  >
                    <div className="form-outline mb-3">
                      <input
                        type="text"
                        id="fullName"
                        name="full_name"
                        className="form-control form-control-lg"
                        onChange={handleInputChange}
                        value={formData.full_name}
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
                        onChange={handleInputChange}
                        value={formData.user_name}
                        onBlur={handleUsername}
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
                        onChange={handleInputChange}
                        value={formData.mobile}
                        onBlur={(e)=>{handlePhoneNumber(e.target)}}
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
                        onChange={handleInputChange}
                        value={formData.password}
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
