import React, { useEffect } from "react";
import Header from "./Header";
import { useState } from "react";
import axios from "axios";
import config from "../functions/config";

function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  //   const user_id = Cookies.get("ID");
  const fetchFeedbacks = () => {
    axios
      .get(`${config.base_url}/feedbacks/`)
      .then((res) => {
        console.log(res.data);
        const fb = res.data.map((ele) => ({
          id: ele.id,
          name: ele.full_name,
          feedback: ele.feedback,
        }));

        setFeedbacks(fb);
      })
      .catch((err) => [console.log(err)]);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);
  return (
    <>
      <Header />
      <section className="vh-100 gradient-custom">
        <div className="container-fluid py-5">
          <div className="row">
            <div className="col-12 table-responsive">
              <table className="table table-secondary table-hover feedback-table">
                <thead>
                  <tr>
                    <th
                      className="fw-bold text-uppercase text-center col-1"
                      scope="col"
                    >
                      #
                    </th>
                    <th
                      className="fw-bold text-uppercase text-center col-3"
                      scope="col"
                    >
                      Guest
                    </th>
                    <th
                      className="fw-bold text-uppercase text-center col-8"
                      scope="col"
                    >
                      Comments
                    </th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {feedbacks && feedbacks.length > 0 ? (
                    feedbacks.map((f, index) => (
                      <tr key={f.id}>
                        <th className="text-center" scope="row">{index + 1}</th>
                        <td className="text-center">{f.name}</td>
                        <td className="text-center comments">{f.feedback}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No Feedbacks available.!
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

export default Feedbacks;
