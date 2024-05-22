import React from "react";
import Header from "./Header";
import "../components/TripSheet.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'

function TripSheet() {
  const navigate = useNavigate();
  const refreshToken = Cookies.get("access");
  const header = {
    Authorization: `Bearer ${refreshToken}`,
  };

  if (refreshToken) {
  } else {
    navigate("/");
  }
  function toggleTripSheetForm() {
    const toggleFormBtn = document.getElementById("toggleFormBtn");
    const kmBased = document.getElementById("km_based");
    const hrBased = document.getElementById("hr_based");

    if (toggleFormBtn.checked) {
      kmBased.style.display = "none";
      hrBased.style.display = "block";
    } else {
      hrBased.style.display = "none";
      kmBased.style.display = "block";
    }
  }

  return (
    <>
      <Header />
      <div className="form-body my-4">
        <div className="row">
          <div className="form-holder">
            <div className="form-content">
              <div className="form-items mb-5">
                <h3>Enter Trip Details</h3>
                <p>Fill in the data below.</p>
                <div className="last_ride d-flex justify-content-end">
                  <Link className="btn btn-secondary btn-sm" to="/previous_trip">Get Last Ride</Link>
                </div>
                <div className="d-flex justify-content-start">
                  <div
                    className="toggle_section d-flex align-items-center"
                    id="formToggleBtn"
                  >
                    <span className="text-white pe-1">KM Based</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        id="toggleFormBtn"
                        name="trip_charge_type"
                        onChange={toggleTripSheetForm}
                      />
                      <span className="slider blue"></span>
                    </label>
                    <span className="text-white ps-1">Hourly Based</span>
                  </div>
                </div>
                <div id="km_based" style={{ display: "block;" }}>
                  <form
                    action="#"
                    method="post"
                    className="requires-validation"
                    id="km_based_form"
                  >
                    <div className="row gx-2">
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="text"
                          name="trip_number"
                          value="{{tripNo}}"
                          placeholder="{{tripNo}}"
                          readonly
                        />
                        <label for="">Trip No.*</label>
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="date"
                          name="trip_date"
                          id="startDate"
                          onchange="countTripDays()"
                          value="{% now 'Y-m-d' %}"
                          required
                        />
                        <label for="">Date*</label>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <input
                        className="form-control"
                        type="text"
                        name="vehicle_name"
                        placeholder="Vehicle Name"
                        required
                      />
                      <label for="">Vehicle Name*</label>
                    </div>
                    <div className="col-md-12">
                      <input
                        className="form-control text-uppercase"
                        type="text"
                        name="vehicle_number"
                        onblur="checkVehicleNum(this)"
                        placeholder="Vehicle No."
                        required
                      />
                      <div className="text-danger" id="vehicleNumErr"></div>
                      <label for="">Vehicle No.*</label>
                    </div>

                    <div className="col-md-12">
                      <input
                        className="form-control"
                        type="number"
                        name="fixed_charge"
                        id="fixedCharge"
                        min="0"
                        step="any"
                        placeholder="Fixed charge"
                        onchange="calcTotalExpense()"
                        required
                      />
                      <label for="">Fixed Charge*</label>
                    </div>

                    <div className="col-md-12">
                      <input
                        className="form-control"
                        type="number"
                        name="max_kilometer"
                        id="maxKilometer"
                        min="1"
                        step="any"
                        placeholder="Max. KM Range with Fixed charge"
                        onchange="calcTotalExpense()"
                        required
                      />
                      <label for="">Max. Kilometer*</label>
                    </div>

                    <div className="col-md-12">
                      <input
                        className="form-control"
                        type="number"
                        name="extra_charge"
                        id="extraCharge"
                        min="0"
                        step="any"
                        placeholder="Extra charge per Kilo Meter"
                        onchange="calcTotalExpense()"
                        required
                      />
                      <label for="">Extra Running Charge*</label>
                    </div>

                    <div className="col-md-12">
                      <input
                        className="form-control"
                        type="text"
                        name="driver_name"
                        value="{{driver.full_name}}"
                        placeholder="Diver Name"
                        required
                      />
                      <label for="">Driver Name*</label>
                    </div>

                    <div className="col-md-12">
                      <input
                        className="form-control"
                        type="text"
                        name="guest_name"
                        placeholder="Guest Name"
                        required
                      />
                      <label for="">Guest Name*</label>
                    </div>

                    <div className="row gx-2">
                      <div className="col-12 col-sm-6">
                        <input
                          className="form-control"
                          type="number"
                          name="starting_kilometer"
                          id="startKilometer"
                          placeholder="0.0"
                          required
                        />
                        <label for="">Starting Kilometer</label>
                      </div>
                      <div className="col-12 col-sm-6">
                        <input
                          className="form-control"
                          type="number"
                          name="end_kilometer"
                          id="endKilometer"
                          placeholder="0.0"
                        />
                        <label for="">Ending Kilometer</label>
                      </div>
                    </div>

                    <div className="row gx-2">
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="text"
                          name="starting_place"
                          placeholder="Starting Place"
                          required
                        />
                        <label for="">Starting Place*</label>
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="time"
                          name="starting_time"
                          required
                        />
                        <label for="">Time</label>
                      </div>
                    </div>

                    <div className="row gx-2">
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="text"
                          name="destination"
                          placeholder="Destination"
                        />
                        <label for="">Destination</label>
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="time"
                          name="time_of_arrival"
                        />
                        <label for="">Time of Arrival</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control"
                        type="date"
                        name="trip_end_date"
                        onchange="countTripDays()"
                        id="endDate"
                        value="{% now 'Y-m-d' %}"
                      />
                      <label for="">Trip End Date</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control"
                        id="tripDays"
                        type="number"
                        name="trip_days"
                        min="1"
                        step="1"
                        onchange="calcTotalExpense()"
                      />
                      <label for="">Trip Days</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control"
                        type="number"
                        name="kilometer"
                        value="0.0"
                        id="totalKilometer"
                        placeholder="Kilometers"
                        readonly
                      />
                      <label for="">Kilometers</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control permit"
                        id="permitCharge"
                        type="number"
                        name="permit"
                        placeholder="Permit"
                        onchange="calcTotalExpense()"
                      />
                      <label for="">Permit</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control km_toll"
                        type="number"
                        name="toll[]"
                        placeholder="Toll"
                        onchange="calcTotalExpense()"
                      />
                      <label for="">Toll</label>
                    </div>
                    {/* <div className="add_toll" id="addAnotherToll"></div>
                              <div className="mt-1">
                                <span className="text-white" style={{cursor: "pointer;"}} id="addExpense" onclick="addNewToll()"><i className="fa fa-plus"></i> Toll</span>
                              </div> */}
                    <div className="col-12">
                      <input
                        className="form-control km_parking"
                        type="number"
                        name="parking[]"
                        placeholder="Parking"
                        onchange="calcTotalExpense()"
                      />
                      <label for="">Parking</label>
                    </div>
                    {/* <div className="add_parking" id="addAnotherParking"></div>
                              <div className="mt-1">
                                <span className="text-white" style={{cursor: "pointer;"}} id="addExpense" onclick="addNewParking()"><i className="fa fa-plus"></i> Parking</span>
                              </div> */}
                    <div className="col-12">
                      <input
                        className="form-control km_entrance"
                        type="number"
                        name="entrance[]"
                        placeholder="Entrance"
                        onchange="calcTotalExpense()"
                      />
                      <label for="">Entrance</label>
                    </div>

                    <div className="col-12">
                      <hr className="text-white" />
                      <input
                        className="form-control"
                        type="text"
                        name="guide_place[]"
                        placeholder="Guide Place.."
                      />
                      <input
                        className="form-control km_guide_fee"
                        type="number"
                        name="guide_fee[]"
                        placeholder="Guide Fee"
                        onchange="calcTotalExpense()"
                      />
                      <label for="">Guide Fee</label>
                    </div>
                    {/* <div className="add_guide_fee" id="addAnotherGuideFee"></div>
                              <div className="mt-1">
                                <span className="text-white" style={{cursor: "pointer;"}} id="addExpense" onclick="addNewGuideFee()"><i className="fa fa-plus"></i> Guide Fee</span>
                              </div> */}

                    <div className="col-12">
                      <hr className="text-white" />
                      <input
                        className="form-control"
                        type="text"
                        name="other_charge[]"
                        placeholder="Other charge description.."
                      />
                      <input
                        className="form-control km_other_charge"
                        type="number"
                        name="other_charge_amount[]"
                        placeholder="Other charge amount."
                        onchange="calcTotalExpense()"
                      />
                      <label for="">Other Charge</label>
                    </div>
                    {/* <div className="add_other_charge" id="addAnotherOtherCharge"></div>
                              <div className="mt-1">
                                <span className="text-white" style={{cursor: "pointer;"}} id="addExpense" onclick="addNewOtherCharge()"><i className="fa fa-plus"></i> Other Charge</span>
                              </div> */}

                    <hr className="text-white" />
                    <div className="col-12">
                      <input
                        type="hidden"
                        id="tripCharge"
                        name="trip_charge"
                        value="0"
                      />
                      <input
                        type="hidden"
                        id="tripFixedCharge"
                        name="trip_fixed_charge"
                        value="0"
                      />
                      <input
                        type="hidden"
                        id="tripExtraCharge"
                        name="trip_extra_charge"
                        value="0"
                      />
                      <input
                        className="form-control"
                        type="number"
                        id="totalTripExpense"
                        name="total"
                        value="0.0"
                        placeholder="Total Trip Expense"
                        readonly
                      />
                      <label for="">
                        <b>Total Charge</b>
                      </label>
                    </div>

                    <div className="col-12">
                      <input
                        className="form-control"
                        type="number"
                        name="advance"
                        id="advanceAmount"
                        placeholder="Advance"
                        onchange="rewriteBalance()"
                      />
                      <label for="">Advance</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control"
                        type="number"
                        name="balance"
                        value="0.0"
                        id="balanceAmount"
                        placeholder="Balance"
                        readonly
                      />
                      <label for="">Balance</label>
                    </div>

                    <div className="form-button d-flex justify-content-center mt-3">
                      <button
                        id="endTrip"
                        type="submit"
                        className="btn btn-primary"
                      >
                        Save Trip
                      </button>
                    </div>
                  </form>
                </div>

                <div id="hr_based" style={{ display: "none" }}>
                  <form
                    action="#"
                    method="post"
                    className="requires-validation"
                    id="hr_based_form"
                    onsubmit="return validateHours()"
                  >
                    <div className="row gx-2">
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="text"
                          name="trip_number"
                          value="{{tripNo}}"
                          placeholder="{{tripNo}}"
                          readonly
                        />
                        <label for="">Trip No.*</label>
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="date"
                          name="trip_date"
                          id="hr_startDate"
                          onchange="hr_countTripDays()"
                          value="{% now 'Y-m-d' %}"
                          required
                        />
                        <label for="">Date*</label>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <input
                        className="form-control"
                        type="text"
                        name="vehicle_name"
                        placeholder="Vehicle Name"
                        required
                      />
                      <label for="">Vehicle Name*</label>
                    </div>
                    <div className="col-md-12">
                      <input
                        className="form-control text-uppercase"
                        type="text"
                        name="vehicle_number"
                        onblur="hr_checkVehicleNum(this)"
                        placeholder="Vehicle No."
                        required
                      />
                      <div className="text-danger" id="hr_vehicleNumErr"></div>
                      <label for="">Vehicle No.*</label>
                    </div>

                    <div className="col-md-12">
                      <input
                        className="form-control"
                        type="number"
                        name="fixed_hour_charge"
                        id="fixedHourCharge"
                        min="0"
                        step="any"
                        placeholder="Fixed charge"
                        onchange="calcTotalExpense()"
                        required
                      />
                      <label for="">Fixed Charge*</label>
                    </div>

                    <div className="col-md-12">
                      <input
                        className="form-control"
                        type="number"
                        name="max_hour"
                        id="maxHours"
                        min="1"
                        step="any"
                        placeholder="Max. Hours with Fixed charge"
                        onchange="calcTotalExpense()"
                        required
                      />
                      <label for="">Max. Hours*</label>
                    </div>

                    <div className="col-md-12">
                      <input
                        className="form-control"
                        type="number"
                        name="extra_hour_charge"
                        id="extraHourCharge"
                        min="0"
                        step="any"
                        placeholder="Extra charge per Hour"
                        onchange="calcTotalExpense()"
                        required
                      />
                      <label for="">Extra Hour Charge*</label>
                    </div>

                    <hr className="text-white" />
                    <center>
                      <h6 className="text-white">Ride Hours</h6>
                    </center>
                    <div className="rideHours" id="rideHours">
                      <div id="rideDate1" className="ride_date">
                        <div className="col-12">
                          <input
                            className="form-control startTime"
                            onchange="checkStartEndTime('start', this)"
                            type="datetime-local"
                            name="ride_start_time[]"
                            id="startTime1"
                            required
                          />
                          <label for="">Start</label>
                        </div>
                        <div className="col-12">
                          <input
                            className="form-control endTime"
                            onchange="checkStartEndTime('end',this)"
                            type="datetime-local"
                            name="ride_end_time[]"
                            id="endTime1"
                            required
                          />
                          <label for="">End</label>
                        </div>
                        <div className="col-12">
                          <input
                            className="form-control hours"
                            type="text"
                            name="ride_hours[]"
                            id="hours1"
                            readonly
                          />
                          <label for="">Hours</label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-1">
                      <span
                        className="text-white"
                        style={{ cursor: "pointer;" }}
                        id="addHour"
                        onclick="addNewHour()"
                      >
                        <i className="fa fa-plus"></i> Hour
                      </span>
                    </div>

                    <hr className="text-white" />
                    <div className="col-md-12">
                      <input
                        className="form-control"
                        type="text"
                        name="driver_name"
                        value="{{driver.full_name}}"
                        placeholder="Diver Name"
                        required
                      />
                      <label for="">Driver Name*</label>
                    </div>

                    <div className="col-md-12">
                      <input
                        className="form-control"
                        type="text"
                        name="guest_name"
                        placeholder="Guest Name"
                        required
                      />
                      <label for="">Guest Name*</label>
                    </div>

                    <div className="row gx-2">
                      <div className="col-12 col-sm-6">
                        <input
                          className="form-control"
                          type="number"
                          name="starting_kilometer"
                          id="hr_startKilometer"
                          placeholder="0.0"
                          required
                        />
                        <label for="">Starting Kilometer</label>
                      </div>
                      <div className="col-12 col-sm-6">
                        <input
                          className="form-control"
                          type="number"
                          name="end_kilometer"
                          id="hr_endKilometer"
                          placeholder="0.0"
                        />
                        <label for="">Ending Kilometer</label>
                      </div>
                    </div>

                    <div className="row gx-2">
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="text"
                          name="starting_place"
                          placeholder="Starting Place"
                          required
                        />
                        <label for="">Starting Place*</label>
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="time"
                          name="starting_time"
                          required
                        />
                        <label for="">Time</label>
                      </div>
                    </div>

                    <div className="row gx-2">
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="text"
                          name="destination"
                          placeholder="Destination"
                        />
                        <label for="">Destination</label>
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="time"
                          name="time_of_arrival"
                        />
                        <label for="">Time of Arrival</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control"
                        type="date"
                        name="trip_end_date"
                        onchange="hr_countTripDays()"
                        id="hr_endDate"
                        value="{% now 'Y-m-d' %}"
                      />
                      <label for="">Trip End Date</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control"
                        id="hr_tripDays"
                        type="number"
                        name="trip_days"
                        min="1"
                        step="1"
                        onchange="calcTotalHourExpense()"
                      />
                      <label for="">Trip Days</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control"
                        type="number"
                        name="kilometer"
                        value="0.0"
                        id="hr_totalKilometer"
                        placeholder="Kilometers"
                        readonly
                      />
                      <label for="">Kilometers</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control permit"
                        id="hr_permitCharge"
                        type="number"
                        name="permit"
                        placeholder="Permit"
                        onchange="calcTotalHourExpense()"
                      />
                      <label for="">Permit</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control toll"
                        type="number"
                        name="toll[]"
                        placeholder="Toll"
                        onchange="calcTotalHourExpense()"
                      />
                      <label for="">Toll</label>
                    </div>
                    {/* <div className="add_toll" id="hr_addAnotherToll"></div>
                              <div className="mt-1">
                                <span className="text-white" style={{cursor: "pointer;"}} id="hr_addExpense" onclick="hr_addNewToll()"><i className="fa fa-plus"></i> Toll</span>
                              </div> */}
                    <div className="col-12">
                      <input
                        className="form-control parking"
                        type="number"
                        name="parking[]"
                        placeholder="Parking"
                        onchange="calcTotalHourExpense()"
                      />
                      <label for="">Parking</label>
                    </div>
                    {/* <div className="add_parking" id="hr_addAnotherParking"></div>
                              <div className="mt-1">
                                <span className="text-white" style={{cursor: "pointer;"}} id="hr_addExpense" onclick="hr_addNewParking()"><i className="fa fa-plus"></i> Parking</span>
                              </div> */}
                    <div className="col-12">
                      <input
                        className="form-control entrance"
                        type="number"
                        name="entrance[]"
                        placeholder="Entrance"
                        onchange="calcTotalHourExpense()"
                      />
                      <label for="">Entrance</label>
                    </div>

                    <div className="col-12">
                      <hr className="text-white" />
                      <input
                        className="form-control"
                        type="text"
                        name="guide_place[]"
                        placeholder="Guide Place.."
                      />
                      <input
                        className="form-control guide_fee"
                        type="number"
                        name="guide_fee[]"
                        placeholder="Guide Fee"
                        onchange="calcTotalHourExpense()"
                      />
                      <label for="">Guide Fee</label>
                    </div>
                    {/* <div className="add_guide_fee" id="hr_addAnotherGuideFee"></div>
                              <div className="mt-1">
                                <span className="text-white" style={{cursor: "pointer;"}} id="hr_addExpense" onclick="hr_addNewGuideFee()"><i className="fa fa-plus"></i> Guide Fee</span>
                              </div> */}

                    <div className="col-12">
                      <hr className="text-white" />
                      <input
                        className="form-control"
                        type="text"
                        name="other_charge[]"
                        placeholder="Other charge description.."
                      />
                      <input
                        className="form-control other_charge"
                        type="number"
                        name="other_charge_amount[]"
                        placeholder="Other charge amount."
                        onchange="calcTotalHourExpense()"
                      />
                      <label for="">Other Charge</label>
                    </div>
                    {/* <div className="add_other_charge" id="hr_addAnotherOtherCharge"></div>
                              <div className="mt-1">
                                <span className="text-white" style={{cursor: "pointer;"}} id="hr_addExpense" onclick="hr_addNewOtherCharge()"><i className="fa fa-plus"></i> Other Charge</span>
                              </div> */}

                    <hr className="text-white" />
                    <div className="col-12">
                      <input
                        type="hidden"
                        id="hr_tripCharge"
                        name="trip_charge"
                        value="0"
                      />
                      <input
                        type="hidden"
                        id="hr_tripFixedCharge"
                        name="trip_fixed_charge"
                        value="0"
                      />
                      <input
                        type="hidden"
                        id="hr_tripExtraCharge"
                        name="trip_extra_charge"
                        value="0"
                      />
                      <input
                        className="form-control"
                        type="number"
                        id="hr_totalTripExpense"
                        name="total"
                        value="0.0"
                        placeholder="Total Trip Expense"
                        readonly
                      />
                      <label for="">
                        <b>Total Charge</b>
                      </label>
                    </div>

                    <div className="col-12">
                      <input
                        className="form-control"
                        type="number"
                        name="advance"
                        id="hr_advanceAmount"
                        placeholder="Advance"
                        onchange="hr_rewriteBalance()"
                      />
                      <label for="">Advance</label>
                    </div>

                    <div className="col-12">
                      <input
                        className="form-control"
                        type="number"
                        name="balance"
                        value="0.0"
                        id="hr_balanceAmount"
                        placeholder="Balance"
                        readonly
                      />
                      <label for="">Balance</label>
                    </div>

                    <div className="form-button d-flex justify-content-center mt-3">
                      <button
                        id="hr_endTrip"
                        type="submit"
                        className="btn btn-primary"
                      >
                        Save Trip
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TripSheet;
