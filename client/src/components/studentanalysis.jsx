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
  const dateString = val?.conduct_time;

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

const TestStatus = ({ val }) => {
  const { DeclarePartBResult } = useAuth();

  const DeclarePartBresult = (PaperID) => {
    if (confirm("Are you sure? You want's to declare result of Part B.")) {
      DeclarePartBResult(PaperID);
    }
  };

  return (
    <>
      <div className="hgts">
        <div className="flex justify-between">
          <div className="font-bold">{val.paper_name}</div>
          <div className="flex items-center">
            <button
              onClick={() => {
                DeclarePartBresult(val._id);
              }}
              className="btndeclare mr-2">
              Declare Result Part B
            </button>
            <Link className="btnview" to={`/studentresult/${val._id}`}>
              View Results
            </Link>
          </div>
        </div>

        <div className="flex items-center mt-2 tsrf text-sm">
          <i className="fa-solid fa-circle-info mr-2"></i>
          {val.no_of_questions} Questions | {val?.totalmarks} Marks |{" "}
          {val.exam_duration} Hours
        </div>
        <div className="flex items-center mt-2 tsrf text-sm">
          <i className="fa-solid fa-calendar-days mr-2"></i> Started at{" "}
          <DateTime val={val} />
        </div>
        <div className="flex items-center mt-2 tsrf text-sm">
          <i className="fa-solid fa-book-open mr-2"></i> View Syllabus
        </div>
      </div>
    </>
  );
};

export default function StudentAnalysis() {
  const { tests } = useAuth();

  return (
    <>
      <div style={{ height: "100vh" }} className="flex">
        <div className="left">
          <Link to="/uploadtest">
            <div className="p-6 mid-txt text-xl gh">
              <i className="fa-solid fa-angle-left mr-1"></i>Back
            </div>
          </Link>
        </div>
        <div className="right-ts">
          <div className="flex justify-between items-center kh">
            <h2
              style={{ margin: "1.2px 0" }}
              className="p-3 text-2xl font-semibold">
              Conducted Papers
            </h2>
          </div>
          <div style={{ maxHeight: "88vh", overflow: "auto" }}>
            {tests ? (
              tests
                .filter((item) => item.status === "live")
                .map((val, index) => <TestStatus key={index} val={val} />)
            ) : (
              <SpinnerLoaderW />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
