import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useAuth } from "../contexts/AuthContext";
import SpinnerLoaderW from "./spinnerloaderW";

Modal.setAppElement("#root");

const ButoonSelect = ({ val, index }) => {
  const {
    clickData,
    onUpdateQuestion,
    currentSliceIndex,
    buttonload,
    setbuttonload
  } = useAuth();
  const [activeStatus, setactiveStatus] = useState("nos");
  const renderStatus = () => {
    switch (activeStatus) {
      case "red":
        return "nos2";
      case "green":
        return "nos5";
      case "purple":
        return "nos4";
      case "purpleT":
        return "nos3";
      default:
        return "nos";
    }
  };
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(import.meta.env.VITE_SOCKET_URL);

    ws.current.onopen = () => {
      // console.log("WebSocket Client Connected");
    };
    ws.current.onmessage = (message) => {
      const receivedAnswers = JSON.parse(message.data);
      const data = receivedAnswers
        .find((val) => val.PaperID === localStorage.getItem("testId"))
        .Participants.Students.find(
          (val) => val.studentID === localStorage.getItem("studentID")
        )
        .answers.find((k) => k.q_id === val._id)?.status;
      setactiveStatus(data);
      if (data === "green" && val._id === buttonload.q_id) {
        setbuttonload((prevState) => ({
          ...prevState,
          sts: false
        }));
      }
    };
    return () => {
      ws.current.close();
    };
  }, [currentSliceIndex, val]);

  return (
    <>
      <button
        onClick={() => {
          onUpdateQuestion(index);
          clickData(index);
        }}
        style={{ transition: "0.15s ease-in" }}
        className={renderStatus()}>
        {buttonload.q_id === val._id ? (
          buttonload.sts ? (
            <div
              style={{ height: "20px", width: "20px" }}
              className="spinner-border"
              role="status">
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            index + 1
          )
        ) : (
          index + 1
        )}
      </button>
    </>
  );
};

export function PARTBRIGHT() {
  const { tests, userdata, activeSection, setActiveSection, userlogin } =
    useAuth();
  const { id } = useParams();

  return (
    <>
      <div
        style={{
          backgroundColor: "#209bd1",
          fontWeight: "500",
          color: "white"
        }}
        className="px-2 py-1">
        {activeSection === "D-APTITUDE" ? "DESIGN APTITUDE" : "SKETCHING"}
      </div>
      <div className="p-1 text-center position-relative">
        <div style={{ fontWeight: "500" }} className="text-sm">
          Choose a question
        </div>
        <div style={{ overflowY: "auto", height: "242px" }}>
          {tests
            ?.filter((item) => item._id === id)[0]
            .questions.filter((type) => type.selectedType === activeSection)
            ?.map((val, index) => {
              return <ButoonSelect val={val} key={index} index={index} />;
            })}
        </div>
      </div>
    </>
  );
}
export function PARTBQUESTIONS() {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "75%"
    }
  };
  const { tests } = useAuth();
  const { id } = useParams();
  const [modalIsOpenQ, setIsOpenQ] = useState(false);
  function openModalQ() {
    setIsOpenQ(true);
  }
  function closeModalQ() {
    setIsOpenQ(false);
  }

  return (
    <>
      <div className="mr-3 flex items-center">
        <button className="view-ins" onClick={openModalQ}>
          <i className="fa-solid fa-circle mr-1 text-green-700"></i>Question
          paper
        </button>
      </div>
      <Modal
        isOpen={modalIsOpenQ}
        onRequestClose={closeModalQ}
        style={customStyles}
        shouldCloseOnOverlayClick={false}>
        <div className="justify-between flex yth">
          <div>Question Paper</div>
          <button
            style={{ color: "black" }}
            className="text-xl"
            onClick={closeModalQ}>
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
        <div className="text-red-600 my-1 text-center">
          Note that timer is ticking while you read the questions. Close this
          page to return to answering the questions.
        </div>
        <div className="ovrflow-ins">
          <div style={{ fontWeight: "600" }} className="mt-4 text-center"></div>
          <div className="px-2 py-2 text-sm mb-2">
            {[
              ...new Set(
                tests
                  ?.find((item) => item._id === id)
                  .questions.map((q) => q.selectedType)
                  .filter((type) => !["NAT", "MSQ", "MCQ"].includes(type))
              )
            ].map((res, index) => {
              return (
                <div key={index}>
                  <div className="text-xl font-semibold">
                    {res === "D-APTITUDE" ? "DESIGN APTITUDE" : res}
                  </div>
                  {tests
                    ?.filter((item) => item._id === id)[0]
                    .questions.filter((type) => type.selectedType === res)
                    ?.map((val, index) => {
                      return (
                        <div
                          key={index}
                          className="mt-2 p-3 bg-white hjg text-sm">
                          <div className="flex">
                            <div className="mr-1">
                              Q. {index + 1}
                              {")"}
                            </div>
                            <img
                              style={{ width: "95%" }}
                              alt="img"
                              src={val?.question}
                            />
                          </div>
                          <div className="flex items-center mt-4 italic">
                            <div className="mr-2">
                              Question Type:{" "}
                              <span className="font-semibold">
                                {val.selectedType === "D-APTITUDE"
                                  ? "DESIGN APTITUDE"
                                  : val.selectedType}
                              </span>
                              {";"}
                            </div>
                            <div className="mr-2">
                              Marks for correct answer:{" "}
                              <span className="font-semibold text-green-600">
                                {val?.marks}
                              </span>
                              {";"}
                            </div>
                            <div>
                              Negative Marks:{" "}
                              <span className="font-semibold text-red-600">
                                {val?.negativemarks}
                              </span>
                            </div>
                          </div>
                          <hr className="my-2" />
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
}

const Questions = ({
  val,
  handleAnswerChangeMRN,
  handleAnswerChange,
  answers
}) => {
  const { dataclick, currentSliceIndex, setCurrentSliceIndex, activeSection } =
    useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2)
      });
    }
    setSelectedImage(file);
  };

  useEffect(() => {
    var value = answers.filter((ans) => ans.q_id === val._id)[0]?.ans;
    setSelectedImage(
      value ? answers.filter((ans) => ans.q_id === val._id)[0]?.ans : ""
    );
    setImageInfo({
      name: value
        ? answers.filter((ans) => ans.q_id === val._id)[0]?.imagename
        : "",
      size: value
        ? answers.filter((ans) => ans.q_id === val._id)[0]?.imagesize
        : ""
    });
  }, [answers, dataclick]);
  const ws = useRef(null);
  useEffect(() => {
    ws.current = new WebSocket(import.meta.env.VITE_SOCKET_URL);

    ws.current.onopen = () => {
      // console.log("WebSocket Client Connected");
    };
    ws.current.onmessage = (message) => {
      const receivedAnswers = JSON.parse(message.data);

      let status = receivedAnswers
        .find((val) => val.PaperID === localStorage.getItem("testId"))
        .Participants.Students.find(
          (val) => val.studentID === localStorage.getItem("studentID")
        )
        .answers.filter((k) => k.q_id === val._id).length;

      const runfun = () => {
        if (ws.current.readyState === WebSocket.OPEN) {
          const data = {
            PaperID: localStorage.getItem("testId"),
            studentID: localStorage.getItem("studentID"),
            q_id: val._id,
            ans: "",
            status: "red"
          };
          ws.current.send(JSON.stringify(data));
        }
      };
      if (
        status === 0 ||
        receivedAnswers
          .find((val) => val.PaperID === localStorage.getItem("testId"))
          .Participants.Students.find(
            (val) => val.studentID === localStorage.getItem("studentID")
          ) === undefined
      ) {
        runfun();
      }
    };

    return () => {
      ws.current.close();
    };
  }, [currentSliceIndex, activeSection]);

  const inputFileRef = useRef(null);

  const ClearResponse = () => {
    setSelectedImage("");
    setImageInfo({
      name: "",
      size: ""
    });
    if (inputFileRef.current) {
      inputFileRef.current.value = ""; 
    }
  };
  return (
    <div>
      {" "}
      <img
        className="px-2"
        style={{ width: "70%" }}
        alt="img"
        src={val?.question}
      />
      <div className="text-center my-8 pb-2">
        {imageInfo?.name ? (
          <div className="img-ans flex items-center justify-center">
            <i
              style={{ color: "#f0bd0e" }}
              className="fa-solid fa-5x fa-file-image"></i>
            <div className="ml-2">
              {imageInfo?.name} ({imageInfo?.size} KB)
            </div>
          </div>
        ) : (
          <label htmlFor="input-file" className="upimgqs text-sm">
            <i className="fa-solid fa-arrow-up-from-bracket mr-1"></i> Upload
          </label>
        )}
        <input
          // ref={inputFileRef}
          name="image"
          className="hidden"
          type="file"
          accept="image/*"
          id="input-file"
          onChange={(e) => {
            handleImageChange(e);
          }}
        />
      </div>
      <div className="ts-tstfxd flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="btn-tstnxt mr-3"
            onClick={() => {
              handleAnswerChangeMRN(val?._id, selectedImage, imageInfo);
            }}>
            Mark & Review Next
          </button>
          <button
            className="btn-tstnxt"
            onClick={() => {
              ClearResponse();
            }}>
            Clear Response
          </button>
        </div>
        <div>
          {currentSliceIndex === 0 ? null : (
            <button
              onClick={() => {
                setCurrentSliceIndex(currentSliceIndex - 1);
              }}
              className="btn-tstprev mr-2">
              Previous
            </button>
          )}
          <button
            onClick={() => {
              handleAnswerChange(val?._id, selectedImage, imageInfo);
            }}
            style={{ backgroundColor: "#209bd1", color: "white" }}
            className="btn-tstnxt">
            Save & Next <i className="fa-solid fa-angle-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

const TYPE = ({ setActiveSection }) => {
  const {
    tests,
    currentSliceIndex,
    setCurrentSliceIndex,
    activeSection,
    buttonload,
    setbuttonload
  } = useAuth();
  const { id } = useParams();

  const questionsPerPage = 1;
  const [answers, setAnswers] = useState([]);
  const handleNextSlice = () => {
    if (
      currentSliceIndex <
      tests
        ?.filter((item) => item._id === localStorage.getItem("testId"))[0]
        .questions.filter((type) => type.selectedType === activeSection)
        .length -
        questionsPerPage
    ) {
      setCurrentSliceIndex(Number(currentSliceIndex) + questionsPerPage);
    } else {
      const data = [
        ...new Set(
          tests
            ?.find((item) => item._id === id)
            .questions.map((q) => q.selectedType)
            .filter((type) => !["NAT", "MSQ", "MCQ"].includes(type))
        )
      ];
      if (data.length > 1 && data.indexOf(activeSection) + 1 < data.length) {
        setActiveSection(data[data.indexOf(activeSection) + 1]);
      } else {
        setActiveSection(data[0]);
      }
    }
  };
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(import.meta.env.VITE_SOCKET_URL);

    ws.current.onopen = () => {
      // console.log("WebSocket Client Connected");
    };
    ws.current.onmessage = (message) => {
      const receivedAnswers = JSON.parse(message.data);
      setAnswers(
        receivedAnswers
          .find((val) => val.PaperID === localStorage.getItem("testId"))
          .Participants.Students.find(
            (val) => val.studentID === localStorage.getItem("studentID")
          ).answers
      );
    };

    return () => {
      ws.current.close();
    };
  }, [currentSliceIndex]);

  const handleAnswerChange = (questionId, answer, imageInfo) => {
    if (imageInfo.name) {
      setbuttonload({ sts: true, q_id: questionId });
    }

    const newAnswer = {
      q_id: questionId,
      ans: answer,
      imagename: imageInfo.name || "",
      imagesize: imageInfo.size || "",
      studentID: localStorage.getItem("studentID"),
      PaperID: localStorage.getItem("testId"),
      status: answer ? "green" : "red"
    };

    if (answer instanceof File || answer instanceof Blob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newAnswer.ans = reader.result;

        setAnswers((prevAnswers) => {
          const updatedAnswers = prevAnswers.filter(
            (ans) => ans.q_id !== questionId
          );
          return [...updatedAnswers, newAnswer];
        });

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify(newAnswer));
        }
        handleNextSlice();
      };

      reader.readAsDataURL(answer);
    } else {
      setAnswers((prevAnswers) => {
        const updatedAnswers = prevAnswers.filter(
          (ans) => ans.q_id !== questionId
        );
        return [...updatedAnswers, newAnswer];
      });

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(newAnswer));
      }

      handleNextSlice();
    }
  };
  const handleAnswerChangeMRN = (questionId, answer, imageInfo) => {
    if (imageInfo.name) {
      setbuttonload({ sts: true, q_id: questionId });
    }
    const newAnswer = {
      q_id: questionId,
      ans: answer,
      imagename: imageInfo.name || "",
      imagesize: imageInfo.size || "",
      studentID: localStorage.getItem("studentID"),
      PaperID: localStorage.getItem("testId"),
      status: answer ? "purpleT" : "purple"
    };

    if (answer instanceof File || answer instanceof Blob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newAnswer.ans = reader.result;

        setAnswers((prevAnswers) => {
          const updatedAnswers = prevAnswers.filter(
            (ans) => ans.q_id !== questionId
          );
          return [...updatedAnswers, newAnswer];
        });

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify(newAnswer));
        }
        handleNextSlice();
      };

      reader.readAsDataURL(answer);
    } else {
      setAnswers((prevAnswers) => {
        const updatedAnswers = prevAnswers.filter(
          (ans) => ans.q_id !== questionId
        );
        return [...updatedAnswers, newAnswer];
      });

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(newAnswer));
      }

      handleNextSlice();
    }
  };

  return (
    <>
      <div
        className="px-2 flex items-center"
        style={{
          fontWeight: "500",
          borderBottom: "1px solid rgb(199, 199, 199)"
        }}>
        <div className="text-sm py-1">
          Question No. {currentSliceIndex + questionsPerPage}
        </div>
      </div>
      <div style={{ height: "55vh", overflowY: "auto" }}>
        {tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === activeSection)
          .slice(currentSliceIndex, currentSliceIndex + questionsPerPage)
          .map((val, index) => {
            return (
              <Questions
                val={val}
                key={index}
                handleAnswerChange={handleAnswerChange}
                handleAnswerChangeMRN={handleAnswerChangeMRN}
                answers={answers}
              />
            );
          })}
      </div>
    </>
  );
};
export default function PARTB() {
  const { tests, userdata, activeSection, setActiveSection, userlogin } =
    useAuth();
  const { id } = useParams();

  useEffect(() => {
    setActiveSection(
      [
        ...new Set(
          tests
            ?.find((item) => item._id === id)
            .questions.map((q) => q.selectedType)
            .filter((type) => !["NAT", "MSQ", "MCQ"].includes(type))
        )
      ][0]
    );
  }, []);

  const renderType = () => {
    switch (activeSection) {
      case "SKETCHING":
        return "Sketching";
      case "D-APTITUDE":
        return "Design Aptitude";
      default:
        return "Sketching";
    }
  };
  return (
    <>
      <div
        style={{
          fontWeight: "600",
          color: "#209bd1",
          borderBottom: "1px solid rgb(199, 199, 199)"
        }}
        className="flex text-xs">
        {[
          ...new Set(
            tests
              ?.find((item) => item._id === id)
              .questions.map((q) => q.selectedType)
              .filter((type) => !["NAT", "MSQ", "MCQ"].includes(type))
          )
        ].map((val, index) => {
          return (
            <button
              key={index}
              onClick={() => setActiveSection(val)}
              className={
                activeSection === val ? "activesection btn-sec" : "btn-sec"
              }
              style={{ borderRight: "1px solid rgb(199, 199, 199)" }}>
              <span>{val === "D-APTITUDE" ? "DESIGN APTITUDE" : val}</span>
            </button>
          );
        })}
      </div>
      <div
        className="px-2 flex items-center justify-between"
        style={{
          fontWeight: "500",
          borderBottom: "1px solid rgb(199, 199, 199)"
        }}>
        <div className="text-sm">Question Type: {renderType()}</div>
        <div className="flex items-center py-2">
          <span
            style={{
              borderRight: "1px solid rgb(199, 199, 199)"
            }}
            className="text-xs px-1">
            Marks for correct answer:{" "}
            <span className="text-green-600">
              {
                tests
                  ?.filter((item) => item._id === id)[0]
                  .questions.filter(
                    (type) => type.selectedType === activeSection
                  )[0]?.marks
              }
            </span>{" "}
          </span>
          <span className="ml-1 text-xs">
            Negative Marks:{" "}
            <span className="text-red-600">
              {
                tests
                  ?.filter((item) => item._id === id)[0]
                  .questions.filter(
                    (type) => type.selectedType === activeSection
                  )[0]?.negativemarks
              }
            </span>
          </span>
        </div>
      </div>
      <div>
        <TYPE setActiveSection={setActiveSection} />
      </div>
    </>
  );
}
