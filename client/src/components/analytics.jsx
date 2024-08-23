import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import { useFormik, Field } from "formik";
import * as Yup from "yup";
Modal.setAppElement("#root");
import { useAuth } from "../contexts/AuthContext";
import Logo from "../images/DC Dot Logo PNG_edited.png";
import { format, parseISO } from "date-fns";
import analytics from "../images/analytics.png";
import rank from "../images/rank.png";
import { Line, Circle } from "rc-progress";
import SpinnerLoader from "./spinnerloader";

export default function Analytics() {
  const { tests, userdata, userlogin, scoreData } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <>
      {scoreData ? (
        <div style={{ height: "100vh" }} className="flex">
          <div className="left">
            <a href="https://www.divergentclasses.com/">
              <div className="p-6 ts-th text-xl flex">
                <img
                  style={{ height: "25px" }}
                  src={Logo}
                  alt="img"
                  className="mr-1"
                />
                Divergent classes
              </div>
            </a>
            <Link to="/test-series">
              <div className="p-6 mid-txt text-xl gh">
                <i className="fa-solid fa-file-arrow-up mr-2"></i> Tests
              </div>
            </Link>
          </div>
          <div className="right-ts">
            <div
              style={{ margin: "1.5px 0" }}
              className="flex justify-between items-center kh">
              <h2 className="p-3 text-2xl font-semibold">Analytics</h2>
            </div>
            <div style={{ overflowY: "auto", maxHeight: "88vh" }}>
              <div className="secpro">
                <div className="font-semibold">Leaderboard</div>
                <div className="p-3 mt-3 bg-white hjg">
                  <table>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Score</th>
                        <th>Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scoreData
                        ?.find((k) => k.PaperID === id)
                        .Students.map((val, index) => {
                          return (
                            <tr key={index}>
                              <td>{val.email}</td>
                              <td>{val.score}</td>
                              <td>{val.rank}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SpinnerLoader />
      )}
    </>
  );
}
