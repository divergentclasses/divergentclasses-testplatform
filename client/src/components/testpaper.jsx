import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import IMGINS from "../images/Screenshot 2024-07-10 150836.png";
import { useAuth } from "../contexts/AuthContext";
import Timer from "./Timer";
import PARTB from "./PartB";
import { PARTBQUESTIONS } from "./PartB";
import { PARTBRIGHT } from "./PartB";
import FullscreenButton from "./FullscreenButton";
import { toggleFullscreen } from "../helpers/api-communication";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

Modal.setAppElement("#root");

const QuestionNAT = ({
  val,
  handleAnswerChangeMRN,
  handleAnswerChange,
  answers
}) => {
  const { dataclick, currentSliceIndex, setCurrentSliceIndex } = useAuth();
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    if (answers.filter((ans) => ans.q_id === val._id)) {
      var value = answers?.filter((ans) => ans.q_id === val._id)[0]?.ans;
    }
    setInputValue(
      value ? answers?.filter((ans) => ans.q_id === val._id)[0]?.ans : ""
    );
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
          // console.log("Data sent:", data);
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
  }, [currentSliceIndex]);

  const handleButtonClick = (value) => {
    setInputValue((prev) => prev + value);
  };

  const handleClear = () => {
    setInputValue("");
  };

  const handleBackspace = () => {
    setInputValue((prev) => prev.slice(0, -1));
  };

  const handleChange = (e) => {};
  return (
    <div>
      {" "}
      <img
        className="px-2"
        style={{ width: "70%" }}
        alt="img"
        src={val?.question}
      />
      <div className="px-14">
        <input
          className="nat-inp my-2"
          type="text"
          value={inputValue}
          onChange={handleChange}
          disabled
        />
        <div className="keypad">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "-"].map(
            (number) => (
              <button key={number} onClick={() => handleButtonClick(number)}>
                {number}
              </button>
            )
          )}
          <button onClick={handleClear}>C</button>
          <button onClick={handleBackspace}>Backspace</button>
        </div>
      </div>
      <div className="ts-tstfxd flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => {
              handleAnswerChangeMRN(val?._id, inputValue, val);
            }}
            className="btn-tstnxt mr-3">
            Mark & Review Next
          </button>
          <button className="btn-tstnxt" onClick={handleClear}>
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
              handleAnswerChange(val?._id, inputValue, val);
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

const Section1 = ({ setActiveSection }) => {
  const { tests, activeSection, currentSliceIndex, setCurrentSliceIndex } =
    useAuth();
  const { id } = useParams();
  const [answers, setAnswers] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(import.meta.env.VITE_SOCKET_URL);

    ws.current.onopen = () => {
      // console.log("WebSocket Client Connected");
    };
    ws.current.onmessage = (message) => {
      const receivedAnswers = JSON.parse(message.data);
      let data = receivedAnswers
        .find((val) => val.PaperID === localStorage.getItem("testId"))
        .Participants.Students.find(
          (val) => val.studentID === localStorage.getItem("studentID")
        )?.answers;
      setAnswers(data);
    };

    return () => {
      ws.current.close();
    };
  }, [currentSliceIndex]);

  const questionsPerPage = 1;
  const handleNextSlice = (val) => {
    if (
      currentSliceIndex <
      tests
        ?.filter((item) => item._id === localStorage.getItem("testId"))[0]
        .questions.filter((type) => type.selectedType === val.selectedType)
        .length -
        questionsPerPage
    ) {
      setCurrentSliceIndex(Number(currentSliceIndex) + questionsPerPage);
    } else {
      const data = ["NAT", "MSQ", "MCQ"].filter((type) =>
        [
          ...new Set(
            tests
              ?.filter((item) => item._id === localStorage.getItem("testId"))[0]
              .questions.map((q) => q.selectedType)
              .filter((type) => ["NAT", "MSQ", "MCQ"].includes(type))
          )
        ].includes(type)
      );
      if (data.length > 1 && data.indexOf(activeSection) + 1 < data.length) {
        setActiveSection(data[data.indexOf(activeSection) + 1]);
      } else {
        setActiveSection(data[0]);
      }
    }
  };
  const handleAnswerChange = (questionId, answer, val) => {
    const newAnswer = {
      q_id: questionId,
      ans: answer,
      studentID: localStorage.getItem("studentID"),
      PaperID: localStorage.getItem("testId"),
      status: answer.trim() !== "" ? "green" : "red"
    };

    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.filter(
        (ans) => ans.q_id !== questionId
      );
      return [...updatedAnswers, newAnswer];
    });

    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(newAnswer));
    }

    handleNextSlice(val);
  };
  const handleAnswerChangeMRN = (questionId, answer, val) => {
    const newAnswer = {
      q_id: questionId,
      ans: answer,
      studentID: localStorage.getItem("studentID"),
      PaperID: localStorage.getItem("testId"),
      status: answer.trim() !== "" ? "purpleT" : "purple"
    };

    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.filter(
        (ans) => ans.q_id !== questionId
      );
      return [...updatedAnswers, newAnswer];
    });

    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(newAnswer));
    }

    handleNextSlice(val);
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
          Question No. {Number(currentSliceIndex) + questionsPerPage}
        </div>
      </div>
      <div style={{ height: "55vh", overflowY: "auto" }} className="pb-4">
        {tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "NAT")
          .slice(currentSliceIndex, currentSliceIndex + questionsPerPage)
          .map((val, index) => {
            return (
              <QuestionNAT
                key={index}
                val={val}
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

const QuestionMSQ = ({
  val,
  handleAnswerChangeMRN,
  handleAnswerChange,
  answers
}) => {
  const { dataclick, currentSliceIndex, setCurrentSliceIndex } = useAuth();

  const [checkboxes, setCheckboxes] = useState({
    A: false,
    B: false,
    C: false,
    D: false
  });
  useEffect(() => {
    var value = answers.filter((ans) => ans.q_id === val._id)[0]?.ans;
    setCheckboxes(
      value
        ? answers.filter((ans) => ans.q_id === val._id)[0]?.ans
        : {
            A: false,
            B: false,
            C: false,
            D: false
          }
    );
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
            ans: {
              A: false,
              B: false,
              C: false,
              D: false
            },
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
  }, [currentSliceIndex]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes({
      ...checkboxes,
      [name]: checked
    });
  };
  const handleClearAll = () => {
    setCheckboxes({
      A: false,
      B: false,
      C: false,
      D: false
    });
  };
  return (
    <div>
      <img
        className="px-2"
        style={{ width: "70%" }}
        alt="img"
        src={val?.question}
      />
      <div style={{ fontSize: "20px" }} className="px-4 mt-3">
        <div className="mb-1">
          <label className="mr-1">
            <input
              style={{ height: "15px", width: "15px" }}
              className="cursor-pointer"
              type="checkbox"
              name="A"
              checked={checkboxes.A}
              onChange={handleCheckboxChange}
            />
          </label>
          <span>A</span>
        </div>
        <div className="mb-1">
          <label className="mr-1">
            <input
              style={{ height: "15px", width: "15px" }}
              className="cursor-pointer"
              type="checkbox"
              name="B"
              checked={checkboxes.B}
              onChange={handleCheckboxChange}
            />
          </label>
          <span>B</span>
        </div>
        <div className="mb-1">
          <label className="mr-1">
            <input
              style={{ height: "15px", width: "15px" }}
              className="cursor-pointer"
              type="checkbox"
              name="C"
              checked={checkboxes.C}
              onChange={handleCheckboxChange}
            />
          </label>
          <span>C</span>
        </div>
        <div className="mb-1">
          <label className="mr-1">
            <input
              style={{ height: "15px", width: "15px" }}
              className="cursor-pointer"
              type="checkbox"
              name="D"
              checked={checkboxes.D}
              onChange={handleCheckboxChange}
            />
          </label>
          <span>D</span>
        </div>
      </div>
      <div className="ts-tstfxd flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="btn-tstnxt mr-3"
            onClick={() => {
              handleAnswerChangeMRN(val?._id, checkboxes);
            }}>
            Mark & Review Next
          </button>
          <button
            className="btn-tstnxt"
            onClick={() => {
              handleClearAll();
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
              handleAnswerChange(val?._id, checkboxes);
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

const Section2 = ({ setActiveSection }) => {
  const { tests, currentSliceIndex, setCurrentSliceIndex, activeSection } =
    useAuth();
  const { id } = useParams();

  const questionsPerPage = 1;
  const [answers, setAnswers] = useState([]);
  const handleNextSlice = () => {
    if (
      currentSliceIndex <
      tests
        ?.filter((item) => item._id === localStorage.getItem("testId"))[0]
        .questions.filter((type) => type.selectedType === "MSQ").length -
        questionsPerPage
    ) {
      setCurrentSliceIndex(Number(currentSliceIndex) + questionsPerPage);
    } else {
      const data = ["NAT", "MSQ", "MCQ"].filter((type) =>
        [
          ...new Set(
            tests
              ?.filter((item) => item._id === localStorage.getItem("testId"))[0]
              .questions.map((q) => q.selectedType)
              .filter((type) => ["NAT", "MSQ", "MCQ"].includes(type))
          )
        ].includes(type)
      );
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

  const handleAnswerChange = (questionId, answer) => {
    const newAnswer = {
      q_id: questionId,
      ans: answer,
      studentID: localStorage.getItem("studentID"),
      PaperID: localStorage.getItem("testId"),
      status: Object.values(answer).some((value) => value === true)
        ? "green"
        : "red"
    };

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
  const handleAnswerChangeMRN = (questionId, answer) => {
    const newAnswer = {
      q_id: questionId,
      ans: answer,
      studentID: localStorage.getItem("studentID"),
      PaperID: localStorage.getItem("testId"),
      status: Object.values(answer).some((value) => value === true)
        ? "purpleT"
        : "purple"
    };

    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.filter(
        (ans) => ans.q_id !== questionId
      );
      return [...updatedAnswers, newAnswer];
    });

    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(newAnswer));
    }

    handleNextSlice();
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
      <div style={{ height: "55vh", overflowY: "auto" }} className="pb-2">
        {tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "MSQ")
          .slice(currentSliceIndex, currentSliceIndex + questionsPerPage)
          .map((val, index) => {
            return (
              <QuestionMSQ
                handleAnswerChange={handleAnswerChange}
                handleAnswerChangeMRN={handleAnswerChangeMRN}
                val={val}
                key={index}
                answers={answers}
              />
            );
          })}
      </div>
    </>
  );
};

const QuestionMCQ = ({
  val,
  handleAnswerChangeMRN,
  handleAnswerChange,
  answers
}) => {
  const { dataclick, currentSliceIndex, setCurrentSliceIndex } = useAuth();
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const ClearResponse = () => {
    setSelectedOption("");
  };

  useEffect(() => {
    var value = answers.filter((ans) => ans.q_id === val._id)[0]?.ans;
    setSelectedOption(
      value ? answers.filter((ans) => ans.q_id === val._id)[0]?.ans : ""
    );
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
  }, [currentSliceIndex]);
  return (
    <div>
      {" "}
      <img
        className="px-2"
        style={{ width: "70%" }}
        alt="img"
        src={val?.question}
      />
      <div style={{ fontSize: "20px" }} className="px-4 pb-2">
        <div>
          <label>
            <input
              style={{ height: "15px", width: "15px" }}
              name="option"
              type="radio"
              value="A"
              checked={selectedOption === "A"}
              onChange={handleOptionChange}
            />{" "}
            A
          </label>
        </div>
        <div>
          <label>
            <input
              style={{ height: "15px", width: "15px" }}
              name="option"
              type="radio"
              value="B"
              checked={selectedOption === "B"}
              onChange={handleOptionChange}
            />{" "}
            B
          </label>
        </div>
        <div>
          <label>
            <input
              style={{ height: "15px", width: "15px" }}
              name="option"
              type="radio"
              value="C"
              checked={selectedOption === "C"}
              onChange={handleOptionChange}
            />{" "}
            C
          </label>
        </div>
        <div>
          <label>
            <input
              style={{ height: "15px", width: "15px" }}
              name="option"
              type="radio"
              value="D"
              checked={selectedOption === "D"}
              onChange={handleOptionChange}
            />{" "}
            D
          </label>
        </div>
      </div>
      <div className="ts-tstfxd flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="btn-tstnxt mr-3"
            onClick={() => {
              handleAnswerChangeMRN(val?._id, selectedOption);
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
              handleAnswerChange(val?._id, selectedOption);
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

const Section3 = ({ setActiveSection }) => {
  const { tests, currentSliceIndex, setCurrentSliceIndex, activeSection } =
    useAuth();
  const { id } = useParams();

  const questionsPerPage = 1;
  const [answers, setAnswers] = useState([]);
  const handleNextSlice = () => {
    if (
      currentSliceIndex <
      tests
        ?.filter((item) => item._id === localStorage.getItem("testId"))[0]
        .questions.filter((type) => type.selectedType === "MCQ").length -
        questionsPerPage
    ) {
      setCurrentSliceIndex(Number(currentSliceIndex) + questionsPerPage);
    } else {
      const data = ["NAT", "MSQ", "MCQ"].filter((type) =>
        [
          ...new Set(
            tests
              ?.filter((item) => item._id === localStorage.getItem("testId"))[0]
              .questions.map((q) => q.selectedType)
              .filter((type) => ["NAT", "MSQ", "MCQ"].includes(type))
          )
        ].includes(type)
      );
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

  const handleAnswerChange = (questionId, answer) => {
    const newAnswer = {
      q_id: questionId,
      ans: answer,
      studentID: localStorage.getItem("studentID"),
      PaperID: localStorage.getItem("testId"),
      status: answer ? "green" : "red"
    };

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
  const handleAnswerChangeMRN = (questionId, answer) => {
    const newAnswer = {
      q_id: questionId,
      ans: answer,
      studentID: localStorage.getItem("studentID"),
      PaperID: localStorage.getItem("testId"),
      status: answer ? "purpleT" : "purple"
    };

    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.filter(
        (ans) => ans.q_id !== questionId
      );
      return [...updatedAnswers, newAnswer];
    });

    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(newAnswer));
    }

    handleNextSlice();
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
          .questions.filter((type) => type.selectedType === "MCQ")
          .slice(currentSliceIndex, currentSliceIndex + questionsPerPage)
          .map((val, index) => {
            return (
              <QuestionMCQ
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

const ButoonSelect = ({ val, index }) => {
  const { clickData, onUpdateQuestion, currentSliceIndex } = useAuth();
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

      setactiveStatus(
        receivedAnswers
          .find((val) => val.PaperID === localStorage.getItem("testId"))
          .Participants.Students.find(
            (val) => val.studentID === localStorage.getItem("studentID")
          )
          .answers.filter((k) => k.q_id === val._id)[0]?.status
      );
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
        {index + 1}
      </button>
    </>
  );
};

const PARTA = () => {
  const { tests, userdata, activeSection, setActiveSection, userlogin } =
    useAuth();
  const { id } = useParams();
  const renderSection = () => {
    switch (activeSection) {
      case "NAT":
        return <Section1 setActiveSection={setActiveSection} />;
      case "MSQ":
        return <Section2 setActiveSection={setActiveSection} />;
      case "MCQ":
        return <Section3 setActiveSection={setActiveSection} />;
      default:
        return <Section1 setActiveSection={setActiveSection} />;
    }
  };
  const renderType = () => {
    switch (activeSection) {
      case "NAT":
        return "Numerical Answer Type";
      case "MSQ":
        return "Multiple Selective Question";
      case "MCQ":
        return "Multiple Choice Question";
      default:
        return "Numerical Answer Type";
    }
  };
  const renderMarks = () => {
    switch (activeSection) {
      case "NAT":
        return tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "NAT")[0]?.marks;
      case "MSQ":
        return tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "MSQ")[0]?.marks;
      case "MCQ":
        return tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "MCQ")[0]?.marks;
      default:
        return tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "NAT")[0]?.marks;
    }
  };
  const renderNegativeMarks = () => {
    switch (activeSection) {
      case "NAT":
        return tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "NAT")[0]
          ?.negativemarks;
      case "MSQ":
        return tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "MSQ")[0]
          ?.negativemarks;
      case "MCQ":
        return tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "MCQ")[0]
          ?.negativemarks;
      default:
        return tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "NAT")[0]
          ?.negativemarks;
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
        {["NAT", "MSQ", "MCQ"]
          .filter((type) =>
            [
              ...new Set(
                tests
                  ?.filter((item) => item._id === id)[0]
                  .questions.map((q) => q.selectedType)
                  .filter((type) => ["NAT", "MSQ", "MCQ"].includes(type))
              )
            ].includes(type)
          )
          .map((val, index) => {
            return (
              <button
                key={index}
                onClick={() => setActiveSection(val)}
                className={
                  activeSection === val ? "activesection btn-sec" : "btn-sec"
                }
                style={{ borderRight: "1px solid rgb(199, 199, 199)" }}>
                <span>
                  Section {index + 1} - {val}
                </span>
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
            <span className="text-green-600">{renderMarks()}</span>{" "}
          </span>
          <span className="ml-1 text-xs">
            Negative Marks:{" "}
            <span className="text-red-600">{renderNegativeMarks()}</span>
          </span>
        </div>
      </div>
      <div>{renderSection()}</div>
    </>
  );
};
const PARTARIGHT = () => {
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
        Section{" "}
        {["NAT", "MSQ", "MCQ"]
          .filter((type) =>
            [
              ...new Set(
                tests
                  ?.filter(
                    (item) => item._id === localStorage.getItem("testId")
                  )[0]
                  .questions.map((q) => q.selectedType)
                  .filter((type) => ["NAT", "MSQ", "MCQ"].includes(type))
              )
            ].includes(type)
          )
          .indexOf(activeSection) + 1}{" "}
        - {activeSection}
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
};
const PARTAQUESTIONS = () => {
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
            {["NAT", "MSQ", "MCQ"]
              .filter((type) =>
                [
                  ...new Set(
                    tests
                      ?.filter((item) => item._id === id)[0]
                      .questions.map((q) => q.selectedType)
                      .filter((type) => ["NAT", "MSQ", "MCQ"].includes(type))
                  )
                ].includes(type)
              )
              .map((k, index) => {
                return (
                  <div key={index}>
                    <div className="text-xl font-semibold">
                      Section {index + 1} - {k}
                    </div>
                    {tests
                      ?.filter((item) => item._id === id)[0]
                      .questions.filter((type) => type.selectedType === k)
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
                                  {val?.selectedType}
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
};
const SubmitBTNExam = () => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "40%"
    }
  };

  const { SubmitTest } = useAuth();
  const { id } = useParams();

  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  return (
    <>
      <button
        className="btn-submit"
        onClick={() => {
          openModal();
        }}>
        Submit
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}>
        <div className="justify-between flex yth">
          <div>Submit Test</div>
          <button
            style={{ color: "black" }}
            className="text-xl"
            onClick={closeModal}>
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
        <div className="text-xs flex justify-between">
          <div className="flex items-center">
            <div
              style={{ height: "30px", width: "30px" }}
              className="nos5 clip2 m-1 flex items-center justify-center">
              5
            </div>
            <span>Answered</span>
          </div>
          <div className="flex items-center mr-6">
            <div
              style={{ height: "30px", width: "30px" }}
              className="nos2 clip m-1 flex items-center justify-center">
              1
            </div>
            <span>Not Answered</span>
          </div>
        </div>
        <div className="text-xs flex justify-between">
          <div className="flex items-center">
            <div
              style={{ height: "30px", width: "30px" }}
              className="nos  m-1 flex items-center justify-center">
              3
            </div>
            <span>Not Visited</span>
          </div>
          <div className="flex items-center">
            <div
              style={{ height: "30px", width: "30px" }}
              className="nos4 m-1 flex items-center justify-center">
              4
            </div>
            <span>Marked for Review</span>
          </div>
        </div>
        <div className="text-xs flex justify-between">
          <div className="flex items-center">
            <div
              style={{ height: "30px", width: "30px" }}
              className="nos3  m-1 flex items-center justify-center">
              7
            </div>
            <span>Answered and Marked for Review</span>
          </div>
        </div>
        <div className="text-center my-2 text-sm">
          <div>Are you sure you want to submit the test?</div>
          <div className="text-red-500">
            No changes will be allowed after submission in <b>both part.</b>
          </div>
        </div>
        <div className="flex justify-center">
          <button onClick={closeModal} className="btn-yn mr-2">
            No
          </button>
          <button
            className="btn-yn"
            onClick={() => {
              SubmitTest();
            }}>
            Yes
          </button>
        </div>
      </Modal>
    </>
  );
};
export default function TestPaper() {
  const handle = useFullScreenHandle();
  const navigate = useNavigate();
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
  const {
    tests,
    userdata,
    activeSection,
    setActiveSection,
    userlogin,
    part,
    submitStatus
  } = useAuth();
  useEffect(() => {
    if (submitStatus?.SubmitPaper) {
      navigate("/submitpage");
    }
  }, [submitStatus]);
  const { id } = useParams();

  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    const preventDefault = (e) => {
      e.preventDefault();
    };

    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.addEventListener("copy", preventDefault);
      img.addEventListener("dragstart", preventDefault);
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("copy", preventDefault);
        img.removeEventListener("dragstart", preventDefault);
      });
    };
  }, []);

  const [toggle, settoggle] = useState(false);

  useEffect(() => {
    settoggle(true);
    if (toggle) {
      toggleFullscreen();
    }
    // const handleBeforeUnload = (e) => {
    //   e.preventDefault();
    //   openModal();
    //   e.returnValue = "";
    // };

    // window.addEventListener("beforeunload", handleBeforeUnload);
    // return () => {
    //   window.removeEventListener("beforeunload", handleBeforeUnload);
    // };
  }, []);

  return (
    <FullScreen handle={handle}>
      {/* <button onClick={handle.enter}>Enter fullscreen</button> */}

      <div id="fullscreen-container" className="h-screen">
        <div
          style={{
            borderBottom: "1px solid rgb(198, 198, 198)",
            backgroundColor: "#209bd1",
            color: "white",
            fontWeight: "600"
          }}
          className="px-6 py-2 flex items-center justify-between">
          <div>{tests?.filter((item) => item._id === id)[0].paper_name}</div>
          <div className="flex items-center">
            {part ? <PARTAQUESTIONS /> : <PARTBQUESTIONS />}
            <div className="flex items-center">
              <button className="view-ins" onClick={openModal}>
                {" "}
                <i className="fa-solid fa-circle mr-1 text-blue-700"></i>
                View Instructions
              </button>
            </div>
          </div>
        </div>
        <div className="flex">
          <div style={{ width: "80%" }} className="left-ins">
            <div
              style={{
                fontWeight: "500",
                borderBottom: "1px solid rgb(199, 199, 199)"
              }}
              className="flex py-1 px-4 text-sm items-center">
              <button
                style={{ borderRadius: "4px" }}
                className={part ? "tm-left mr-2 activepart" : "tm-left mr-2"}>
                PART A
              </button>
              <button
                style={{ borderRadius: "4px" }}
                className={part ? "tm-left" : "tm-left activepart"}>
                PART B
              </button>
            </div>
            <div
              style={{
                fontWeight: "500",
                borderBottom: "1px solid rgb(199, 199, 199)"
              }}
              className="flex py-1 px-4 justify-between text-sm items-center">
              <span className="tm-left">Sections</span>
              <span className="tm-left flex items-center">
                Time Left:
                <Timer />
              </span>
            </div>
            {part ? <PARTA /> : <PARTB />}
          </div>
          <div style={{ width: "20%" }} className="right-ins position-relative">
            <div
              className="flex items-center justify-center text-sm"
              style={{
                borderBottom: "1px solid rgb(198, 198, 198)",
                height: "81px"
              }}>
              {userdata?.email}
            </div>
            <div
              className="p-2"
              style={{
                borderBottom: "1px solid rgb(198, 198, 198)",
                height: "140px"
              }}>
              <div className="text-xs flex justify-between">
                <div className="flex items-center">
                  <div
                    style={{ height: "30px", width: "30px" }}
                    className="nos5 clip2 m-1 flex items-center justify-center">
                    5
                  </div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center">
                  <div
                    style={{ height: "30px", width: "30px" }}
                    className="nos2 clip m-1 flex items-center justify-center">
                    1
                  </div>
                  <span>Not Answered</span>
                </div>
              </div>
              <div className="text-xs flex justify-between">
                <div className="flex items-center">
                  <div
                    style={{ height: "30px", width: "30px" }}
                    className="nos  m-1 flex items-center justify-center">
                    3
                  </div>
                  <span>Not Visited</span>
                </div>
                <div className="flex items-center">
                  <div
                    style={{ height: "30px", width: "30px" }}
                    className="nos4 m-1 flex items-center justify-center">
                    4
                  </div>
                  <span>Marked for Review</span>
                </div>
              </div>
              <div className="text-xs flex justify-between">
                <div className="flex items-center">
                  <div
                    style={{ height: "30px", width: "30px" }}
                    className="nos3  m-1 flex items-center justify-center">
                    7
                  </div>
                  <span>Answered and Marked for Review</span>
                </div>
              </div>
            </div>
            {part ? <PARTARIGHT /> : <PARTBRIGHT />}
            <div className="position-absolute sbm-btn bottom-0">
              <SubmitBTNExam />
            </div>
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          shouldCloseOnOverlayClick={false}>
          <div className="justify-between flex yth">
            <div>Instructions</div>
            <button
              style={{ color: "black" }}
              className="text-xl"
              onClick={closeModal}>
              <i className="fa-regular fa-circle-xmark"></i>
            </button>
          </div>
          <div className="text-red-600 my-1 text-center">
            Note that timer is ticking while you read the instructions. Close
            this page to return to answering the questions.
          </div>
          <div className="ovrflow-ins">
            <div style={{ fontWeight: "600" }} className="mt-4 text-center">
              Read the following instructions carefully!
            </div>
            <div className="px-14 py-4 text-sm mb-2">
              <ol style={{ listStyle: "revert" }} type="1">
                <li>Total duration of examination is 120 minutes.</li>
                <li>
                  The clock will be set at the server. The countdown timer in
                  the top right corner of screen will display the remaining time
                  available for you to complete the examination. When the timer
                  reaches zero, the examination will end by itself. You will not
                  be required to end or submit your examination.
                </li>
                <li>
                  The Question Palette displayed on the right side of screen
                  will show the status of each question using one of the
                  following symbols:
                </li>
                <img alt="img" src={IMGINS} />
                The Marked for Review status for a question simply indicates
                that you would like to look at that question again.
                <li>
                  You can click on the {"<"} arrow which appears to the left of
                  question palette to collapse the question palette thereby
                  maximizing the question window. To view the question palette
                  again, you can click on {"<"} which appears on the right side
                  of question window.
                </li>
                <li>
                  You can click on Scroll Down to navigate to the bottom and
                  Scroll Upto navigate to the top of the question area, without
                  scrolling.
                </li>
                <h1
                  className="my-1"
                  style={{ textDecoration: "underline", fontWeight: "700" }}>
                  {" "}
                  Navigating to a Question:
                </h1>
                <li>
                  To answer a question, do the following:
                  <ol className="pl-4" style={{ listStyle: "lower-alpha" }}>
                    <li>
                      Click on the question number in the Question Palette at
                      the right of your screen to go to that numbered question
                      directly. Note that using this option does NOT save your
                      answer to the current question.
                    </li>
                    <li>
                      Click on{" "}
                      <span className="font-semibold">Save & Next</span> to save
                      your answer for the current question and then go to the
                      next question.
                    </li>
                    <li>
                      Click on{" "}
                      <span className="font-semibold">
                        Mark for Review & Next
                      </span>{" "}
                      to save your answer for the current question, mark it for
                      review, and then go to the next question.
                    </li>
                  </ol>
                </li>
                <h1
                  className="my-1"
                  style={{ textDecoration: "underline", fontWeight: "700" }}>
                  {" "}
                  Answering a Question :
                </h1>
                <li>
                  Procedure for answering a multiple choice type question:
                </li>
                <ol className="pl-4" style={{ listStyle: "lower-alpha" }}>
                  <li>
                    To select your answer, click on the button of one of the
                    options
                  </li>
                  <li>
                    To deselect your chosen answer, click on the button of the
                    chosen option again or click on the Clear Response button
                  </li>
                  <li>
                    To change your chosen answer, click on the button of another
                    option
                  </li>
                  <li>
                    To save your answer, you MUST click on the Save & Next
                    button
                  </li>
                  <li>
                    To mark the question for review, click on the Mark for
                    Review & Next button.
                  </li>
                </ol>
                <li>
                  To change your answer to a question that has already been
                  answered, first select that question for answering and then
                  follow the procedure for answering that type of question.
                </li>
                <h1
                  className="my-1"
                  style={{ textDecoration: "underline", fontWeight: "700" }}>
                  {" "}
                  Navigating through sections:
                </h1>
                <li>
                  Sections in this question paper are displayed on the top bar
                  of the screen. Questions in a section can be viewed by
                  clicking on the section name. The section you are currently
                  viewing is highlighted.
                </li>
                <li>
                  After clicking the Save & Next button on the last question for
                  a section, you will automatically be taken to the first
                  question of the next section.
                </li>
                <li>
                  You can shuffle between sections and questions anytime during
                  the examination as per your convenience only during the time
                  stipulated.
                </li>
                <li>
                  Candidate can view the corresponding section summary as part
                  of the legend that appears in every section above the question
                  palette.
                </li>
              </ol>
            </div>
            <div style={{ fontWeight: "600" }} className="mt-4 text-center">
              Other Important Instructions
            </div>
            <div style={{ fontWeight: "500" }} className="mt-4">
              Instructions specific to this online exam paper
            </div>
            <div className="text-sm">
              {tests
                ?.filter((item) => item._id === id)
                .map((val, index) => {
                  return (
                    <div
                      key={index}
                      dangerouslySetInnerHTML={{
                        __html: val.marking_scheme_instructions
                      }}></div>
                  );
                })}
            </div>
          </div>
        </Modal>
      </div>
    </FullScreen>
  );
}
