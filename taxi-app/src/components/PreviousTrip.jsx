import React, { useEffect, useState } from "react";
import Header from "./Header";
import "../components/PreviousTrip.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../functions/config";

function PreviousTrip() {
  const navigate = useNavigate();
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

  const [tripNo, setTripNo] = useState("");
  const [tripDate, setTripDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [tripEndDate, setTripEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [tripDays, setTripDays] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [fixedCharge, setFixedCharge] = useState("");
  const [fixedHourCharge, setFixedHourCharge] = useState("");
  const [maxHour, setMaxHour] = useState("");
  const [extraHourCharge, setExtraHourCharge] = useState("");
  const [maxRange, setMaxRange] = useState("");
  const [extraKMCharge, setExtraKMCharge] = useState("");
  const [startKM, setStartKM] = useState("");
  const [endKM, setEndKM] = useState("");
  const [totalKiloMeter, setTotalKiloMeter] = useState("");
  const [driverName, setDriverName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [startPlace, setStartPlace] = useState("");
  const [startTime, setStartTime] = useState("");
  const [destination, setDestination] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [permit, setPermit] = useState("");
  const [toll, setToll] = useState("");
  const [parking, setParking] = useState("");
  const [entrance, setEntrance] = useState("");
  const [guidePlace, setGuidePlace] = useState("");
  const [guideFee, setGuideFee] = useState("");
  const [otherCharge, setOtherCharge] = useState("");
  const [otherChargeAmount, setOtherChargeAmount] = useState("");
  const [totalCharge, setTotalCharge] = useState("");
  const [advance, setAdvance] = useState("");
  const [balance, setBalance] = useState("");
  const [tripCharge, setTripCharge] = useState("");
  const [tripFixedCharge, setTripFixedCharge] = useState("");
  const [tripExtraCharge, setTripExtraCharge] = useState("");

  const ID = Cookies.get("ID");
  const fetchLastTrip = () => {
    axios
      .get(`${config.base_url}/get_last_trip/${ID}/`)
      .then((res) => {
        const data = res.data;
        console.log(data);
        setTripNo(data.trip_no);
        setTripDate(data.trip_date);
        setTripEndDate(data.trip_end_date);
        setTripDays(data.trip_days)
        setVehicleName(data.vehicle_name);
        setVehicleNumber(data.vehicle_no);
        setFixedCharge(data.fixed_charge);
        setFixedHourCharge(data.fixed_hour_charge);
        setMaxHour(data.max_hour);
        setExtraHourCharge(data.extra_hour_charge);
        setMaxRange(data.max_kilometer);
        setExtraKMCharge(data.extra_charge);
        setStartKM(data.starting_km);
        setEndKM(data.ending_km);
        setTotalKiloMeter(data.kilometers);
        setDriverName(data.driver_name);
        setGuestName(data.guest);
        setStartPlace(data.starting_place);
        setStartTime(data.starting_time);
        setDestination(data.destination);
        setArrivalTime(data.time_of_arrival);
        setPermit(data.permit);
        setToll(data.toll);
        setParking(data.parking);
        setEntrance(data.entrance);
        setGuidePlace(data.guide_fee_place);
        setGuideFee(data.guide_fee);
        setOtherCharge(data.other_charge_description);
        setOtherChargeAmount(data.other_charges);
        setTotalCharge(data.total_trip_expense);
        setAdvance(data.advance);
        setBalance(data.balance);
        setTripCharge(data.trip_charge);
        setTripFixedCharge(data.trip_fixed_charge);
        setTripExtraCharge(data.trip_extra_charge);
      })
      .catch((err) => {
        console.log('ERROR===',err);
        alert('No Previous Trip Found.!')
        navigate('/trip_sheet')
      });
  };

  useEffect(() => {
    fetchLastTrip();
  }, []);

  const handleTripDateChange = (e) => {
    const selectedDate = e.target.value;
    setTripDate(selectedDate);
    document.getElementById("endDate").setAttribute("min", selectedDate);
    countTripDays();

    calcTotalExpense();
  };

  const handleTripEndDateChange = (e) => {
    const selectedDate = e.target.value;
    setTripEndDate(selectedDate);
    document.getElementById("startDate").setAttribute("max", selectedDate);
    countTripDays();

    calcTotalExpense();
  };

  const handleFixedCharge = (e) => {
    const value = e.target.value;
    setFixedCharge(value);

    calcTotalExpense();
  };

  const handleMaxRangeCharge = (e) => {
    const value = e.target.value;
    setMaxRange(value);

    calcTotalExpense();
  };

  const handleExtraKMCharge = (e) => {
    const value = e.target.value;
    setExtraKMCharge(value);

    calcTotalExpense();
  };

  function countTripDays() {
    var date1 = new Date(document.getElementById("startDate").value);
    var date2 = new Date(document.getElementById("endDate").value);

    var diff = date2 - date1;

    var diffInDays = diff / (1000 * 60 * 60 * 24);
    document.getElementById("tripDays").value = diffInDays + 1;
  }

  const checkVehicleNumber = () => {
    var v_number = document.getElementById("vehicleNumber").value.toUpperCase();
    var v_numregexp = /^[A-Z]{2}[ -][0-9]{1,2} [A-Z]{1,2} [0-9]{4}$/;
    if (v_number.match(v_numregexp)) {
      document.getElementById("vehicleNumErr").innerHTML = "";
    } else {
      document.getElementById("vehicleNumErr").innerHTML =
        'Invalid format, Ex: "XX 1 X 1111", "XX 11 XX 1111"';
    }
  };

  function calcTripCharge() {
    var totTripCharge = 0;
    var tripFxCharge = 0;
    var totKm = 0;
    var extraKm = 0;
    var extraCharge = 0;
    var tripDays = parseInt(document.getElementById("tripDays").value || 1);
    var fxCharge = parseFloat(
      document.getElementById("fixedCharge").value || 0
    );
    var exCharge = parseFloat(
      document.getElementById("extraCharge").value || 0
    );
    var startKm = parseFloat(
      document.getElementById("startKilometer").value || 0
    );
    var endKm = parseFloat(document.getElementById("endKilometer").value || 0);
    var maxKM = parseFloat(document.getElementById("maxKilometer").value || 0);

    totKm = endKm - startKm;
    if (totKm > 0 && fxCharge > 0 && maxKM > 0) {
      tripFxCharge = tripDays * fxCharge;

      extraKm = totKm - tripDays * maxKM;
      if (extraKm > 0) {
        extraCharge = extraKm * exCharge;
      }

      totTripCharge = tripFxCharge + extraCharge;

      console.log("==========TRIP CHARGE========");
      console.log("TripDays->", tripDays);
      console.log(
        "fixed charge->",
        tripFxCharge,
        "extracharge->",
        extraCharge,
        "totaltrip->",
        totTripCharge
      );

      setTripCharge(totTripCharge);
      setTripFixedCharge(tripFxCharge);
      setTripExtraCharge(extraCharge);

      return totTripCharge;
    }
    return 0;
  }

  function calcTotalExpense() {
    var tripCharge = calcTripCharge();
    var permit = 0;
    var totToll = 0;
    var totParking = 0;
    var totEntrance = 0;
    var totGuideFee = 0;
    var totOtherCharge = 0;

    permit = parseFloat(document.getElementById("permitCharge").value || 0);

    document.querySelectorAll("input.km_toll").forEach(function (input) {
      totToll += parseFloat(input.value) || 0;
    });

    document.querySelectorAll("input.km_parking").forEach(function (input) {
      totParking += parseFloat(input.value) || 0;
    });

    document.querySelectorAll("input.km_entrance").forEach(function (input) {
      totEntrance += parseFloat(input.value) || 0;
    });

    document.querySelectorAll("input.km_guide_fee").forEach(function (input) {
      totGuideFee += parseFloat(input.value) || 0;
    });

    document
      .querySelectorAll("input.km_other_charge")
      .forEach(function (input) {
        totOtherCharge += parseFloat(input.value) || 0;
      });

    console.log("===========TOTAL EXPENSE=========");

    console.log("permit==", permit);
    console.log("toll==", totToll);
    console.log("parking==", totParking);
    console.log("Entrance==", totEntrance);
    console.log("GuideFee==", totGuideFee);
    console.log("otherCHarges==", totOtherCharge);

    var total =
      permit +
      parseFloat(tripCharge) +
      parseFloat(totToll) +
      parseFloat(totParking) +
      parseFloat(totEntrance) +
      parseFloat(totGuideFee) +
      parseFloat(totOtherCharge);
    setTotalCharge(total);
    rewriteBalance();
  }

  function handleEndKilometer(e) {
    var startKm = parseFloat(startKM || 0);
    var endKm = parseFloat(endKM || 0);
    if (endKm != "") {
      if (endKm < startKm) {
        setEndKM("");
        setTotalKiloMeter("");
        alert("Ending kilometer should be greater than starting kilometer.!");
      } else {
        var totKm = parseFloat(endKM || 0) - parseFloat(startKM || 0);
        setTotalKiloMeter(totKm);
      }
    }
    rewriteKM();
    calcTotalExpense();
  }

  function handleStartKilometer(e) {
    var startKm = parseFloat(startKM || 0);
    var endKm = parseFloat(endKM || 0);
    if (startKm != "" && endKm != "") {
      if (startKm > endKm) {
        setStartKM("");
        setTotalKiloMeter("");
        alert("Starting kilometer should be less than End kilometer.!");
      } else {
        var totKm = parseFloat(endKM || 0) - parseFloat(startKM || 0);
        setTotalKiloMeter(totKm);
      }
    }
    rewriteKM();
    calcTotalExpense();
  }

  function rewriteKM() {
    var totKm = 0;
    if (endKM != "") {
      totKm = parseFloat(endKM || 0) - parseFloat(startKM || 0);
      if (!(totKm < 0)) {
        setTotalKiloMeter(totKm);
      }
    }
  }

  function rewriteBalance() {
    var adv = parseFloat(advance || 0);
    var tot = parseFloat(totalCharge || 0);
    var bal = tot - adv;
    setBalance(bal);
  }

  return (
    <>
      <Header />
      <div className="form-body my-4">
        <div className="row">
          <div className="form-holder">
            <div className="form-content">
              <div className="form-items mb-5">
                <h3>Edit Trip Details</h3>
                <p>Update data or add extra expenses.</p>
                <div className="last_ride d-flex justify-content-end">
                  <Link className="btn btn-secondary btn-sm" to="/trip_sheet">
                    New Trip
                  </Link>
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
                        onChangeonChange={toggleTripSheetForm}
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
                          value={tripNo}
                          onChange={(e) => {
                            setTripNo(e.target.value);
                          }}
                          placeholder={tripNo}
                          readOnly
                        />
                        <label htmlFor="">Trip No.*</label>
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="date"
                          name="trip_date"
                          id="startDate"
                          onChange={handleTripDateChange}
                          value={tripDate}
                          required
                        />
                        <label htmlFor="">Date*</label>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <input
                        className="form-control"
                        type="text"
                        name="vehicle_name"
                        placeholder="Vehicle Name"
                        value={vehicleName}
                        onChange={(e) => {
                          setVehicleName(e.target.value);
                        }}
                        required
                      />
                      <label htmlFor="">Vehicle Name*</label>
                    </div>
                    <div className="col-md-12">
                      <input
                        className="form-control text-uppercase"
                        type="text"
                        name="vehicle_number"
                        onBlur={checkVehicleNumber}
                        placeholder="Vehicle No."
                        value={vehicleNumber}
                        onChange={(e) => {
                          setVehicleNumber(e.target.value);
                        }}
                        required
                      />
                      <div className="text-danger" id="vehicleNumErr"></div>
                      <label htmlFor="">Vehicle No.*</label>
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
                        value={fixedCharge}
                        onChange={handleFixedCharge}
                        required
                      />
                      <label htmlFor="">Fixed Charge*</label>
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
                        onChange={handleMaxRangeCharge}
                        value={maxRange}
                        required
                      />
                      <label htmlFor="">Max. Kilometer*</label>
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
                        onChange={handleExtraKMCharge}
                        value={extraKMCharge}
                        required
                      />
                      <label htmlFor="">Extra Running Charge*</label>
                    </div>

                    <div className="col-md-12">
                      <input
                        className="form-control"
                        type="text"
                        name="driver_name"
                        value={driverName}
                        onChange={(e) => {
                          setDriverName(e.target.value);
                        }}
                        placeholder="Diver Name"
                        required
                      />
                      <label htmlFor="">Driver Name*</label>
                    </div>

                    <div className="col-md-12">
                      <input
                        className="form-control"
                        type="text"
                        name="guest_name"
                        value={guestName}
                        onChange={(e) => {
                          setGuestName(e.target.value);
                        }}
                        placeholder="Guest Name"
                        required
                      />
                      <label htmlFor="">Guest Name*</label>
                    </div>

                    <div className="row gx-2">
                      <div className="col-12 col-sm-6">
                        <input
                          className="form-control"
                          type="number"
                          name="starting_kilometer"
                          value={startKM}
                          onBlur={handleStartKilometer}
                          onChange={(e) => {
                            setStartKM(e.target.value);
                          }}
                          id="startKilometer"
                          placeholder="0.0"
                          required
                        />
                        <label htmlFor="">Starting Kilometer</label>
                      </div>
                      <div className="col-12 col-sm-6">
                        <input
                          className="form-control"
                          type="number"
                          name="end_kilometer"
                          value={endKM}
                          onChange={(e) => {
                            setEndKM(e.target.value);
                          }}
                          onBlur={handleEndKilometer}
                          id="endKilometer"
                          placeholder="0.0"
                        />
                        <label htmlFor="">Ending Kilometer</label>
                      </div>
                    </div>

                    <div className="row gx-2">
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="text"
                          name="starting_place"
                          value={startPlace}
                          onChange={(e) => {
                            setStartPlace(e.target.value);
                          }}
                          placeholder="Starting Place"
                          required
                        />
                        <label htmlFor="">Starting Place*</label>
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="time"
                          name="starting_time"
                          value={startTime}
                          onChange={(e) => {
                            setStartTime(e.target.value);
                          }}
                          required
                        />
                        <label htmlFor="">Time</label>
                      </div>
                    </div>

                    <div className="row gx-2">
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="text"
                          name="destination"
                          value={destination}
                          onChange={(e) => {
                            setDestination(e.target.value);
                          }}
                          placeholder="Destination"
                        />
                        <label htmlFor="">Destination</label>
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="time"
                          value={arrivalTime}
                          onChange={(e) => {
                            setArrivalTime(e.target.value);
                          }}
                          name="time_of_arrival"
                        />
                        <label htmlFor="">Time of Arrival</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control"
                        type="date"
                        name="trip_end_date"
                        onChange={handleTripEndDateChange}
                        id="endDate"
                        value={tripEndDate}
                      />
                      <label htmlFor="">Trip End Date</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control"
                        id="tripDays"
                        type="number"
                        name="trip_days"
                        min="1"
                        step="1"
                        value={tripDays}
                        onChange={calcTotalExpense}
                      />
                      <label htmlFor="">Trip Days</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control"
                        type="number"
                        name="kilometer"
                        value={totalKiloMeter}
                        id="totalKilometer"
                        placeholder="Kilometers"
                        readOnly
                      />
                      <label htmlFor="">Kilometers</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control permit"
                        id="permitCharge"
                        type="number"
                        name="permit"
                        placeholder="Permit"
                        value={permit}
                        onChange={(e) => {
                          setPermit(e.target.value);
                        }}
                        onBlur={calcTotalExpense}
                      />
                      <label htmlFor="">Permit</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control km_toll"
                        type="number"
                        name="toll[]"
                        placeholder="Toll"
                        value={toll}
                        onChange={(e) => {
                          setToll(e.target.value);
                        }}
                        onBlur={calcTotalExpense}
                      />
                      <label htmlFor="">Toll</label>
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
                        value={parking}
                        onChange={(e) => {
                          setParking(e.target.value);
                        }}
                        onBlur={calcTotalExpense}
                      />
                      <label htmlFor="">Parking</label>
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
                        value={entrance}
                        onChange={(e) => {
                          setEntrance(e.target.value);
                        }}
                        onBlur={calcTotalExpense}
                      />
                      <label htmlFor="">Entrance</label>
                    </div>

                    <div className="col-12">
                      <hr className="text-white" />
                      <input
                        className="form-control"
                        type="text"
                        name="guide_place[]"
                        value={guidePlace}
                        onChange={(e) => {
                          setGuidePlace(e.target.value);
                        }}
                        placeholder="Guide Place.."
                      />
                      <input
                        className="form-control km_guide_fee"
                        type="number"
                        name="guide_fee[]"
                        placeholder="Guide Fee"
                        value={guideFee}
                        onChange={(e) => {
                          setGuideFee(e.target.value);
                        }}
                        onBlur={calcTotalExpense}
                      />
                      <label htmlFor="">Guide Fee</label>
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
                        value={otherCharge}
                        onChange={(e) => {
                          setOtherCharge(e.target.value);
                        }}
                        placeholder="Other charge description.."
                      />
                      <input
                        className="form-control km_other_charge"
                        type="number"
                        name="other_charge_amount[]"
                        placeholder="Other charge amount."
                        value={otherChargeAmount}
                        onChange={(e) => {
                          setOtherChargeAmount(e.target.value);
                        }}
                        onBlur={calcTotalExpense}
                      />
                      <label htmlFor="">Other Charge</label>
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
                        value={tripCharge}
                      />
                      <input
                        type="hidden"
                        id="tripFixedCharge"
                        name="trip_fixed_charge"
                        value={tripFixedCharge}
                      />
                      <input
                        type="hidden"
                        id="tripExtraCharge"
                        name="trip_extra_charge"
                        value={tripExtraCharge}
                      />
                      <input
                        className="form-control"
                        type="number"
                        id="totalTripExpense"
                        name="total"
                        value={totalCharge}
                        placeholder="Total Trip Expense"
                        readOnly
                      />
                      <label htmlFor="">
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
                        value={advance}
                        onChange={(e) => {
                          setAdvance(e.target.value);
                        }}
                        onBlur={rewriteBalance}
                      />
                      <label htmlFor="">Advance</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control"
                        type="number"
                        name="balance"
                        value={balance}
                        id="balanceAmount"
                        placeholder="Balance"
                        readOnly
                      />
                      <label htmlFor="">Balance</label>
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
                    onSubmit="return validateHours()"
                  >
                    <div className="row gx-2">
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="text"
                          name="trip_number"
                          value="{{tripNo}}"
                          placeholder="{{tripNo}}"
                          readOnly
                        />
                        <label htmlFor="">Trip No.*</label>
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="date"
                          name="trip_date"
                          id="hr_startDate"
                          onChange="hr_countTripDays()"
                          value="{% now 'Y-m-d' %}"
                          required
                        />
                        <label htmlFor="">Date*</label>
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
                      <label htmlFor="">Vehicle Name*</label>
                    </div>
                    <div className="col-md-12">
                      <input
                        className="form-control text-uppercase"
                        type="text"
                        name="vehicle_number"
                        onBlur="hr_checkVehicleNum(this)"
                        placeholder="Vehicle No."
                        required
                      />
                      <div className="text-danger" id="hr_vehicleNumErr"></div>
                      <label htmlFor="">Vehicle No.*</label>
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
                        onChange="calcTotalExpense()"
                        required
                      />
                      <label htmlFor="">Fixed Charge*</label>
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
                        onChange="calcTotalExpense()"
                        required
                      />
                      <label htmlFor="">Max. Hours*</label>
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
                        onChange="calcTotalExpense()"
                        required
                      />
                      <label htmlFor="">Extra Hour Charge*</label>
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
                            onChange="checkStartEndTime('start', this)"
                            type="datetime-local"
                            name="ride_start_time[]"
                            id="startTime1"
                            required
                          />
                          <label htmlFor="">Start</label>
                        </div>
                        <div className="col-12">
                          <input
                            className="form-control endTime"
                            onChange="checkStartEndTime('end',this)"
                            type="datetime-local"
                            name="ride_end_time[]"
                            id="endTime1"
                            required
                          />
                          <label htmlFor="">End</label>
                        </div>
                        <div className="col-12">
                          <input
                            className="form-control hours"
                            type="text"
                            name="ride_hours[]"
                            id="hours1"
                            readOnly
                          />
                          <label htmlFor="">Hours</label>
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
                      <label htmlFor="">Driver Name*</label>
                    </div>

                    <div className="col-md-12">
                      <input
                        className="form-control"
                        type="text"
                        name="guest_name"
                        placeholder="Guest Name"
                        required
                      />
                      <label htmlFor="">Guest Name*</label>
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
                        <label htmlFor="">Starting Kilometer</label>
                      </div>
                      <div className="col-12 col-sm-6">
                        <input
                          className="form-control"
                          type="number"
                          name="end_kilometer"
                          id="hr_endKilometer"
                          placeholder="0.0"
                        />
                        <label htmlFor="">Ending Kilometer</label>
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
                        <label htmlFor="">Starting Place*</label>
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="time"
                          name="starting_time"
                          required
                        />
                        <label htmlFor="">Time</label>
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
                        <label htmlFor="">Destination</label>
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="form-control"
                          type="time"
                          name="time_of_arrival"
                        />
                        <label htmlFor="">Time of Arrival</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control"
                        type="date"
                        name="trip_end_date"
                        onChange="hr_countTripDays()"
                        id="hr_endDate"
                        value="{% now 'Y-m-d' %}"
                      />
                      <label htmlFor="">Trip End Date</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control"
                        id="hr_tripDays"
                        type="number"
                        name="trip_days"
                        min="1"
                        step="1"
                        onChange="calcTotalHourExpense()"
                      />
                      <label htmlFor="">Trip Days</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control"
                        type="number"
                        name="kilometer"
                        value="0.0"
                        id="hr_totalKilometer"
                        placeholder="Kilometers"
                        readOnly
                      />
                      <label htmlFor="">Kilometers</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control permit"
                        id="hr_permitCharge"
                        type="number"
                        name="permit"
                        placeholder="Permit"
                        onChange="calcTotalHourExpense()"
                      />
                      <label htmlFor="">Permit</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control toll"
                        type="number"
                        name="toll[]"
                        placeholder="Toll"
                        onChange="calcTotalHourExpense()"
                      />
                      <label htmlFor="">Toll</label>
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
                        onChange="calcTotalHourExpense()"
                      />
                      <label htmlFor="">Parking</label>
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
                        onChange="calcTotalHourExpense()"
                      />
                      <label htmlFor="">Entrance</label>
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
                        onChange="calcTotalHourExpense()"
                      />
                      <label htmlFor="">Guide Fee</label>
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
                        onChange="calcTotalHourExpense()"
                      />
                      <label htmlFor="">Other Charge</label>
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
                        readOnly
                      />
                      <label htmlFor="">
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
                        onChange="hr_rewriteBalance()"
                      />
                      <label htmlFor="">Advance</label>
                    </div>

                    <div className="col-12">
                      <input
                        className="form-control"
                        type="number"
                        name="balance"
                        value="0.0"
                        id="hr_balanceAmount"
                        placeholder="Balance"
                        readOnly
                      />
                      <label htmlFor="">Balance</label>
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

export default PreviousTrip;
