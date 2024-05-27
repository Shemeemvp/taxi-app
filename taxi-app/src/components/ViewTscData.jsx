import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Link, useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import "./ViewTscData.css";
import axios from "axios";
import config from "../functions/config";

function ViewTscData() {
  const { id } = useParams();
  const [tripData, setTripData] = useState({});
  const [extraKilometer, setExtraKilometer] = useState("");

  var extraHr = null;

  const formatFloat = (num) => (num || 0).toFixed(2);

  const fetchTripData = () => {
    axios
      .get(`${config.base_url}/view_trip/${id}/`)
      .then((res) => {
        const trpData = res.data;
        console.log(trpData);
        const relativeMediaPath = trpData.bill_qr.split("media\\")[1];
        const qrUrl = `${config.base_url}/media/${relativeMediaPath.replace(
          /\\/g,
          "/"
        )}`;
        const trip = {
          tripNo: trpData.trip_no,
          qr: qrUrl,
          tripDate: trpData.trip_date,
          vehicleNo: trpData.vehicle_no,
          driverName: trpData.driver_name,
          guestName: trpData.guest,
          advance: trpData.advance,
          startingPlace: trpData.starting_place,
          startingTime: convertToAM_PM(trpData.starting_time),
          destination: trpData.destination,
          timeOfArrival: convertToAM_PM(trpData.time_of_arrival),
          kilometers: trpData.kilometers,
          startKilometer: trpData.starting_km,
          endKilometer: trpData.ending_km,
          tripEndDate: trpData.trip_end_date,
          totalDays: trpData.trip_days,
          tripCharge: trpData.trip_charge,
          maxKilometer: trpData.max_kilometer,
          maxHour: trpData.max_hour,
          tripChargeType: trpData.trip_charge_type,
          fixedCharge: trpData.fixed_charge,
          fixedHourCharge: trpData.fixed_hour_charge,
          tripFixedCharge: trpData.trip_fixed_charge,
          extraCharge: trpData.extra_charge,
          extraHourCharge: trpData.extra_hour_charge,
          tripExtraCharge: trpData.trip_extra_charge,
          permit: trpData.permit,
          toll: trpData.toll,
          parking: trpData.parking,
          entrance: trpData.entrance,
          guideFee: trpData.guide_fee,
          guideFeePlace: trpData.guide_fee_place,
          otherChargeDescription: trpData.other_charge_description,
          otherCharge: trpData.other_charges,
          totalTripCharge: trpData.total_trip_expense,
          balance: trpData.balance,
        };
        setTripData(trip);
        getExtraKilometers(
          trpData.kilometers,
          trpData.trip_days,
          trpData.max_kilometer
        );
      })
      .catch((err) => {});
  };

  useEffect(() => {
    fetchTripData();
  }, [id]);

  function getExtraKilometers(totKM, tripDays, mxKM) {
    var totKM = parseFloat(totKM) || 0;
    var tripDays = parseInt(tripDays) || 0;
    var mxKM = parseFloat(mxKM) || 0;

    var extKM = totKM - tripDays * mxKM;
    if (extKM > 0) {
      setExtraKilometer(extKM.toFixed(2));
    }
  }

  function convertToAM_PM(timeString) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    const period = hours >= 12 ? "PM" : "AM";

    const hours12 = hours % 12 || 12;

    const formattedTime = `${hours12.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;

    return formattedTime;
  }

  function printSheet() {
    document.getElementById("printTripSheet").style.display = "block";
    var divToPrint = document.getElementById("printTripSheet");
    var printWindow = window.open("", "", "height=700,width=1000");
    var styles = `
        .address{
            display: flex;
            flex-direction: column;
        }
        .address p,.footer p{
            font-size: 1rem;
            margin: 0;
        }
        .slip-container{
            width: 210mm;
            margin: 2rem auto;
            padding: 2rem;
        }
        .divider{
            margin: 1rem 0;
            border-bottom: 3px dotted black;
        }
        .trns-id p,.datetime p{
            font-size: 0.85rem;
            margin: 0;
        }
        .table-responsive {
            max-height:100vh;
        }
        .table-responsive::-webkit-scrollbar {
            display: none;
        }
  
        .equal-length-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
  
        .equal-length-item {
            flex: 1;
            text-align: center;
        }
        .equal-length-item hr{
          width: 60%;
          border-bottom: 1px solid black;
          position: relative;
          left: 20%;
        }
  
        .guide_places, .other_charges, .trip_split{
          font-size: 0.8rem;
        }
  
        .brand{
          font-family: "Agbalumo", system-ui;
        }
  
        `;
    printWindow.document.write("<html><head><title></title>");
    printWindow.document.write(`
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Agbalumo&family=Black+Ops+One&family=Gluten:wght@100..900&family=Playball&display=swap" rel="stylesheet">
    `);
    printWindow.document.write("</head>");
    printWindow.document.write("<body>");
    printWindow.document.write("<style>");
    printWindow.document.write(styles);
    printWindow.document.write("</style>");

    printWindow.document.write(divToPrint.outerHTML);
    printWindow.document.write("</body>");
    printWindow.document.write("</html>");
    printWindow.document.close();
    printWindow.print();
    // printWindow.addEventListener('afterprint', function() {
    //   printWindow.close();
    // });
    document.getElementById("printTripSheet").style.display = "none";
  }

  function downloadPdf() {
    document.getElementById("printTripSheet").style.display = "block";
    var tripNo = tripData.tripNo;
    var element = document.getElementById("printTripSheet");
    var opt = {
      margin: 0,
      filename: "TripSheet_" + tripNo + ".pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(function () {
        document.getElementById("printTripSheet").style.display = "none";
      });
  }
  return (
    <>
      <Header />
      <section className="vh-100 gradient-custom">
        <div className="container-fluid py-5">
          <div className="btns d-flex justify-content-end">
            <button
              className="btn btn-sm btn-secondary print"
              onClick={printSheet}
              id="templatePrintButton"
            >
              <i className="fas fa-print me-1"></i> PRINT
            </button>
            <button
              className="btn btn-sm btn-secondary ms-1"
              onClick={downloadPdf}
              id="pdfButton"
            >
              <i className="fas fa-file me-1"></i> PDF
            </button>
            <Link className="btn btn-sm btn-secondary ms-1" to="/all_trips">
              Close
            </Link>
          </div>
          <div className="row">
            <div
              className="trip_sheet"
              id="printTripSheet"
              style={{ overflowX: "auto", display: "none" }}
            >
              <div className="slip-container bg-white" id="slip_container">
                <div className="slip">
                  <div className="row sheet_header">
                    <div className="logo col-2 d-flex align-items-center">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/logo_3.png`}
                        style={{ width: "100%" }}
                        alt="Milayna CAB"
                      />
                    </div>
                    <div className="company_head col-8">
                      <h5 className=" text-center brand">MILAYNA CAB</h5>
                      <div className="address text-center">
                        <p>Nechoor</p>
                        <p>Ernakulam - 686664</p>
                        <p>milaynacab@gmail.com</p>
                        <p>+91 80861 47845, +91 9400056444</p>
                      </div>
                    </div>
                    <div className="col-2 d-flex justify-content-center align-items-center">
                      <div className="qr">
                        <img
                          src={tripData.qr}
                          style={{ width: "100px", maxWidth: "100%" }}
                          alt="code"
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  {/* <div className="divider w-50"></div> */}
                  <h4 className="text-center">
                    Trip Sheet for Contract Carriages
                  </h4>
                  <hr
                    style={{ width: "50%", position: "relative", left: "25%" }}
                  />
                  <div className="trip_details">
                    <div className="row">
                      <div className="col-3">
                        <h5>Trip No.</h5>
                      </div>
                      <div className="col-3">{tripData.tripNo}</div>

                      <div className="col-3">
                        <h5>Date</h5>
                      </div>
                      <div className="col-3">{tripData.tripDate}</div>
                    </div>

                    <div className="row">
                      <div className="col-3">
                        <p>Vehicle No.</p>
                      </div>
                      <div className="col-3">{tripData.vehicleNo}</div>

                      <div className="col-3">
                        <p>Driver Name</p>
                      </div>
                      <div className="col-3">{tripData.driverName}</div>
                    </div>

                    <div className="row">
                      <div className="col-3">
                        <p>Guest Name</p>
                      </div>
                      <div className="col-3">{tripData.guest}</div>

                      <div className="col-3">
                        <p>Advance</p>
                      </div>
                      <div className="col-3">
                        <span>&#8377; </span>
                        {tripData.advance}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div
                    className="equal-length-container"
                    style={{ color: "black", fontWeight: "bold" }}
                  >
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      Starting Place
                      <hr />
                    </div>
                    <div
                      className="equal-length-item ml-2"
                      style={{ textAlign: "center" }}
                    >
                      Time
                      <hr />
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      Destination
                      <hr />
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      Time of Arrival
                      <hr />
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      Kilometers
                      <hr />
                    </div>
                  </div>
                  <div
                    className="equal-length-container"
                    style={{
                      color: "black",
                      fontSize: "small",
                      wordWrap: "break-word",
                      marginBottom: "1vh",
                    }}
                  >
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      {tripData.startingPlace}
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      {tripData.startingTime}
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      {tripData.destination}
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      {tripData.timeOfArrival}
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      {tripData.kilometers}
                    </div>
                  </div>

                  <div className="px-4 subtot mt-5">
                    <div className="totDays mt-2">
                      <p className="mb-0">
                        Starting KM: <span>{tripData.startKilometer}</span>
                      </p>
                      <p className="mb-0">
                        Ending KM: <span>{tripData.endKilometer}</span>
                      </p>
                    </div>
                    <div className="totDays mt-1">
                      <p className="mb-0">
                        Trip End date: <span>{tripData.tripEndDate}</span>
                      </p>
                      <p className="fw-bold">
                        Total Days: <span>{tripData.totalDays}</span>
                      </p>
                    </div>
                    <div className="subtot-item d-flex justify-content-between">
                      <div>
                        <span>Total Trip Charge</span>
                      </div>
                      <span>
                        <span>&#8377; </span>
                        {tripData.tripCharge}
                      </span>
                    </div>
                    {tripData.tripChargeType !== "Hour" &&
                      tripData.tripCharge !== 0 && (
                        <div className="trip_split w-100 mb-2">
                          <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                            <span>
                              Fixed Charge(&#8377;{" "}
                              {formatFloat(tripData.fixedCharge)} per day upto{" "}
                              {tripData.maxKilometer} KM)
                            </span>
                            <span>
                              &#8377; {formatFloat(tripData.tripFixedCharge)}
                            </span>
                          </span>
                          <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                            <span>
                              Extra Running Charge(&#8377;{" "}
                              {formatFloat(tripData.extraCharge)} extra charge
                              per KM for{" "}
                              <span className="extraKM">{extraKilometer}</span>{" "}
                              KMs)
                            </span>
                            <span>
                              &#8377; {formatFloat(tripData.tripExtraCharge)}
                            </span>
                          </span>
                        </div>
                      )}

                    {tripData.tripChargeType !== "kilometer" &&
                      tripData.tripCharge !== 0 && (
                        <div className="trip_split w-100 mb-2">
                          <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                            <span>
                              Fixed Charge(&#8377;{" "}
                              {formatFloat(tripData.fixedHourCharge)} per day
                              upto {tripData.maxHour} Hours)
                            </span>
                            <span>
                              &#8377; {formatFloat(tripData.tripFixedCharge)}
                            </span>
                          </span>
                          <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                            <span>
                              Extra Hour Charge(&#8377; {} extra charge per Hour
                              for <span className="extraHR">{extraHr}</span> Hrs
                              )
                            </span>
                            <span>
                              &#8377; {formatFloat(tripData.tripExtraCharge)}
                            </span>
                          </span>
                        </div>
                      )}

                    <div className="subtot-item d-flex justify-content-between">
                      <span>Permit</span>
                      <span>
                        <span>&#8377; </span>
                        {tripData.permit}
                      </span>
                    </div>
                    <div className="subtot-item d-flex justify-content-between">
                      <span>Entrance Fees</span>
                      <span>
                        <span>&#8377; </span>
                        {tripData.entrance}
                      </span>
                    </div>
                    <div className="subtot-item d-flex justify-content-between">
                      <span>Parking</span>
                      <span>
                        <span>&#8377; </span>
                        {tripData.parking}
                      </span>
                    </div>
                    <div className="subtot-item d-flex justify-content-between">
                      <span>TOLL</span>
                      <span>
                        <span>&#8377; </span>
                        {tripData.toll}
                      </span>
                    </div>
                    <div className="subtot-item d-flex justify-content-between">
                      <span>Guide Fees</span>
                      <span>
                        <span>&#8377; </span>
                        {tripData.guideFee}
                      </span>
                    </div>
                    {tripData.guideFee !== 0 && (
                      <div className="guide_places w-100">
                        {/* {% for i in guide_exp %} */}
                        <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                          <span>{tripData.guideFeePlace}</span>
                          <span>&#8377; {tripData.guideFee}</span>
                        </span>
                        {/* {% endfor %} */}
                      </div>
                    )}
                    <div className="subtot-item d-flex justify-content-between">
                      <span>Other Charges</span>
                      <span>
                        <span>&#8377; </span>
                        {tripData.otherCharge}
                      </span>
                    </div>
                    {tripData.otherCharge !== 0 && (
                      <div className="other_charges w-100">
                        {/* {% for i in other_charges %} */}
                        <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                          <span>{tripData.otherChargeDescription}</span>
                          <span>&#8377; {tripData.otherCharge}</span>
                        </span>
                        {/* {% endfor %} */}
                      </div>
                    )}
                  </div>
                  <hr />
                  <div className="px-4">
                    <div className="debit fw-bold d-flex justify-content-between">
                      <span>
                        <strong>TOTAL</strong>
                      </span>
                      <span>
                        <strong>
                          <span>&#8377; </span>
                          {formatFloat(tripData.totalTripCharge)}
                        </strong>
                      </span>
                    </div>
                    <div className="balance fw-bold d-flex justify-content-between">
                      <span>
                        <strong>BALANCE</strong>
                      </span>
                      <span>
                        <strong>
                          <span>&#8377; </span>
                          {formatFloat(tripData.balance)}
                        </strong>
                      </span>
                    </div>
                  </div>
                  <div className="divider"></div>
                  <div className="row mt-4 mb-5">
                    <div className="col-9">
                      <p>Remarks:</p>
                    </div>
                    <div className="col-3 d-flex justify-content-center">
                      <p>Signature</p>
                    </div>
                  </div>
                  <div className="footer mt-4 text-center">
                    <p>Thank you for choosing us.!</p>
                  </div>
                </div>
              </div>
            </div>

            {/*  Bill Responsive -- w/o scroll for mobile view */}

            <div className="trip_sheet2" id="printTripSheetNoScroll">
              <div className="slip-container bg-white" id="slip_container">
                <div className="slip">
                  <div className="row sheet_header">
                    <div className="logo col-2 d-flex align-items-center">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/logo_3.png`}
                        style={{ width: "100%" }}
                        alt="Milayna CAB"
                      />
                    </div>
                    <div className="company_head col-8">
                      <h5 className=" text-center brand">MILAYNA CAB</h5>
                      <div className="address text-center">
                        <p>Nechoor</p>
                        <p>Ernakulam - 686664</p>
                        <p>milaynacab@gmail.com</p>
                        <p>+91 80861 47845, +91 9400056444</p>
                      </div>
                    </div>
                    <div className="col-2 d-flex justify-content-center align-items-center">
                      <div className="qr">
                        <img
                          src={tripData.qr}
                          style={{ width: "100px", maxWidth: "100%" }}
                          alt="code"
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  {/* <div className="divider w-50"></div> */}
                  <h4 className="text-center head2">
                    Trip Sheet for Contract Carriages
                  </h4>
                  <hr
                    style={{ width: "50%", position: "relative", left: "25%" }}
                  />
                  <div className="trip_details">
                    <div className="row">
                      <div className="col-3">
                        <h5>Trip No.</h5>
                      </div>
                      <div className="col-3">{tripData.tripNo}</div>

                      <div className="col-3">
                        <h5>Date</h5>
                      </div>
                      <div className="col-3">{tripData.tripDate}</div>
                    </div>

                    <div className="row">
                      <div className="col-3">
                        <p>Vehicle No.</p>
                      </div>
                      <div className="col-3">{tripData.vehicleNo}</div>

                      <div className="col-3">
                        <p>Driver Name</p>
                      </div>
                      <div className="col-3">{tripData.driverName}</div>
                    </div>

                    <div className="row">
                      <div className="col-3">
                        <p>Guest Name</p>
                      </div>
                      <div className="col-3">{tripData.guestName}</div>

                      <div className="col-3">
                        <p>Advance</p>
                      </div>
                      <div className="col-3">
                        <span>&#8377; </span>
                        {formatFloat(tripData.advance)}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div
                    className="equal-length-container"
                    style={{ color: "black", fontWeight: "bold" }}
                  >
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      Starting Place
                      <hr />
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      Time
                      <hr />
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      Destination
                      <hr />
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      Time of Arrival
                      <hr />
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      Kilometers
                      <hr />
                    </div>
                  </div>
                  <div
                    className="equal-length-container"
                    style={{
                      color: "black",
                      fontSize: "small",
                      wordWrap: "break-word",
                      marginBottom: "1vh",
                    }}
                  >
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      {tripData.startingPlace}
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      {tripData.startingTime}
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      {tripData.destination}
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      {tripData.timeOfArrival}
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      {tripData.kilometers}
                    </div>
                  </div>

                  <div className="px-4 subtot mt-5">
                    <div className="totDays mt-2">
                      <p className="mb-0">
                        Starting KM: <span>{tripData.startKilometer}</span>
                      </p>
                      <p className="mb-0">
                        Ending KM: <span>{tripData.endKilometer}</span>
                      </p>
                    </div>
                    <div className="totDays mt-1">
                      <p className="mb-0">
                        Trip End date: <span>{tripData.tripEndDate}</span>
                      </p>
                      <p className="fw-bold">
                        Total Days: <span>{tripData.totalDays}</span>
                      </p>
                    </div>
                    <div className="subtot-item d-flex justify-content-between">
                      <div>
                        <span>Total Trip Charge</span>
                        <br />
                      </div>
                      <span className="d-flex">
                        <span>&#8377; </span>
                        {tripData.tripCharge}
                      </span>
                    </div>
                    {tripData.tripChargeType !== "Hour" &&
                      tripData.tripCharge !== 0 && (
                        <div className="trip_split w-100 mb-2">
                          <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                            <span>
                              Fixed Charge(&#8377;{" "}
                              {formatFloat(tripData.fixedCharge)} per day upto{" "}
                              {tripData.maxKilometer} KM)
                            </span>
                            <span>
                              &#8377; {formatFloat(tripData.tripFixedCharge)}
                            </span>
                          </span>
                          <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                            <span>
                              Extra Running Charge(&#8377;{" "}
                              {formatFloat(tripData.extraCharge)} extra charge
                              per KM for{" "}
                              <span className="extraKM">{extraKilometer}</span>{" "}
                              KMs)
                            </span>
                            <span>
                              &#8377; {formatFloat(tripData.tripExtraCharge)}
                            </span>
                          </span>
                        </div>
                      )}

                    {tripData.tripChargeType !== "kilometer" &&
                      tripData.tripCharge !== 0 && (
                        <div className="trip_split w-100 mb-2">
                          <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                            <span>
                              Fixed Charge(&#8377;{" "}
                              {formatFloat(tripData.fixedHourCharge)} per day
                              upto {tripData.maxHour} Hours)
                            </span>
                            <span>
                              &#8377; {formatFloat(tripData.tripFixedCharge)}
                            </span>
                          </span>
                          <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                            <span>
                              Extra Hour Charge(&#8377; {} extra charge per Hour
                              for <span className="extraHR">{extraHr}</span> Hrs
                              )
                            </span>
                            <span>
                              &#8377; {formatFloat(tripData.tripExtraCharge)}
                            </span>
                          </span>
                        </div>
                      )}

                    <div className="subtot-item d-flex justify-content-between">
                      <span>Permit</span>
                      <span>
                        <span>&#8377; </span>
                        {tripData.permit}
                      </span>
                    </div>
                    <div className="subtot-item d-flex justify-content-between">
                      <span>Entrance Fees</span>
                      <span>
                        <span>&#8377; </span>
                        {tripData.entrance}
                      </span>
                    </div>
                    <div className="subtot-item d-flex justify-content-between">
                      <span>Parking</span>
                      <span>
                        <span>&#8377; </span>
                        {tripData.parking}
                      </span>
                    </div>
                    <div className="subtot-item d-flex justify-content-between">
                      <span>TOLL</span>
                      <span>
                        <span>&#8377; </span>
                        {tripData.toll}
                      </span>
                    </div>
                    <div className="subtot-item d-flex justify-content-between">
                      <div>
                        <span>Guide Fees</span>
                      </div>
                      <span>
                        <span>&#8377; </span>
                        {tripData.guideFee}
                      </span>
                    </div>
                    {tripData.guideFee !== 0 && (
                      <div className="guide_places w-100">
                        {/* {% for i in guide_exp %} */}
                        <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                          <span>{tripData.guideFeePlace}</span>
                          <span>&#8377; {tripData.guideFee}</span>
                        </span>
                        {/* {% endfor %} */}
                      </div>
                    )}
                    <div className="subtot-item d-flex justify-content-between">
                      <div>
                        <span>Other Charges</span>
                      </div>
                      <span>
                        <span>&#8377; </span>
                        {tripData.otherCharge}
                      </span>
                    </div>
                    {tripData.otherCharge !== 0 && (
                      <div className="other_charges w-100">
                        {/* {% for i in other_charges %} */}
                        <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                          <span>{tripData.otherChargeDescription}</span>
                          <span>&#8377; {tripData.otherCharge}</span>
                        </span>
                        {/* {% endfor %} */}
                      </div>
                    )}
                  </div>
                  <hr />
                  <div className="px-4 grand_tot">
                    <div className="debit fw-bold d-flex justify-content-between">
                      <span>
                        <strong>TOTAL</strong>
                      </span>
                      <span>
                        <strong>
                          <span>&#8377; </span>
                          {formatFloat(tripData.totalTripCharge)}
                        </strong>
                      </span>
                    </div>
                    <div className="balance fw-bold d-flex justify-content-between">
                      <span>
                        <strong>BALANCE</strong>
                      </span>
                      <span>
                        <strong>
                          <span>&#8377; </span>
                          {formatFloat(tripData.balance)}
                        </strong>
                      </span>
                    </div>
                  </div>
                  <div className="divider"></div>

                  <div className="row mt-4 mb-5">
                    <div className="col-9">
                      <p>Remarks:</p>
                    </div>
                    <div className="col-3 d-flex justify-content-center">
                      <p>Signature</p>
                    </div>
                  </div>

                  <div className="footer my-4 text-center">
                    <p>Thank you for choosing us.!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ViewTscData;
