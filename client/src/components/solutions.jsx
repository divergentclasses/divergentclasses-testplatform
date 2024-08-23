import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Img from "../images/Screenshot 2024-07-10 150836.png";
import { useAuth } from "../contexts/AuthContext";
import SpinnerLoader from "./spinnerloader";

const ButtonNO = ({ val, index, setCurrentSliceIndex, currentSliceIndex }) => {
  const getStatusClass = () => {
    switch (val.status) {
      case "correct":
        return "btn-sng";
      case "incorrect":
        return "btn-snr";
      case "pcorrect":
        return "btn-sng";
      case "skipped":
        return "";
      default:
        return "";
    }
  };
  const ChangebyNO = () => {
    setCurrentSliceIndex(index);
  };

  return (
    <>
      <button
        className={
          currentSliceIndex === index
            ? `btn-sn border-2 ${getStatusClass()}`
            : `btn-sn ${getStatusClass()}`
        }
        onClick={() => ChangebyNO()}>
        {index + 1}
      </button>
    </>
  );
};
const Question = ({
  currentSliceIndex,
  val,
  handleNextSlice,
  handlePrevSlice
}) => {
  const { scoreData, setactivesolSection, activesolSection } = useAuth();
  const { studentID, testID } = useParams();

  const getColor = () => {
    switch (val.status) {
      case "correct":
        return "text-green-500";
      case "incorrect":
        return "text-red-500";
      case "pcorrect":
        return "text-blue-500";
      case "skipped":
        return "text-black";
      default:
        return "";
    }
  };
  const getStatus = () => {
    switch (val.status) {
      case "correct":
        return "Correct";
      case "incorrect":
        return "Incorrect";
      case "pcorrect":
        return "Partially Correct";
      case "skipped":
        return "Skipped";
      default:
        return "";
    }
  };
  const getMarks = () => {
    switch (val.status) {
      case "correct":
        return `+${val.marks}`;
      case "incorrect":
        return val.negativeMarks;
      case "pcorrect":
        return `+${val.trueMatchCount}`;
      case "skipped":
        return 0;
      default:
        return "";
    }
  };
  const getMarksB = () => {
    switch (val.status) {
      case "correct":
        return `+${val.providedmarks}`;
      case "incorrect":
        return val.negativeMarks;
      case "pcorrect":
        return `+${val.providedmarks}`;
      case "skipped":
        return 0;
      default:
        return "";
    }
  };
  const getCorrectAnswer = () => {
    switch (val.selectedType) {
      case "NAT":
        return val.correctAnswer;
      case "MCQ":
        return val.correctAnswer;
      case "MSQ":
        return Object.entries(val.correctAnswer)
          .filter(([key, value]) => value === "true")
          .map(([key]) => key)
          .join(",");
      default:
        return "";
    }
  };
  useEffect(() => {
    console.log(
      scoreData
        ?.find((k) => k.PaperID === testID)
        ?.Students.find((k) => k.studentID === studentID)
    );
  }, []);

  return (
    <>
      <div className="left-s w-3/4 relative">
        <div className="flex items-center p-3">
          <div
            className="mr-2"
            style={{
              borderRight: "1px solid grey",
              padding: "0 10px 0 0"
            }}>
            <div className="btn-s">{currentSliceIndex + 1}</div>
          </div>
          <div className="ghh-s flex items-center">
            <span className="font-semibold">Marks:</span>{" "}
            <span className="text-green-500 ml-1">+{val.marks}</span>
          </div>
          <div className="ghh-s flex items-center ml-2">
            <span className="font-semibold">Negative Marks:</span>{" "}
            <span className="text-red-500 ml-1">{val.negativeMarks}</span>
          </div>
          <div className="ghh-s flex items-center ml-2">
            <span className="font-semibold">Type: </span>{" "}
            <span className="ml-1">
              {activesolSection === "D-APTITUDE"
                ? "DESIGN APTITUDE"
                : activesolSection}
            </span>
          </div>
        </div>
        <div className="hgvg-s">
          <div>
            <img alt="image" src={val.question} />
          </div>
          <div className="my-10 flex items-center justify-center text-sm">
            <div className="gggk-s">
              <div className="flex items-center justify-center">
                <div className="hd-s flex justify-between mr-2">
                  <span className="font-semibold"> Status</span>
                  <span className={getColor()}>{getStatus()}</span>
                </div>
                <div className="hd-s flex justify-between">
                  <span className="font-semibold">Marks</span>
                  <span className={getColor()}>
                    {scoreData
                      ?.find((k) => k.PaperID === testID)
                      ?.Students.find((k) => k.studentID === studentID) &&
                    !["NAT", "MSQ", "MCQ"].includes(activesolSection)
                      ? getMarksB()
                      : getMarks()}
                  </span>
                </div>
              </div>
              {scoreData
                ?.find((k) => k.PaperID === testID)
                ?.Students.find((k) => k.studentID === studentID) &&
              !["NAT", "MSQ", "MCQ"].includes(activesolSection) ? null : (
                <div className="hd-ss flex justify-center mt-2">
                  <span>Correct Answer:</span>
                  <span className="ml-1"> {getCorrectAnswer()}</span>
                </div>
              )}
            </div>
          </div>
          <div className="mx-3">
            {val.selectedType === "MCQ" ? (
              ["A", "B", "C", "D"].map((k, index) => {
                return (
                  <div
                    key={index}
                    className={`option-s flex justify-between mt-2 ${
                      val.correctAnswer === k && val.status === "correct"
                        ? "option-g"
                        : val.correctAnswer === k && val.status === "skipped"
                        ? "option-b"
                        : val.correctAnswer === k && val.status === "incorrect"
                        ? "option-b"
                        : ""
                    } ${
                      val.answer === k && val.status === "incorrect"
                        ? "option-r"
                        : ""
                    }`}>
                    <span>{k}</span>
                  </div>
                );
              })
            ) : val.selectedType === "NAT" ? (
              <div
                className={`option-s flex justify-between mt-2 ${
                  val.status === "correct"
                    ? "option-g"
                    : val.status === "incorrect"
                    ? "option-r"
                    : "option-b"
                }`}>
                <span>{val.answer || val.correctAnswer}</span>
              </div>
            ) : val.selectedType === "MSQ" ? (
              ["A", "B", "C", "D"].map((k, index) => {
                return (
                  <div
                    key={index}
                    className={`option-s flex justify-between mt-2 ${
                      val.correctAnswer[k] === "true" &&
                      val.status === "correct"
                        ? "option-g"
                        : val.correctAnswer[k] === "true" &&
                          val.status === "skipped"
                        ? "option-b"
                        : ""
                    } ${
                      val.answer[k] === true && val.status === "incorrect"
                        ? "option-r"
                        : ""
                    } ${
                      val.correctAnswer[k] === "true" &&
                      val.status === "incorrect" &&
                      val.answer[k] === false
                        ? "option-b"
                        : ""
                    } ${
                      val.correctAnswer[k] === "true" &&
                      val.status === "incorrect" &&
                      val.answer[k] === true
                        ? "option-g"
                        : ""
                    } ${
                      val.answer[k] === true && val.status === "pcorrect"
                        ? "option-g"
                        : val.correctAnswer[k] === "true" &&
                          val.status === "pcorrect"
                        ? "option-b"
                        : ""
                    }`}>
                    <span>{k}</span>
                  </div>
                );
              })
            ) : null}
          </div>
          <hr className="my-3" />
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold">Solution</div>
            {val.videoSolution ? (
              <a className="vd-sol" href={val.videoSolution} target="_blank">
                <i className="fa-solid fa-circle-play mr-1"></i>Video Solution
              </a>
            ) : null}
          </div>
          {val.solution ? (
            <div className="mt-2">
              <img style={{ width: "90%" }} alt="solution" src={val.solution} />
            </div>
          ) : (
            <div className="text-blue-500">
              Solution will be release soon...
            </div>
          )}
        </div>
        <div
          className={`jhk-s flex ${
            currentSliceIndex === 0 ? "justify-end" : "justify-between"
          }`}>
          {currentSliceIndex === 0 ? null : (
            <button
              className="btnprevs"
              onClick={() => {
                handlePrevSlice();
              }}>
              Previous
            </button>
          )}
          <button
            className="btnnxts"
            onClick={() => {
              handleNextSlice();
            }}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default function Solutions() {
  const {
    Result,
    activesolSection,
    setactivesolSection,
    showResult,
    ResultPartB,
    ResultpartBfun,
    scoreData
  } = useAuth();
  const { studentID, testID } = useParams();

  useEffect(() => {
    showResult(studentID, testID);
    ResultpartBfun(studentID, testID);
  }, []);

  const [currentSliceIndex, setCurrentSliceIndex] = useState(0);
  const handleNextSlice = () => {
    if (
      currentSliceIndex <
      Result?.filter((type) => type.selectedType === activesolSection).length -
        1
    ) {
      setCurrentSliceIndex(Number(currentSliceIndex) + 1);
    } else {
      setCurrentSliceIndex(0);
      const uniqueTypes = [
        ...new Set(
          [...Result, ...ResultPartB]?.map((item) => item.selectedType)
        )
      ];
      const index = uniqueTypes.findIndex((item) => item === activesolSection);
      if (index === uniqueTypes.length - 1) {
        setactivesolSection(uniqueTypes[0]);
      } else {
        setactivesolSection(
          uniqueTypes[
            uniqueTypes.findIndex((item) => item === activesolSection) + 1
          ]
        );
      }
    }
  };
  useEffect(() => {
    setCurrentSliceIndex(0);
  }, [activesolSection]);

  const handlePrevSlice = () => {
    setCurrentSliceIndex(Number(currentSliceIndex) - 1);
  };

  return (
    <>
      {Result && scoreData ? (
        <div>
          <Link to={`/result/${testID}`} className="back-s flex items-center">
            <i className="fa-solid fa-angle-left mr-1"></i>Back
          </Link>
          <div>
            <div className="p-3 pb-0">
              <div className="all-s flex items-center">
                {scoreData?.find((k) => k.PaperID === testID)
                  ?.DeclaredresultpartB &&
                scoreData
                  ?.find((k) => k.PaperID === testID)
                  ?.Students.find((k) => k.studentID === studentID)
                  ? [
                      ...new Set(
                        [...Result, ...ResultPartB]?.map(
                          (item) => item.selectedType
                        )
                      )
                    ].map((val, index) => {
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setactivesolSection(val);
                          }}
                          style={{ padding: "5px 10px" }}
                          className={
                            activesolSection === val ? "thd mr-1" : "mr-1"
                          }>
                          {val === "D-APTITUDE" ? "DESIGN APTITUDE" : val}
                        </button>
                      );
                    })
                  : [...new Set(Result?.map((item) => item.selectedType))].map(
                      (val, index) => {
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              setactivesolSection(val);
                            }}
                            style={{ padding: "5px 10px" }}
                            className={
                              activesolSection === val ? "thd mr-1" : "mr-1"
                            }>
                            {val}
                          </button>
                        );
                      }
                    )}
              </div>
            </div>
            <div className="flex mt-1">
              {scoreData?.find((k) => k.PaperID === testID)
                ?.DeclaredresultpartB &&
              scoreData
                ?.find((k) => k.PaperID === testID)
                ?.Students.find((k) => k.studentID === studentID)
                ? [...Result, ...ResultPartB]
                    ?.filter((k) => k.selectedType === activesolSection)
                    .slice(currentSliceIndex, currentSliceIndex + 1)
                    .map((val, index) => {
                      return (
                        <Question
                          key={index}
                          val={val}
                          currentSliceIndex={currentSliceIndex}
                          handleNextSlice={handleNextSlice}
                          handlePrevSlice={handlePrevSlice}
                        />
                      );
                    })
                : Result?.filter((k) => k.selectedType === activesolSection)
                    .slice(currentSliceIndex, currentSliceIndex + 1)
                    .map((val, index) => {
                      return (
                        <Question
                          key={index}
                          val={val}
                          currentSliceIndex={currentSliceIndex}
                          handleNextSlice={handleNextSlice}
                          handlePrevSlice={handlePrevSlice}
                        />
                      );
                    })}
              <div className="right-s px-3 py-3 w-1/4">
                <div
                  style={{ width: "100%" }}
                  className="flex justify-around items-center text-xs">
                  <div className=" flex-col items-center justify-center">
                    <div className="text-center">All</div>
                    <div className="hf-s">
                      {scoreData
                        ?.find((k) => k.PaperID === testID)
                        ?.Students.find((k) => k.studentID === studentID)
                        ? [...Result, ...ResultPartB]?.length
                        : Result?.length}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-center">Correct</div>
                    <div className="hf-s bg-green-600">
                      {scoreData?.find((k) => k.PaperID === testID)
                        ?.DeclaredresultpartB &&
                      scoreData
                        ?.find((k) => k.PaperID === testID)
                        ?.Students.find((k) => k.studentID === studentID)
                        ? [...Result, ...ResultPartB]?.filter(
                            (k) => k.status === "correct"
                          ).length || 0
                        : Result?.filter((k) => k.status === "correct")
                            .length || 0}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-center">P-Correct</div>
                    <div className="hf-s bg-green-400">
                      {scoreData?.find((k) => k.PaperID === testID)
                        ?.DeclaredresultpartB &&
                      scoreData
                        ?.find((k) => k.PaperID === testID)
                        ?.Students.find((k) => k.studentID === studentID)
                        ? [...Result, ...ResultPartB]?.filter(
                            (k) => k.status === "pcorrect"
                          ).length || 0
                        : Result?.filter((k) => k.status === "pcorrect")
                            .length || 0}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-center">Incorrect</div>
                    <div className="hf-s bg-red-600">
                      {scoreData?.find((k) => k.PaperID === testID)
                        ?.DeclaredresultpartB &&
                      scoreData
                        ?.find((k) => k.PaperID === testID)
                        ?.Students.find((k) => k.studentID === studentID)
                        ? [...Result, ...ResultPartB]?.filter(
                            (k) => k.status === "incorrect"
                          ).length || 0
                        : Result?.filter((k) => k.status === "incorrect")
                            .length || 0}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-center">Skipped</div>
                    <div className="hf-s bg-gray-500">
                      {scoreData?.find((k) => k.PaperID === testID)
                        ?.DeclaredresultpartB &&
                      scoreData
                        ?.find((k) => k.PaperID === testID)
                        ?.Students.find((k) => k.studentID === studentID)
                        ? [...Result, ...ResultPartB]?.filter(
                            (k) => k.status === "skipped"
                          ).length || 0
                        : Result?.filter((k) => k.status === "skipped")
                            .length || 0}
                    </div>
                  </div>
                </div>
                <hr className="my-1" />
                <div
                  style={{ height: "400px", overflowY: "auto" }}
                  className="grid grid-cols-6 gap-1 justify-items-center">
                  {scoreData
                    ?.find((k) => k.PaperID === testID)
                    ?.Students.find((k) => k.studentID === studentID)
                    ? [...Result, ...ResultPartB]
                        ?.filter((k) => k.selectedType === activesolSection)
                        .map((val, index) => {
                          return (
                            <ButtonNO
                              val={val}
                              key={index}
                              index={index}
                              setCurrentSliceIndex={setCurrentSliceIndex}
                              currentSliceIndex={currentSliceIndex}
                            />
                          );
                        })
                    : Result?.filter(
                        (k) => k.selectedType === activesolSection
                      ).map((val, index) => {
                        return (
                          <ButtonNO
                            val={val}
                            key={index}
                            index={index}
                            setCurrentSliceIndex={setCurrentSliceIndex}
                            currentSliceIndex={currentSliceIndex}
                          />
                        );
                      })}
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
