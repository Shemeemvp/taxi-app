import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const PrivateRoutes = () => {
  const accessToken = Cookies.get("access") || "";
  if (accessToken === "") {
    var is_user = false;
    return <Navigate to="/" />;
  } else {
    var is_user = true;
  }
  // const is_staff = jwtDecode(accessToken).user_is_staff
  // const is_distributor = jwtDecode(accessToken).user_is_distributor

  return is_user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
