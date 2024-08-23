import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useFormik, Field } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";
Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "36%"
  }
};
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
  const { UpdateAnsStatus, setactivesolSection, activesolSection } = useAuth();

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
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  const { studentID, testID } = useParams();
  const initialValues = {
    ansstatus: "",
    cmarks: ""
  };
  const validationSchema = Yup.object({
    ansstatus: Yup.string()
      .oneOf(["correct", "incorrect", "pcorrect"], "Invalid status")
      .required("Mark status is required"),
    cmarks: Yup.string().required("Please provide marks")
  });

  const { values, touched, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const submissionValues = {
        ...values,
        studentID: studentID,
        testID: testID,
        questionID: val.questionId
      };

      UpdateAnsStatus(submissionValues);
      resetForm();
      closeModal();
      //   notify();
    }
  });

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
            <span className="ml-1">{activesolSection}</span>
          </div>
          {["NAT", "MSQ", "MCQ"].includes(
            val.selectedType
          ) ? null : val.answer ? (
            <button onClick={openModal} className="btn-sbt ml-2">
              Provide marks
            </button>
          ) : null}
        </div>
        <div className="hgvg-s">
          <div>
            <img alt="image" src={val.question} />
          </div>
          {["NAT", "MSQ", "MCQ"].includes(val.selectedType) ? (
            <div className="my-10 flex items-center justify-center text-sm">
              <div className="gggk-s">
                <div className="flex items-center justify-center">
                  <div className="hd-s flex justify-between mr-2">
                    <span className="font-semibold"> Status</span>
                    <span className={getColor()}>{getStatus()}</span>
                  </div>
                  <div className="hd-s flex justify-between">
                    <span className="font-semibold">Marks</span>
                    <span className={getColor()}>{getMarks()}</span>
                  </div>
                </div>
                <div className="hd-ss flex justify-center mt-2">
                  <span>Correct Answer:</span>
                  <span className="ml-1"> {getCorrectAnswer()}</span>
                </div>
              </div>
            </div>
          ) : val.providedmarks ? (
            <div className="my-10 flex items-center justify-center text-sm">
              <div className="gggk-s">
                <div className="flex items-center justify-center">
                  <div className="hd-s flex justify-between mr-2">
                    <span className="font-semibold"> Status</span>
                    <span className={getColor()}>{getStatus()}</span>
                  </div>
                  <div className="hd-s flex justify-between">
                    <span className="font-semibold">Marks</span>
                    <span className={getColor()}>{val.providedmarks}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {["NAT", "MSQ", "MCQ"].includes(val.selectedType) ? (
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
                          : val.correctAnswer === k &&
                            val.status === "incorrect"
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
          ) : val.answer ? (
            <div>
              <hr className="my-3" />
              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold">Answer</div>
                <div className="flex items-center">
                  <a
                    className="underline text-blue-500 mr-2"
                    href={val.answer}
                    target="_blank">
                    Image Link
                  </a>
                </div>
              </div>
              <div
                className="flex justify-center items-center bg-gray-200"
                style={{ border: "1px solid grey" }}>
                <TransformWrapper>
                  <TransformComponent>
                    <img src={val.answer} alt="answer" />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            </div>
          ) : (
            <>
              <hr className="my-3" />
              <div className="flex items-center text-xl font-semibold">
                Answer:{" "}
                <div className="text-sm font-semibold ml-1 text-gray-500">
                  Skipped
                </div>
              </div>
            </>
          )}

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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}>
        <div className="justify-between flex yth">
          <div>Provide Marks</div>
          <button
            style={{ color: "black" }}
            className="text-xl"
            onClick={closeModal}>
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
        <form style={{ padding: "20px 0px" }} onSubmit={handleSubmit}>
          <select
            value={values.ansstatus}
            onChange={handleChange}
            name="ansstatus"
            className="attp-slct">
            <option value="">Mark status</option>
            <option value="correct">Correct</option>
            <option value="incorrect">Incorrect</option>
            <option value="pcorrect">Partially Correct</option>
          </select>
          <div className="flex items-center justify-between my-2">
            <input
              className={
                errors.cmarks && touched.cmarks
                  ? "bg-ffeeee border-red-500 inpt-pt2 npt"
                  : "bg-white inpt-pt2 npt"
              }
              id="cmarks"
              name="cmarks"
              placeholder="Correct marks"
              type="text"
              value={values.cmarks}
              onChange={handleChange}
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              style={{ width: "170px" }}
              className="btn-sub">
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default function StudentAnswer() {
  const { Result, activesolSection, setactivesolSection, StudentAnswer } =
    useAuth();
  const { studentID, testID } = useParams();

  useEffect(() => {
    StudentAnswer(studentID, testID);
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
        ...new Set(Result?.map((item) => item.selectedType))
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
    <div>
      <Link
        to={`/studentresult/${testID}`}
        className="back-s flex items-center">
        <i className="fa-solid fa-angle-left mr-1"></i>Back
      </Link>
      <div>
        <div className="p-3 pb-0">
          <div className="all-s flex items-center">
            {[...new Set(Result?.map((item) => item.selectedType))].map(
              (val, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setactivesolSection(val);
                    }}
                    style={{ padding: "5px 10px" }}
                    className={activesolSection === val ? "thd mr-1" : "mr-1"}>
                    {val}
                  </button>
                );
              }
            )}
          </div>
        </div>
        <div className="flex mt-1">
          {Result?.filter((k) => k.selectedType === activesolSection)
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
                <div className="hf-s">{Result?.length}</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-center">Correct</div>
                <div className="hf-s bg-green-600">
                  {Result?.filter((k) => k.status === "correct").length || 0}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-center">P-Correct</div>
                <div className="hf-s bg-green-400">
                  {Result?.filter((k) => k.status === "pcorrect").length || 0}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-center">Incorrect</div>
                <div className="hf-s bg-red-600">
                  {Result?.filter((k) => k.status === "incorrect").length}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-center">Skipped</div>
                <div className="hf-s bg-gray-500">
                  {Result?.filter((k) => k.status === "skipped").length}
                </div>
              </div>
            </div>
            <hr className="my-1" />
            <div
              style={{ height: "400px", overflowY: "auto" }}
              className="grid grid-cols-6 gap-1 justify-items-center">
              {Result?.filter((k) => k.selectedType === activesolSection).map(
                (val, index) => {
                  return (
                    <ButtonNO
                      val={val}
                      key={index}
                      index={index}
                      setCurrentSliceIndex={setCurrentSliceIndex}
                      currentSliceIndex={currentSliceIndex}
                    />
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
