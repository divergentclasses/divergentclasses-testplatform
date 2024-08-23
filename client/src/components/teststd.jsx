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
import SpinnerLoader from "./spinnerloader";

const Profile = ({ userdata }) => {
  const { logout } = useAuth();
  const [openprodet, setprodet] = useState(false);

  let menuRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setprodet(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  function showConfirmation() {
    const userConfirmed = confirm("Are you wants to logout");
    if (userConfirmed) {
      logout();
    }
  }

  return (
    <>
      <div className="flex items-center">
        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              setprodet(!openprodet);
            }}
            className="profile">
            {userdata?.image ? (
              <img src={userdata?.image} alt="img"></img>
            ) : (
              <i className="fa-solid fa-user-tie"></i>
            )}
          </button>
          <div
            ref={menuRef}
            className={openprodet ? "pro-det active" : "pro-det inactive"}>
            <div
              style={{
                backgroundColor: "#f0bd0e",
                padding: "2px 5px",
                borderRadius: "6px",
                color: "white",
                boxShadow:
                  "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px"
              }}
              className="text-xs my-1">
              {userdata?.email}
            </div>
            <div className="flex items-center tt1">
              <i className="fa-solid fa-user mr-3"></i>
              <Link to="/profile">My Profile</Link>
            </div>
            <div className="flex items-center my-4 tt1">
              <i className="fa-solid fa-bag-shopping mr-3"></i>
              <Link>My Purchase</Link>
            </div>
            <div className="flex items-center tt1">
              <i className="fa-solid fa-right-from-bracket mr-3"></i>
              <button
                onClick={() => {
                  showConfirmation();
                }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

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
  const { tests, userdata, userlogin, setTestID, PostResult, btnStatus } =
    useAuth();

  const studentID = localStorage.getItem("studentID");

  return (
    <>
      <div className="hgts">
        <div className="flex justify-between">
          <div className="font-bold">{val.paper_name}</div>
          <Link
            style={{
              backgroundColor:
                btnStatus?.find((k) => k.PaperID === val._id)?.PaperID ===
                  val._id &&
                btnStatus?.find((k) => k.PaperID === val._id)?.Participants
                  .Students[0].SubmitPaper
                  ? "#FFC107"
                  : btnStatus?.find((k) => k.PaperID === val._id)?.PaperID ===
                      val._id &&
                    !btnStatus?.find((k) => k.PaperID === val._id)?.Participants
                      .Students[0].SubmitPaper
                  ? "#4BB543"
                  : "#209bd1"
            }}
            onClick={() => {
              setTestID(val._id);
            }}
            to={
              userlogin
                ? btnStatus?.find((k) => k.PaperID === val._id)?.PaperID ===
                    val._id &&
                  btnStatus?.find((k) => k.PaperID === val._id)?.Participants
                    .Students[0].SubmitPaper
                  ? `/result/${val._id}`
                  : `/instructions/${val._id}`
                : "/login"
            }
            className="srt-ts">
            <i className="fa-solid mr-1"></i>
            {btnStatus?.find((k) => k.PaperID === val._id)?.PaperID ===
              val._id &&
            btnStatus?.find((k) => k.PaperID === val._id)?.Participants
              .Students[0].SubmitPaper ? (
              <>
                <i className="fa-solid fa-square-poll-vertical mr-1"></i>View
                Result
              </>
            ) : btnStatus?.find((k) => k.PaperID === val._id)?.PaperID ===
                val._id &&
              !btnStatus?.find((k) => k.PaperID === val._id)?.Participants
                .Students[0].SubmitPaper ? (
              <>
                <i className="fa-solid fa-play mr-1"></i>Resume
              </>
            ) : (
              <>
                <i className="fa-solid fa-arrow-right mr-1"></i>Start
              </>
            )}
          </Link>
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
        {/* <div className="flex items-center mt-2 tsrf text-sm">
          <i className="fa-solid fa-book-open mr-2"></i> View Syllabus
        </div> */}
      </div>
    </>
  );
};

export default function TestStd() {
  const { tests, userdata, userlogin, setTestID, submitStatus, btnStatus } =
    useAuth();

  useEffect(() => {
    localStorage.setItem("studentID", userdata._id);
  }, [userlogin]);
  return (
    <>
      {tests && userdata  ? (
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
              <h2 className="p-3 text-2xl font-semibold"> Tests</h2>
              {userlogin ? (
                <Profile userdata={userdata} />
              ) : (
                <Link className="ls-btn" to="/login">
                  Login/Signup
                </Link>
              )}
            </div>
            {/* <div className="tstcd">
              <div className="uft flex justify-between items-center">
                <div className="uplq text-xl ml-1 font-bold">hello</div>
              </div>
            </div> */}
            <div style={{ maxHeight: "70vh", overflow: "auto" }}>
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
      ) : (
        <SpinnerLoader />
      )}
    </>
  );
}
