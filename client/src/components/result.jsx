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

const DateTime = ({ val }) => {
  const dateString = val?.AttemptedOn;

  let formattedDate, day;
  try {
    const date = parseISO(dateString);
    formattedDate = format(date, "PPpp");
    day = format(date, "EEEE");
  } catch (error) {
    formattedDate = "Invalid date";
    day = "Unknown day";
  }
  return <div className="ml-1"> {formattedDate}</div>;
};

export default function Result() {
  const {
    tests,
    userdata,
    userlogin,
    isLoggedIn,
    btnStatus,
    TimeTaken,
    Result,
    showResult,
    scoreData,
    ResultPartB,
    ResultpartBfun
  } = useAuth();
  const navigate = useNavigate();

  const { id } = useParams();
  const StudentID = localStorage.getItem("studentID");

  useEffect(() => {
    showResult(StudentID, id);
    ResultpartBfun(StudentID, id);
  }, []);

  return (
    <>
      {Result && scoreData ? (
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
            {scoreData
                ?.find((k) => k.PaperID === id)
                ?.Students.find((k) => k.studentID === StudentID) ?(
                  <Link to={`/analytics/${id}`}>
                    <div className="p-6 last-txt  gh text-xl">
                      <i className="fa-solid fa-chart-simple mr-1"></i>Analytics
                    </div>
                  </Link>
            ):null
            }
          </div>
          <div className="right-ts">
            <div className="flex justify-between items-center kh">
              <h2
                style={{ margin: "1px 0" }}
                className="p-3 text-2xl font-semibold">
                Result
              </h2>
            </div>
            <div style={{ overflowY: "auto", maxHeight: "88vh" }}>
              <div className="tstcd">
                <div className="uft flex justify-between items-center">
                  <div className="uplq text-xl ml-1 font-bold text-black">
                    {tests?.find((k) => k._id === id).paper_name}
                  </div>
                  {/* <div>
                  <select className="attp-slct">
                    <option>Attempt 1</option>
                    <option>Attempt 2</option>
                  </select>
                </div> */}
                </div>
                <div className="flex text-sm text-gray-600 mb-3">
                  <div className="flex items-center mr-2">
                    <i className="fa-solid fa-file-pen mr-1"></i>{" "}
                    {tests?.find((k) => k._id === id).no_of_questions} Questions
                  </div>
                  <div className="flex items-center mr-2">
                    <i className="fa-solid fa-circle-check mr-1"></i>{" "}
                    {tests?.find((k) => k._id === id)?.totalmarks} Marks
                  </div>
                  <div className="flex items-center">
                    <i className="fa-solid fa-clock mr-1"></i>{" "}
                    {tests?.find((k) => k._id === id).exam_duration} Hours
                  </div>
                </div>
                <div className="flex text-sm text-gray-600">
                  <div className="flex items-center mr-2">
                    <i className="fa-solid fa-calendar-days mr-1"></i> Attempted
                    On:{" "}
                    <DateTime
                      val={
                        btnStatus?.find((k) => k.PaperID === id)?.Participants
                          .Students[0]
                      }
                    />
                  </div>
                </div>
                <div className="flex text-sm text-gray-600 mt-4">
                  <div className="flex items-center mr-2">
                    {/* <button className="re-atmbtn mr-4">Reattempt</button> */}
                    <Link
                      className="vw-solbtn"
                      to={`/solutions/${StudentID}/${id}`}>
                      View Solutions
                    </Link>
                  </div>
                </div>
              </div>
              {scoreData?.find((k) => k.PaperID === id)?.DeclaredresultpartB &&
              scoreData
                ?.find((k) => k.PaperID === id)
                ?.Students.find((k) => k.studentID === StudentID) ? (
                <div className="p-3  mt-3 rhhn flex justify-between">
                  <div className="flex items-center">
                    <div
                      className="pr-5 mr-3"
                      style={{ borderRight: "1px solid #5ac9f9" }}>
                      <div className="text-xl font-semibold">RANK</div>
                      <div className="mt-14">
                        <span
                          style={{ color: "#5ac9f9" }}
                          className="text-7xl font-semibold">
                          {
                            scoreData
                              ?.find((k) => k.PaperID === id)
                              .Students.find((k) => k.studentID === StudentID)
                              ?.rank
                          }
                        </span>
                        <span className="text-xl font-bold">
                          /{" "}
                          {
                            scoreData?.find((k) => k.PaperID === id).Students
                              .length
                          }{" "}
                        </span>
                      </div>
                    </div>
                    <div className="pr-5">
                      <div className="text-xl font-semibold">TOTAL SCORE</div>
                      <div className="mt-14">
                        <span
                          style={{ color: "#5ac9f9" }}
                          className="text-7xl font-semibold">
                          {
                            scoreData
                              ?.find((k) => k.PaperID === id)
                              .Students.find((k) => k.studentID === StudentID)
                              ?.score
                          }
                        </span>
                        <span className="text-xl font-bold">
                          /{tests?.find((k) => k._id === id)?.totalmarks}{" "}
                        </span>
                      </div>
                    </div>
                  </div>
                  <img style={{ width: "15%" }} src={rank} alt="img" />
                </div>
              ) : null}

              <div className="text-2xl px-4 py-2 font-semibold">
                Result Summary Part A
              </div>

              <div className="rhhn flex justify-between">
                <div>
                  <h1 className="text-xl font-semibold">SCORE</h1>
                  <div
                    style={{ color: "#5ac9f9" }}
                    className="mt-10 text-7xl font-semibold">
                    {(
                      Number(
                        Result?.filter(
                          (question) => question.status === "correct"
                        ).reduce(
                          (sum, question) =>
                            sum + parseFloat(question.marks, 10),
                          0
                        )
                      ) +
                      Number(
                        Result?.filter(
                          (question) => question.status === "pcorrect"
                        ).reduce(
                          (sum, question) =>
                            sum + parseFloat(question.trueMatchCount, 10),
                          0
                        )
                      ) +
                      Number(
                        Result?.filter(
                          (question) => question.status === "incorrect"
                        ).reduce(
                          (sum, question) =>
                            sum + parseFloat(question.negativeMarks, 10),
                          0
                        )
                      )
                    ).toFixed(2)}
                    <span className="text-xl font-bold text-black">
                      /
                      {Result?.reduce((sum, question) => {
                        const marks = parseFloat(
                          question.marks?.trim() || "0",
                          10
                        );
                        return sum + (isNaN(marks) ? 0 : marks);
                      }, 0)}
                    </span>
                  </div>
                </div>
                <img style={{ width: "15%" }} src={analytics} alt="img" />
              </div>
              <div className="prognd">
                <div className="font-semibold">Your Progress</div>
                <div
                  style={{ width: "100%" }}
                  className="flex items-center justify-between">
                  <div className="blnpj">
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <i className="fa-solid fa-circle-check mr-1"></i>{" "}
                        Correct
                      </span>
                      {
                        Result?.filter(
                          (k) =>
                            k.status === "correct" || k.status === "pcorrect"
                        ).length
                      }
                      /{Result?.length}
                    </div>
                    <Line
                      className="my-2"
                      percent={
                        (Result?.filter(
                          (k) =>
                            k.status === "correct" || k.status === "pcorrect"
                        ).length *
                          100) /
                        Result?.length
                      }
                      strokeWidth={1}
                      strokeColor="#209bd1"
                    />
                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center ">Marks obtained</span>
                      <div className="text-green-600">
                        +
                        {Result?.filter(
                          (question) => question.status === "correct"
                        ).reduce(
                          (sum, question) =>
                            sum + parseFloat(question.marks, 10),
                          0
                        ) +
                          Result?.filter(
                            (question) => question.status === "pcorrect"
                          ).reduce(
                            (sum, question) =>
                              sum + parseFloat(question.trueMatchCount, 10),
                            0
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="blnpj">
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <i className="fa-solid fa-circle-xmark mr-1"></i>
                        Incorrect
                      </span>
                      {Result?.filter((k) => k.status === "incorrect").length}/
                      {Result?.length}
                    </div>
                    <Line
                      className="my-2"
                      percent={
                        (Result?.filter((k) => k.status === "incorrect")
                          .length *
                          100) /
                        Result?.length
                      }
                      strokeWidth={1}
                      strokeColor="#209bd1"
                    />
                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center ">Marks lost</span>
                      <div className="text-red-600">
                        {Result?.filter(
                          (question) => question.status === "incorrect"
                        ).reduce(
                          (sum, question) =>
                            sum + parseFloat(question.negativeMarks, 10),
                          0
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="blnpj">
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <i className="fa-solid fa-forward mr-1"></i> Skipped
                      </span>
                      {Result?.filter((k) => k.status === "skipped").length}/
                      {Result?.length}
                    </div>
                    <Line
                      className="my-2"
                      percent={
                        (Result?.filter((k) => k.status === "skipped").length *
                          100) /
                        Result?.length
                      }
                      strokeWidth={1}
                      strokeColor="#209bd1"
                    />
                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center ">Marks skipped</span>
                      <div>
                        {Result?.filter(
                          (question) => question.status === "skipped"
                        ).reduce(
                          (sum, question) =>
                            sum + parseFloat(question.marks, 10),
                          0
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{ width: "100%" }}
                  className="flex items-center justify-between">
                  <div className="blnpj">
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <i className="fa-solid fa-bullseye mr-1"></i> Accuracy
                      </span>
                      {(
                        (Result?.filter(
                          (k) =>
                            k.status === "correct" || k.status === "pcorrect"
                        ).length *
                          100) /
                        Result?.length
                      ).toFixed(2)}
                      %
                    </div>
                    <Line
                      className="my-2"
                      percent={
                        (Result?.filter(
                          (k) =>
                            (k.status === "correct") | (k.status === "pcorrect")
                        ).length *
                          100) /
                        Result?.length
                      }
                      strokeWidth={1}
                      strokeColor="#209bd1"
                    />
                  </div>
                  <div className="blnpj">
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <i className="fa-solid fa-file-circle-check mr-1"></i>{" "}
                        Completed
                      </span>
                      {(
                        ((Result?.length -
                          Result?.filter((k) => k.status === "skipped")
                            .length) *
                          100) /
                        Result?.length
                      ).toFixed(2)}
                      %
                    </div>
                    <Line
                      className="my-2"
                      percent={
                        ((Result?.length -
                          Result?.filter((k) => k.status === "skipped")
                            .length) *
                          100) /
                        Result?.length
                      }
                      strokeWidth={1}
                      strokeColor="#209bd1"
                    />
                  </div>
                  <div className="blnpj">
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <i className="fa-solid fa-clock mr-1"></i> Time taken
                      </span>
                      {TimeTaken?.formattedTime}
                    </div>
                    <Line
                      className="my-2"
                      percent={
                        (TimeTaken?.formattedTime
                          .split(":")
                          .reduce((acc, time) => 60 * acc + +time, 0) /
                          tests
                            ?.find((k) => k._id === id)
                            .exam_duration.split(":")
                            .reduce((acc, time) => 60 * acc + +time, 0)) *
                        100
                      }
                      strokeWidth={1}
                      strokeColor="#209bd1"
                    />
                  </div>
                </div>
              </div>
              <div className="secpro">
                <div className="font-semibold">Section Wise Performance</div>
                <div className="p-3 mt-3 bg-white hjg">
                  <table>
                    <thead>
                      <tr>
                        <th>Section</th>
                        <th>Score</th>
                        <th>Correct</th>
                        <th>Incorrect</th>
                        <th>Skipped</th>
                        <th>Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ...new Set(Result?.map((item) => item.selectedType))
                      ].map((val, index) => {
                        return (
                          <tr key={index}>
                            <td>{val}</td>
                            <td>
                              {Result?.filter(
                                (k) =>
                                  k.selectedType === val &&
                                  k.status === "correct"
                              ).reduce(
                                (sum, question) =>
                                  sum + parseFloat(question.marks, 10),
                                0
                              ) +
                                Result?.filter(
                                  (question) =>
                                    question.status === "incorrect" &&
                                    question.selectedType === val
                                ).reduce(
                                  (sum, question) =>
                                    sum +
                                    parseFloat(question.negativeMarks, 10),
                                  0
                                ) +
                                Result?.filter(
                                  (k) =>
                                    k.selectedType === val &&
                                    k.status === "pcorrect"
                                ).reduce(
                                  (sum, question) =>
                                    sum +
                                    parseFloat(question.trueMatchCount, 10),
                                  0
                                )}
                            </td>
                            <td>
                              {
                                Result?.filter(
                                  (k) =>
                                    k.selectedType === val &&
                                    k.status === "correct"
                                ).length
                              }

                              {val === "MSQ"
                                ? "+" +
                                  Result?.filter(
                                    (k) =>
                                      k.selectedType === "MSQ" &&
                                      k.status === "pcorrect"
                                  ).length +
                                  "(PC*)"
                                : ""}
                            </td>
                            <td>
                              {
                                Result?.filter(
                                  (k) =>
                                    k.selectedType === val &&
                                    k.status === "incorrect"
                                ).length
                              }
                            </td>
                            <td>
                              {
                                Result?.filter(
                                  (k) =>
                                    k.selectedType === val &&
                                    k.status === "skipped"
                                ).length
                              }
                            </td>
                            <td>
                              {(
                                (Result?.filter(
                                  (k) =>
                                    (k.status === "correct" ||
                                      k.status === "pcorrect") &&
                                    k.selectedType === val
                                ).length *
                                  100) /
                                Result?.filter((k) => k.selectedType === val)
                                  .length
                              ).toFixed(2)}
                              %
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {scoreData?.find((k) => k.PaperID === id)?.DeclaredresultpartB &&
              scoreData
                ?.find((k) => k.PaperID === id)
                ?.Students.find((k) => k.studentID === StudentID) ? (
                <>
                  <div className="text-2xl px-4 py-2 font-semibold">
                    Result Summary Part B
                  </div>
                  <div className="rhhn flex justify-between">
                    <div>
                      <h1 className="text-xl font-semibold">SCORE</h1>
                      <div
                        style={{ color: "#5ac9f9" }}
                        className="mt-10 text-7xl font-semibold">
                        {Number(
                          ResultPartB?.filter(
                            (question) => question.status === "correct"
                          )
                            .reduce(
                              (sum, question) =>
                                sum + parseFloat(question.providedmarks, 10),
                              0
                            )
                            .toFixed(2)
                        ) +
                          Number(
                            ResultPartB?.filter(
                              (question) => question.status === "pcorrect"
                            )
                              .reduce(
                                (sum, question) =>
                                  sum + parseFloat(question.providedmarks, 10),
                                0
                              )
                              .toFixed(2)
                          )}
                        <span className="text-xl font-bold text-black">
                          /
                          {ResultPartB?.reduce((sum, question) => {
                            const marks = parseFloat(
                              question.marks?.trim() || "0",
                              10
                            );
                            return sum + (isNaN(marks) ? 0 : marks);
                          }, 0)}
                        </span>
                      </div>
                    </div>
                    <img style={{ width: "15%" }} src={analytics} alt="img" />
                  </div>
                  <div className="secpro">
                    <div className="font-semibold">
                      Section Wise Performance
                    </div>
                    <div className="p-3 mt-3 bg-white hjg">
                      <table>
                        <thead>
                          <tr>
                            <th>Section</th>
                            <th>Score</th>
                            <th>Correct</th>
                            <th>Incorrect</th>
                            <th>Skipped</th>
                            <th>Accuracy</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ...new Set(
                              ResultPartB?.map((item) => item.selectedType)
                            )
                          ].map((val, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  {val === "D-APTITUDE"
                                    ? "DESIGN APTITUDE"
                                    : val}
                                </td>
                                <td>
                                  {ResultPartB?.filter(
                                    (k) =>
                                      k.selectedType === val &&
                                      k.status === "correct"
                                  ).reduce(
                                    (sum, question) =>
                                      sum +
                                      parseFloat(question.providedmarks, 10),
                                    0
                                  ) +
                                    ResultPartB?.filter(
                                      (k) =>
                                        k.selectedType === val &&
                                        k.status === "pcorrect"
                                    ).reduce(
                                      (sum, question) =>
                                        sum +
                                        parseFloat(question.providedmarks, 10),
                                      0
                                    )}
                                </td>
                                <td>
                                  {
                                    ResultPartB?.filter(
                                      (k) =>
                                        k.selectedType === val &&
                                        k.status === "correct"
                                    ).length
                                  }

                                  {"+" +
                                    ResultPartB?.filter(
                                      (k) =>
                                        k.selectedType === val &&
                                        k.status === "pcorrect"
                                    ).length +
                                    "(PC*)"}
                                </td>
                                <td>
                                  {
                                    ResultPartB?.filter(
                                      (k) =>
                                        k.selectedType === val &&
                                        k.status === "incorrect"
                                    ).length
                                  }
                                </td>
                                <td>
                                  {
                                    ResultPartB?.filter(
                                      (k) =>
                                        k.selectedType === val &&
                                        k.status === "skipped"
                                    ).length
                                  }
                                </td>
                                <td>
                                  {(
                                    (ResultPartB?.filter(
                                      (k) =>
                                        (k.status === "correct" ||
                                          k.status === "pcorrect") &&
                                        k.selectedType === val
                                    ).length *
                                      100) /
                                    ResultPartB?.filter(
                                      (k) => k.selectedType === val
                                    ).length
                                  ).toFixed(2)}
                                  %
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex justify-center text-2xl font-semibold my-10">
                  Rank and Result of Part B will be declare soon...
                </div>
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
