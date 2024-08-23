import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Modal from "react-modal";
import { useFormik, Field } from "formik";
import * as Yup from "yup";
Modal.setAppElement("#root");
import { useAuth } from "../contexts/AuthContext";
import Logo from "../images/DC Dot Logo PNG_edited.png";
import { format, parseISO } from "date-fns";
import SpinnerLoaderW from "./spinnerloaderW";

const DateTime = ({ val }) => {
  const dateString = val?.AttemptedOn;

  let formattedDate, day;
  try {
    const date = parseISO(dateString);
    formattedDate = format(date, "PPpp");
    day = format(date, "EEEE");
  } catch (error) {
    console.error("Invalid date format:", error);
    formattedDate = "Invalid date";
    day = "Unknown day";
  }
  return <div className="ml-1"> {formattedDate}</div>;
};

export default function StudentResults() {
  const { tests, StudentAns } = useAuth();
  const { id } = useParams();

  return (
    <>
      <div style={{ height: "100vh" }} className="flex">
        <div className="left">
          <div className="p-6 text-xl th text-black font-semibold">
            {tests?.find((k) => k._id === id).paper_name}
          </div>
          <Link to={`/analytics/${id}`}>
            <div className="p-6 mid-txt gh text-xl">
              <i className="fa-solid fa-chart-simple mr-1"></i>Analytics
            </div>
          </Link>
          <Link to="/studentanalysis">
            <div className="p-4 last-txt text-xl gh">
              <i className="fa-solid fa-angle-left mr-1"></i>Back
            </div>
          </Link>
        </div>
        <div className="right-ts">
          <div className="flex justify-between items-center kh">
            <h2
              style={{ margin: "1px 0" }}
              className="p-3 text-2xl font-semibold">
              Students Appeared
            </h2>
          </div>
          <div style={{ maxHeight: "88vh", overflow: "auto" }}>
            {StudentAns ? (
              StudentAns.find(
                (item) => item.PaperID === id
              ).Participants.Students.map((val, index) => {
                return (
                  <div key={index} className="hgts">
                    <div className="flex justify-between">
                      <div className="font-semibold">{val.email}</div>
                      <Link
                        className="btnview"
                        to={`/studentanswer/${val.studentID}/${id}`}>
                        View answer
                      </Link>
                    </div>

                    <div className="flex items-center mt-2 tsrf text-sm">
                      <i className="fa-solid fa-calendar-days mr-2"></i>{" "}
                      Attempted On <DateTime val={val} />
                    </div>
                  </div>
                );
              })
            ) : (
              <SpinnerLoaderW />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
