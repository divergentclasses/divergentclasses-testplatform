import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
Modal.setAppElement("#root");

const Timer = ({}) => {
  const navigate = useNavigate();
  const { SubmitPartA, part } = useAuth();
  const [remainingTime, setRemainingTime] = useState(0);
  const PaperID = localStorage.getItem("testId");
  const StudentID = localStorage.getItem("studentID");

  useEffect(() => {
    const fetchRemainingTime = async () => {
      const response = await axios.get(`/remaining-time`, {
        params: {
          PaperID: PaperID,
          studentID: StudentID
        }
      });
      setRemainingTime(response.data.remainingTime);
    };

    fetchRemainingTime();

    const intervalId = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0) {
          clearInterval(intervalId);
          setTimeout(() => {
            handleSubmit();
          }, 0);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [PaperID]);

  const [remainingTimeB, setRemainingTimeB] = useState(0);

  const RemainingTimefun = () => {
    const fetchRemainingTime = async () => {
      const response = await axios.get(`/remaining-timeB`, {
        params: {
          PaperID: PaperID,
          studentID: StudentID
        }
      });
      setRemainingTimeB(response.data.remainingTime);
    };

    fetchRemainingTime();

    const intervalIdB = setInterval(() => {
      setRemainingTimeB((prev) => {
        if (prev <= 0) {
          clearInterval(intervalIdB);
          handleSubmitB();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(intervalIdB);
  };

  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
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
  const handleSubmitB = async () => {
    openModal();
    setTimeout(() => {
      navigate("/submitpage");
    }, 3000);
    await axios.post(`/submit-exam`, {
      PaperID,
      StudentID
    });
  };


  const handleSubmit = async () => {
    setTimeout(() => {
      SubmitPartA();
    }, 0);
    RemainingTimefun();
    await axios.post(`/submit-examA`, {
      PaperID,
      StudentID
    });
  };

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 1000 / 60);
    const seconds = Math.floor((milliseconds / 1000) % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      {part ? (
        <div className="ml-1">{formatTime(remainingTime)}</div>
      ) : (
        <div className="ml-1">{formatTime(remainingTimeB)}</div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}>
        <div className="justify-between flex yth">
          <div>Alert</div>
        </div>
        <div className="my-2 text-sm text-red-500 ">
          <i className="fa-solid fa-circle-info mr-1"></i> Time's up! Submitting
          your exam now...
        </div>
        <div className="justify-center flex">
          <button
            onClick={() => {
              navigate("/submitpage");
            }}
            className="btnok">
            OK
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Timer;
