import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import TripSheet from "./components/TripSheet";
import PreviousTrip from "./components/PreviousTrip";
import PrivateRoutes from "./components/PrivateRoutes";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes element={<PrivateRoutes />}>
          <Route exact path="/" element={<Login />}></Route>
          <Route path="/sign_up" element={<Register />}></Route>
          <Route path="/forgot_password" element={<ForgotPassword />}></Route>
          <Route path="/trip_sheet" element={<TripSheet />}></Route>
          <Route path="/previous_trip" element={<PreviousTrip />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
