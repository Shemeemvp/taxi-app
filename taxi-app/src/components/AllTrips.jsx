import React, { useEffect, useState } from "react";
import Header from "./Header";
import "../components/TripSheet.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../functions/config";
import Swal from "sweetalert2";

function AllTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const fetchTrips = () => {
    let user_id = Cookies.get("ID");
    axios
      .get(`${config.base_url}/all_trips/${user_id}/`)
      .then((res) => {
        console.log(res.data);
        const tripData = res.data.map((element) => ({
          id: element.id,
          trip_no: element.trip_no,
          driver_name: element.driver_name,
          kilometers: element.kilometers,
          guest: element.guest,
          total_trip_expense: element.total_trip_expense,
        }));
        setTrips(tripData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchTrips();
  }, []);

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
  function handleDeleteTrip(id, number) {
    var tripID = id;
    var tripNo = number;

    Swal.fire({
      title: `Delete Trip - ${tripNo}?`,
      text: "You won't be able to revert this trip details.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${config.base_url}/delete_trip/${tripID}/`)
          .then((res) => {
            console.log(res);

            Toast.fire({
              icon: "success",
              title: "Trip Deleted successfully",
            });
            fetchTrips();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }
  return (
    <>
      <Header />
      <section className="vh-100 gradient-custom">
        <div className="container-fluid py-5">
          <div className="row">
            <div className="col-12 table-responsive">
              <table className="table table-secondary table-hover">
                <thead>
                  <tr>
                    <th
                      className="fw-bold text-uppercase text-center"
                      scope="col"
                    >
                      Trip#
                    </th>
                    <th
                      className="fw-bold text-uppercase text-center"
                      scope="col"
                    >
                      Driver
                    </th>
                    <th
                      className="fw-bold text-uppercase text-center"
                      scope="col"
                    >
                      Guest
                    </th>
                    <th
                      className="fw-bold text-uppercase text-center"
                      scope="col"
                    >
                      Kilometers
                    </th>
                    <th
                      className="fw-bold text-uppercase text-center"
                      scope="col"
                    >
                      Charge(Debit)
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {trips && trips.length > 0 ? (
                    trips.map((trip) => (
                      <tr key={trip.id}>
                        <th
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                          scope="row"
                        >
                          {trip.trip_no}
                        </th>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {trip.driver_name}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {trip.guest}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {trip.kilometers}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {trip.total_trip_expense}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          <a
                            onClick={() => {
                              navigate(`/view_tsc_data/${trip.id}`);
                            }}
                            className="btn btn-secondary btn-sm w-100"
                          >
                            VIEW
                          </a>
                          <br />
                          <a
                            onClick={() => {
                              handleDeleteTrip(trip.id, trip.trip_no);
                            }}
                            className="btn btn-secondary btn-sm w-100 mt-1"
                          >
                            DELETE
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No trips available.!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AllTrips;
