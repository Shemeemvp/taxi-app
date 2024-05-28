import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import TripSheet from "./components/TripSheet";
import PreviousTrip from "./components/PreviousTrip";
import PrivateRoutes from "./components/PrivateRoutes";
import AllTrips from "./components/AllTrips";
import Feedbacks from "./components/Feedbacks";
import ViewTscData from "./components/ViewTscData";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/sign_up" element={<Register />}></Route>
          <Route path="/forgot_password" element={<ForgotPassword />}></Route>
          <Route element={<PrivateRoutes />}>
            <Route path="/trip_sheet" element={<TripSheet />}></Route>
            <Route path="/previous_trip" element={<PreviousTrip />}></Route>
            <Route path="/all_trips" element={<AllTrips />}></Route>
            <Route path="/feedbacks" element={<Feedbacks />}></Route>
            <Route path="/view_tsc_data/:id/" element={<ViewTscData />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
