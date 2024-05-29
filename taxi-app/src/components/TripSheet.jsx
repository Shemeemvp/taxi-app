import React, { useEffect, useState } from "react";
import Header from "./Header";
import "../components/TripSheet.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../functions/config";
import Swal from "sweetalert2";

function TripSheet() {
  const navigate = useNavigate();
  const refreshToken = Cookies.get("access");
  const header = {
    Authorization: `Bearer ${refreshToken}`,
  };

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

  const [rideHours, setRideHours] = useState([
    {
      id: 1,
      startTime: "",
      endTime: "",
      hours: "",
    },
  ]);

  const ID = Cookies.get("ID");

  const fetchTripNo = async () => {
    try {
      const response = await axios.get(`${config.base_url}/get_trip_no/${ID}/`);
      console.log("DRIVER RESPONSE===", response);
      setTripNo(response.data.tripNo);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTripNo();
  }, []);

  useEffect(() => {
    countTripDays();
  }, []);

  const fetchDriver = async () => {
    try {
      const response = await axios.get(`${config.base_url}/get_driver/${ID}/`);
      console.log("DRIVER RESPONSE===", response);
      setDriverName(response.data.name);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDriver();
  }, []);

  const handleTripDateChange = (e) => {
    const selectedDate = e.target.value;
    document.getElementById("endDate").setAttribute("min", selectedDate);
    countTripDays();

    calcTotalExpense();
  };

  const handleTripEndDateChange = (e) => {
    const selectedDate = e.target.value;
    document.getElementById("startDate").setAttribute("max", selectedDate);
    countTripDays();

    calcTotalExpense();
  };

  const handleFixedCharge = (e) => {
    const value = e.target.value;
    setFixedCharge(value);

    calcTotalExpense();
  };

  const handleMaxRange = (e) => {
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
    var date1 = new Date(tripDate);
    var date2 = new Date(tripEndDate);

    var diff = date2 - date1;

    var diffInDays = diff / (1000 * 60 * 60 * 24);
    setTripDays(diffInDays + 1);
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
    var trpDys = parseInt(tripDays || 1);
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
      tripFxCharge = trpDys * fxCharge;

      extraKm = totKm - trpDys * maxKM;
      if (extraKm > 0) {
        extraCharge = extraKm * exCharge;
      }

      totTripCharge = tripFxCharge + extraCharge;

      console.log("==========TRIP CHARGE========");
      console.log("TripDays->", trpDys);
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
    rewriteBalance(total, advance);
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

  function rewriteBalance(total, advance) {
    var adv = parseFloat(advance || 0);
    var tot = parseFloat(total || 0);
    var bal = tot - adv;
    setBalance(bal);
  }

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

  function checkEmpty(value){
    if(value == ""){
      return null
    }else{
      return value
    }
  }

  const handleKilometerSubmit = async (e) => {
    e.preventDefault();
    const ID = Cookies.get("ID");
    const data = {
      user_id: ID,
      trip_no: tripNo,
      trip_date: tripDate,
      driver_name: driverName,
      guest: guestName,
      vehicle_no: vehicleNumber,
      vehicle_name: vehicleName,
      trip_charge_type: "kilometer",
      fixed_hour_charge: null,
      max_hour: null,
      extra_hour_charge: null,
      fixed_charge: fixedCharge,
      max_kilometer: maxRange,
      extra_charge: extraKMCharge,
      starting_km: startKM,
      ending_km: checkEmpty(endKM),
      trip_end_date: tripEndDate,
      starting_place: startPlace,
      starting_time: startTime,
      destination: checkEmpty(destination),
      time_of_arrival: checkEmpty(arrivalTime),
      kilometers: parseFloat(totalKiloMeter || 0),
      permit: checkEmpty(permit),
      toll: checkEmpty(toll),
      parking: checkEmpty(parking),
      entrance: checkEmpty(entrance),
      guide_fee: checkEmpty(guideFee),
      guide_fee_place: guidePlace,
      other_charge_description: otherCharge,
      other_charges: checkEmpty(otherChargeAmount),
      advance: checkEmpty(advance),
      trip_fixed_charge: parseFloat(tripFixedCharge || 0),
      trip_extra_charge: parseFloat(tripExtraCharge || 0),
      trip_charge: parseFloat(tripCharge || 0),
      total_trip_expense: parseFloat(totalCharge || 0),
      trip_days: tripDays,
      balance: parseFloat(balance || 0),
    };

    axios
      .post(`${config.base_url}/end_current_trip/`, data)
      .then((res) => {
        console.log(res);
        Toast.fire({
          icon: "success",
          title: "Trip created successfully",
        });

        navigate("/previous_trip");
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: `${err.response.data.non_field_errors}`,
        });
      });
  };

  // HOUR FORM FUNCTIONS

  function validateHours() {
    var tripDays = document.getElementById("hr_tripDays").value;

    if (tripDays != rideHours.length) {
      alert("Trip days and Daily Hours entries are not equal.!");
      return false;
    }

    return true;
  }

  const handleTripDateChange_hr = (e) => {
    const selectedDate = e.target.value;
    document.getElementById("endDate").setAttribute("min", selectedDate);
    countTripDays();

    calcTotalHourExpense();
  };

  const handleTripEndDateChange_hr = (e) => {
    const selectedDate = e.target.value;
    document.getElementById("startDate").setAttribute("max", selectedDate);
    countTripDays();

    calcTotalHourExpense();
  };

  const handleFixedHourCharge = (e) => {
    const value = e.target.value;
    setFixedHourCharge(value);

    calcTotalHourExpense();
  };

  const handleMaxHour = (e) => {
    const value = e.target.value;
    setMaxHour(value);

    calcTotalHourExpense();
  };

  const handleExtraHourCharge = (e) => {
    const value = e.target.value;
    setExtraHourCharge(value);

    calcTotalHourExpense();
  };

  const addNewHour = () => {
    const newId = rideHours.length + 1;
    setRideHours((prevState) => [
      ...prevState,
      {
        id: newId,
        startTime: "",
        endTime: "",
        hours: "",
      },
    ]);
  };

  const handleHourInputChange = (id, event) => {
    const { name, value } = event.target;
    console.log(name, value);
    setRideHours((prevState) =>
      prevState.map((hour) =>
        hour.id === id ? { ...hour, [name]: value } : hour
      )
    );
  };

  function removeNewHour(id) {
    setRideHours((prevState) => prevState.filter((hour) => hour.id !== id));
    calcTotalHourExpense();
  }

  function checkStartEndTime(type, input) {
    if (type === "start") {
      var id = input.id.slice(9);
    } else {
      var id = input.id.slice(7);
    }
    var startInput = document.getElementById("startTime" + id);
    var endInput = document.getElementById("endTime" + id);

    var startDateTime = new Date(startInput.value);
    var endDateTime = new Date(endInput.value);

    if (type === "start") {
      endInput.min = formatDate(startDateTime);
      if (startDateTime != "" && endDateTime != "") {
        if (startDateTime > endDateTime) {
          alert(
            "Start date and time should be lesser than end date and time.!"
          );
          startInput.value = "";
        }
      }
    } else {
      startInput.max = formatDate(endDateTime);
      if (startDateTime != "" && endDateTime != "") {
        if (endDateTime < startDateTime) {
          alert(
            "End date and time should be greater than start date and time.!"
          );
          endInput.value = "";
        }
      }
    }
  }

  function getHours(id) {
    var strt = document.getElementById("startTime" + id).value;
    var end = document.getElementById("endTime" + id).value;
    console.log(strt, end);
    var hrs = getTimeDifferenceInHours(strt, end);
    var totalTime = hrs.hours + ":" + hrs.minutes;
    if (strt != "" && end != "") {
      document.getElementById("hours" + id).value = totalTime;
      updateHours(id, totalTime);
    }
    return totalTime;
  }

  function updateHours(id, newHours) {
    console.log("UPDATE HOUR", id, newHours);
    console.log("==HRS==", rideHours);
    setRideHours((prevState) =>
      prevState.map((hour) =>
        hour.id === id ? { ...hour, hours: newHours } : hour
      )
    );
  }

  function getTimeDifferenceInHours(startTime, endTime) {
    var startDate = new Date(startTime);
    var endDate = new Date(endTime);

    var timeDifference = endDate.getTime() - startDate.getTime();

    var hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    var minutesDifference = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    return { hours: hoursDifference, minutes: minutesDifference };
  }

  function formatDate(inputString) {
    var date = new Date(inputString);

    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    var hours = String(date.getHours()).padStart(2, "0");
    var minutes = String(date.getMinutes()).padStart(2, "0");

    var formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    return formattedDate;
  }

  function handleEndKilometer_hr(e) {
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
    calcTotalHourExpense();
  }

  function handleStartKilometer_hr(e) {
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
    calcTotalHourExpense();
  }

  function calcHoursTripCharge(){
    var totTripCharge = 0
    var tripFxCharge = 0
    var totHr = 0
    var extraHr = 0
    var extraCharge = 0
    var fxCharge = parseFloat(fixedHourCharge || 0)
    var exCharge = parseFloat(extraHourCharge || 0)
    var maxHr = parseFloat(maxHour || 0)

    rideHours.map((hour)=>{
      var startHr = hour.startTime;
      var endHr = hour.endTime;
      var totHrs = getTimeDifferenceInHours(startHr, endHr)

      var hr = totHrs.hours
      var min = totHrs.minutes
      if(min != 0){
        totHr = hr + (min / 60)
      }else{
        totHr = hr
      }

      if(totHr > 0 && fxCharge > 0 && maxHr > 0){
        tripFxCharge += fxCharge
        extraHr = totHr - maxHr
        if(extraHr > 0){
          extraCharge += extraHr * exCharge
        }
      }
    })

    totTripCharge = tripFxCharge + extraCharge

    setTripCharge(totTripCharge);
    setTripFixedCharge(tripFxCharge);
    setTripExtraCharge(extraCharge);
    return totTripCharge

  }

  function calcTotalHourExpense(){
    var tripCharge = calcHoursTripCharge()
    var prmt = 0
    var totToll = 0
    var totParking = 0
    var totEntrance = 0
    var totGuideFee = 0
    var totOtherCharge = 0

    prmt = parseFloat(permit || 0);

    document.querySelectorAll("#hr_based_form input.toll").forEach(function (input) {
      totToll += parseFloat(input.value) || 0;
    });

    document.querySelectorAll("#hr_based_form input.parking").forEach(function (input) {
      totParking += parseFloat(input.value) || 0;
    });

    document.querySelectorAll("#hr_based_form input.entrance").forEach(function (input) {
      totEntrance += parseFloat(input.value) || 0;
    });

    document.querySelectorAll("#hr_based_form input.guide_fee").forEach(function (input) {
      totGuideFee += parseFloat(input.value) || 0;
    });

    document.querySelectorAll("#hr_based_form input.other_charge").forEach(function (input) {
      totOtherCharge += parseFloat(input.value) || 0;
    });
    
    var total = prmt + parseFloat(tripCharge) + parseFloat(totToll) + parseFloat(totParking) + parseFloat(totEntrance) + parseFloat(totGuideFee) + parseFloat(totOtherCharge)
    setTotalCharge(total);
    rewriteBalance(total, advance);

  }

  const handleHourSubmit = async (e) => {
    e.preventDefault();
    let validate = validateHours();
    const ID = Cookies.get("ID");
    const data = {
      user_id: ID,
      trip_no: tripNo,
      trip_date: tripDate,
      driver_name: driverName,
      guest: guestName,
      vehicle_no: vehicleNumber,
      vehicle_name: vehicleName,
      trip_charge_type: "hour",
      fixed_hour_charge: fixedHourCharge,
      max_hour: maxHour,
      extra_hour_charge: extraHourCharge,
      fixed_charge: null,
      max_kilometer: null,
      extra_charge: null,
      starting_km: startKM,
      ending_km: checkEmpty(endKM),
      trip_end_date: tripEndDate,
      starting_place: startPlace,
      starting_time: startTime,
      destination: checkEmpty(destination),
      time_of_arrival: checkEmpty(arrivalTime),
      kilometers: parseFloat(totalKiloMeter || 0),
      permit: checkEmpty(permit),
      toll: checkEmpty(toll),
      parking: checkEmpty(parking),
      entrance: checkEmpty(entrance),
      guide_fee: checkEmpty(guideFee),
      guide_fee_place: guidePlace,
      other_charge_description: otherCharge,
      other_charges: checkEmpty(otherChargeAmount),
      advance: checkEmpty(advance),
      trip_fixed_charge: parseFloat(tripFixedCharge || 0),
      trip_extra_charge: parseFloat(tripExtraCharge || 0),
      trip_charge: parseFloat(tripCharge || 0),
      total_trip_expense: parseFloat(totalCharge || 0),
      trip_days: tripDays,
      balance: parseFloat(balance || 0),
      ride_hours: rideHours
    };

    if (validate) {
      axios
        .post(`${config.base_url}/end_hour_based_trip/`, data)
        .then((res) => {
          console.log(res);
          Toast.fire({
            icon: "success",
            title: "Trip created successfully",
          });

          navigate("/previous_trip");
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: `${err.response.data.non_field_errors}`,
          });
        });
    }
  };

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
                  <Link
                    className="btn btn-secondary btn-sm"
                    to="/previous_trip"
                  >
                    Get Last Ride
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
                        onChange={toggleTripSheetForm}
                      />
                      <span className="slider blue"></span>
                    </label>
                    <span className="text-white ps-1">Hourly Based</span>
                  </div>
                </div>
                <div id="km_based" style={{ display: "block" }}>
                  <form
                    action="#"
                    method="post"
                    className="requires-validation"
                    id="km_based_form"
                    onSubmit={handleKilometerSubmit}
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
                          onBlur={handleTripDateChange}
                          onChange={(e)=>setTripDate(e.target.value)}
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
                        onChange={(e) => {
                          setVehicleName(e.target.value);
                        }}
                        value={vehicleName}
                        required
                      />
                      <label htmlFor="">Vehicle Name*</label>
                    </div>
                    <div className="col-md-12">
                      <input
                        className="form-control text-uppercase"
                        type="text"
                        id="vehicleNumber"
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
                        onChange={handleMaxRange}
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
                        id="guestName"
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
                          id="startKilometer"
                          value={startKM}
                          onBlur={handleStartKilometer}
                          onChange={(e) => {
                            setStartKM(e.target.value);
                          }}
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
                        onBlur={handleTripEndDateChange}
                        value={tripEndDate}
                        onChange={(e)=>setTripEndDate(e.target.value)}
                        id="endDate"
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
                        value={tripDays}
                        onChange={(e) => {
                          setTripDays(e.target.value);
                        }}
                        step="1"
                        onBlur={calcTotalExpense}
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
                                <span className="text-white" style={{cursor: "pointer"}} id="addExpense" onclick="addNewToll()"><i className="fa fa-plus"></i> Toll</span>
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
                                <span className="text-white" style={{cursor: "pointer"}} id="addExpense" onclick="addNewParking()"><i className="fa fa-plus"></i> Parking</span>
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
                                <span className="text-white" style={{cursor: "pointer"}} id="addExpense" onclick="addNewGuideFee()"><i className="fa fa-plus"></i> Guide Fee</span>
                              </div> */}

                    <div className="col-12">
                      <hr className="text-white" />
                      <input
                        className="form-control"
                        type="text"
                        value={otherCharge}
                        onChange={(e) => {
                          setOtherCharge(e.target.value);
                        }}
                        name="other_charge[]"
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
                                <span className="text-white" style={{cursor: "pointer"}} id="addExpense" onclick="addNewOtherCharge()"><i className="fa fa-plus"></i> Other Charge</span>
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
                        onBlur={() => {
                          rewriteBalance(totalCharge, advance);
                        }}
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
                    className="requires-validation"
                    id="hr_based_form"
                    onSubmit={handleHourSubmit}
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
                          id="hr_startDate"
                          onBlur={handleTripDateChange_hr}
                          value={tripDate}
                          onChange={(e)=>setTripDate(e.target.value)}
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
                        onChange={(e) => {
                          setVehicleName(e.target.value);
                        }}
                        value={vehicleName}
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
                        placeholder="Fixed Hours charge"
                        value={fixedHourCharge}
                        onChange={handleFixedHourCharge}
                        required
                      />
                      <label htmlFor="">Fixed Hours Charge*</label>
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
                        onChange={handleMaxHour}
                        value={maxHour}
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
                        onChange={handleExtraHourCharge}
                        value={extraHourCharge}
                        required
                      />
                      <label htmlFor="">Extra Hour Charge*</label>
                    </div>

                    <hr className="text-white" />
                    <center>
                      <h6 className="text-white">Ride Hours</h6>
                    </center>
                    <div className="rideHours" id="rideHours">
                      {rideHours.map((hour) => (
                        <div
                          key={hour.id}
                          id={`rideDate${hour.id}`}
                          className="ride_date"
                        >
                          <hr className="text-white" />
                          <div className="col-12">
                            <input
                              className="form-control startTime"
                              onChange={(e) => {
                                handleHourInputChange(hour.id, e);
                              }}
                              onBlur={(e) =>{
                                checkStartEndTime("start", e.target);
                                getHours(hour.id);
                              }}
                              type="datetime-local"
                              name="startTime"
                              id={`startTime${hour.id}`}
                              value={hour.startTime}
                              required
                            />
                            <label htmlFor={`startTime${hour.id}`}>Start</label>
                            <span
                              className="text-danger float-end"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                removeNewHour(hour.id);
                              }}
                            >
                              Remove
                            </span>
                          </div>
                          <div className="col-12">
                            <input
                              className="form-control endTime"
                              onChange={(e) => {
                                handleHourInputChange(hour.id, e);
                              }}
                              onBlur={(e) => {
                                checkStartEndTime("end", e.target);
                                getHours(hour.id);
                              }}
                              type="datetime-local"
                              name="endTime"
                              id={`endTime${hour.id}`}
                              value={hour.endTime}
                              required
                            />
                            <label htmlFor={`endTime${hour.id}`}>End</label>
                          </div>
                          <div className="col-12">
                            <input
                              className="form-control hours"
                              type="text"
                              name="hours"
                              id={`hours${hour.id}`}
                              value={hour.hours}
                              readOnly
                            />
                            <label htmlFor={`hours${hour.id}`}>Hours</label>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-1">
                      <span
                        className="text-white"
                        style={{ cursor: "pointer" }}
                        id="addHour"
                        onClick={addNewHour}
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
                          onBlur={handleStartKilometer_hr}
                          onChange={(e) => {
                            setStartKM(e.target.value);
                          }}
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
                          value={endKM}
                          onChange={(e) => {
                            setEndKM(e.target.value);
                          }}
                          onBlur={handleEndKilometer_hr}
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
                          value={startTime}
                          onChange={(e) => {
                            setStartTime(e.target.value);
                          }}
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
                        id="hr_endDate"
                        onBlur={handleTripEndDateChange_hr}
                        onChange={(e)=>setTripEndDate(e.target.value)}
                        value={tripEndDate}
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
                        value={tripDays}
                        onChange={(e) => {
                          setTripDays(e.target.value);
                        }}
                        onBlur={calcTotalHourExpense}
                      />
                      <label htmlFor="">Trip Days</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control"
                        type="number"
                        name="kilometer"
                        value={totalKiloMeter}
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
                        value={permit}
                        onChange={(e) => {
                          setPermit(e.target.value);
                        }}
                        onBlur={calcTotalHourExpense}
                      />
                      <label htmlFor="">Permit</label>
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control toll"
                        type="number"
                        name="toll[]"
                        placeholder="Toll"
                        value={toll}
                        onChange={(e) => {
                          setToll(e.target.value);
                        }}
                        onBlur={calcTotalHourExpense}
                      />
                      <label htmlFor="">Toll</label>
                    </div>
                    {/* <div className="add_toll" id="hr_addAnotherToll"></div>
                              <div className="mt-1">
                                <span className="text-white" style={{cursor: "pointer"}} id="hr_addExpense" onclick="hr_addNewToll()"><i className="fa fa-plus"></i> Toll</span>
                              </div> */}
                    <div className="col-12">
                      <input
                        className="form-control parking"
                        type="number"
                        name="parking[]"
                        placeholder="Parking"
                        value={parking}
                        onChange={(e) => {
                          setParking(e.target.value);
                        }}
                        onBlur={calcTotalHourExpense}
                      />
                      <label htmlFor="">Parking</label>
                    </div>
                    {/* <div className="add_parking" id="hr_addAnotherParking"></div>
                              <div className="mt-1">
                                <span className="text-white" style={{cursor: "pointer"}} id="hr_addExpense" onclick="hr_addNewParking()"><i className="fa fa-plus"></i> Parking</span>
                              </div> */}
                    <div className="col-12">
                      <input
                        className="form-control entrance"
                        type="number"
                        name="entrance[]"
                        placeholder="Entrance"
                        value={entrance}
                        onChange={(e) => {
                          setEntrance(e.target.value);
                        }}
                        onBlur={calcTotalHourExpense}
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
                        className="form-control guide_fee"
                        type="number"
                        name="guide_fee[]"
                        placeholder="Guide Fee"
                        value={guideFee}
                        onChange={(e) => {
                          setGuideFee(e.target.value);
                        }}
                        onBlur={calcTotalHourExpense}
                      />
                      <label htmlFor="">Guide Fee</label>
                    </div>
                    {/* <div className="add_guide_fee" id="hr_addAnotherGuideFee"></div>
                              <div className="mt-1">
                                <span className="text-white" style={{cursor: "pointer"}} id="hr_addExpense" onclick="hr_addNewGuideFee()"><i className="fa fa-plus"></i> Guide Fee</span>
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
                        className="form-control other_charge"
                        type="number"
                        name="other_charge_amount[]"
                        placeholder="Other charge amount."
                        value={otherChargeAmount}
                        onChange={(e) => {
                          setOtherChargeAmount(e.target.value);
                        }}
                        onBlur={calcTotalHourExpense}
                      />
                      <label htmlFor="">Other Charge</label>
                    </div>
                    {/* <div className="add_other_charge" id="hr_addAnotherOtherCharge"></div>
                              <div className="mt-1">
                                <span className="text-white" style={{cursor: "pointer"}} id="hr_addExpense" onclick="hr_addNewOtherCharge()"><i className="fa fa-plus"></i> Other Charge</span>
                              </div> */}

                    <hr className="text-white" />
                    <div className="col-12">
                      <input
                        type="hidden"
                        id="hr_tripCharge"
                        name="trip_charge"
                        value={tripCharge}
                      />
                      <input
                        type="hidden"
                        id="hr_tripFixedCharge"
                        name="trip_fixed_charge"
                        value={tripFixedCharge}
                      />
                      <input
                        type="hidden"
                        id="hr_tripExtraCharge"
                        name="trip_extra_charge"
                        value={tripExtraCharge}
                      />
                      <input
                        className="form-control"
                        type="number"
                        id="hr_totalTripExpense"
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
                        id="hr_advanceAmount"
                        placeholder="Advance"
                        value={advance}
                        onChange={(e) => {
                          setAdvance(e.target.value);
                        }}
                        onBlur={() => {
                          rewriteBalance(totalCharge, advance);
                        }}
                      />
                      <label htmlFor="">Advance</label>
                    </div>

                    <div className="col-12">
                      <input
                        className="form-control"
                        type="number"
                        name="balance"
                        value={balance}
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

export default TripSheet;
