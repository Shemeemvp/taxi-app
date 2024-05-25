import React, { useEffect, useState } from "react";
import Header from "./Header";
import "../components/TripSheet.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../functions/config";

function AllTrips() {
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
                        >{trip.driver_name}</td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >{trip.guest}</td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >{trip.kilometers}</td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >{trip.total_trip_expense}</td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          <Link to="/view_tsc_data" className="btn btn-secondary btn-sm w-100">VIEW</Link>
                          <br />
                          <a
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