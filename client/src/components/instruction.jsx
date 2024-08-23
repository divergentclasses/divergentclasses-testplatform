import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import IMGINS from "../images/Screenshot 2024-07-10 150836.png";
import { useAuth } from "../contexts/AuthContext";
import Modal from "react-modal";
Modal.setAppElement("#root");
import axios from "axios";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

const INSTRUCTION = ({ instructionfun }) => {
  const { userdata } = useAuth();
  return (
    <div style={{ width: "80%" }} className="left-instr">
      <div className="ts-instxt">Instructions</div>
      <div className="ovrflow-ins">
        <div style={{ fontWeight: "600" }} className="mt-4 text-center">
          Read the following instructions carefully!
        </div>
        <div className="px-14 py-4 text-sm mb-2">
          <ol style={{ listStyle: "revert" }} type="1">
            <li>Total duration of examination is 120 minutes.</li>
            <li>
              The clock will be set at the server. The countdown timer in the
              top right corner of screen will display the remaining time
              available for you to complete the examination. When the timer
              reaches zero, the examination will end by itself. You will not be
              required to end or submit your examination.
            </li>
            <li>
              The Question Palette displayed on the right side of screen will
              show the status of each question using one of the following
              symbols:
            </li>
            <img alt="img" src={IMGINS} />
            The Marked for Review status for a question simply indicates that
            you would like to look at that question again.
            <li>
              You can click on the {"<"} arrow which appears to the left of
              question palette to collapse the question palette thereby
              maximizing the question window. To view the question palette
              again, you can click on {"<"} which appears on the right side of
              question window.
            </li>
            <li>
              You can click on Scroll Down to navigate to the bottom and Scroll
              Upto navigate to the top of the question area, without scrolling.
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
                  Click on the question number in the Question Palette at the
                  right of your screen to go to that numbered question directly.
                  Note that using this option does NOT save your answer to the
                  current question.
                </li>
                <li>
                  Click on <span className="font-semibold">Save & Next</span> to
                  save your answer for the current question and then go to the
                  next question.
                </li>
                <li>
                  Click on{" "}
                  <span className="font-semibold">Mark for Review & Next</span>{" "}
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
            <li>Procedure for answering a multiple choice type question:</li>
            <ol className="pl-4" style={{ listStyle: "lower-alpha" }}>
              <li>
                To select your answer, click on the button of one of the options
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
                To save your answer, you MUST click on the Save & Next button
              </li>
              <li>
                To mark the question for review, click on the Mark for Review &
                Next button.
              </li>
            </ol>
            <li>
              To change your answer to a question that has already been
              answered, first select that question for answering and then follow
              the procedure for answering that type of question.
            </li>
            <h1
              className="my-1"
              style={{ textDecoration: "underline", fontWeight: "700" }}>
              {" "}
              Navigating through sections:
            </h1>
            <li>
              Sections in this question paper are displayed on the top bar of
              the screen. Questions in a section can be viewed by clicking on
              the section name. The section you are currently viewing is
              highlighted.
            </li>
            <li>
              After clicking the Save & Next button on the last question for a
              section, you will automatically be taken to the first question of
              the next section.
            </li>
            <li>
              You can shuffle between sections and questions anytime during the
              examination as per your convenience only during the time
              stipulated.
            </li>
            <li>
              Candidate can view the corresponding section summary as part of
              the legend that appears in every section above the question
              palette.
            </li>
          </ol>
        </div>
      </div>
      <div className="ts-insfxd">
        <button onClick={instructionfun} className="btn-tsnxt">
          Next <i className="fa-solid fa-angle-right"></i>
        </button>
      </div>
    </div>
  );
};

const OtherINSTRUCTION = ({ instructionfun }) => {
  const handle = useFullScreenHandle();
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

  const { tests, userdata } = useAuth();
  const { id } = useParams();
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const [examId, setExamId] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const handleStartExam = async () => {
    try {
      const studentID = localStorage.getItem("studentID");
      const testID = localStorage.getItem("testId");
      const duration = 1;
      const response = await axios.post("/start-exam", {
        testID,
        studentID,
        duration,
        email: userdata.email
      });

      setEndTime(response.data.endTime);
      setExamId(response.data.examId);
    } catch (error) {
      console.error("Error starting the exam:", error);
    }
  };

  return (
    <div style={{ width: "80%" }} className="left-instr">
      <div className="ts-instxt">Other Instructions</div>
      <div className="px-4 text-sm ovrflow-ins">
        <div style={{ fontWeight: "600" }} className="mt-4 text-center">
          Read the following instructions carefully!
        </div>
        <div style={{ fontWeight: "500" }} className="mt-4">
          Instructions specific to this online exam paper
        </div>
        <div>
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
        <hr className="my-4" />
        <div style={{ marginBottom: "40px" }} className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            checked={isChecked}
            onChange={handleCheckboxChange}
            id="flexCheckDefault"
          />
          <label
            className="form-check-label text-xs"
            htmlFor="flexCheckDefault">
            I have read and understood the instructions. All computer hardware
            allotted to me are in proper working condition. I declare that I am
            not in possession of / not wearing / not carrying any prohibited
            gadget like mobile phone, bluetooth devices etc. / any prohibited
            material with me into the Examination Hall. I agree that in case of
            not adhering to the instructions, I shall be liable to be debarred
            from this Test and/or to disciplinary action, which may include ban
            from future Tests / Examinations.
          </label>
        </div>
      </div>
      <div className="ts-insfxdprv">
        <div style={{ width: "65%" }} className="flex justify-between">
          <button onClick={instructionfun} className="btn-tsnxt">
            <i className="fa-solid fa-angle-left"></i> Previous
          </button>
          <a
            href={isChecked ? `/testpaper/${id}` : null}
            className={isChecked ? "enabled btn-bgn" : "disabled btn-bgn"}
            onClick={(e) => {
              if (!isChecked) {
                e.preventDefault();
                openModal();
                handle.enter();
              } else {
                handleStartExam();
              }
            }}>
            I am ready to begin
          </a>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}>
        <div className="justify-between flex yth">
          <div>Info</div>
          <button
            style={{ color: "black" }}
            className="text-xl"
            onClick={closeModal}>
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
        <div className="my-2 text-sm">
          <i className="fa-solid fa-circle-info mr-1"></i> Please accept terms
          and conditions before proceeding.
        </div>
        <div className="justify-center flex">
          <button onClick={closeModal} className="btnok">
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default function Instruction() {
  const { userdata } = useAuth();
  const [instruction, setInstruction] = useState(true);
  const instructionfun = () => {
    if (instruction) {
      setInstruction(false);
    } else {
      setInstruction(true);
    }
  };
  return (
    <div className="h-screen">
      <div
        style={{ borderBottom: "1px solid rgb(198, 198, 198)" }}
        className="px-6 py-4 font-bold">
        <Link to="/test-series">
          <i className="fa-solid fa-chevron-left mr-1"></i>Back
        </Link>
      </div>
      <div className="flex">
        {instruction ? (
          <INSTRUCTION instructionfun={instructionfun} />
        ) : (
          <OtherINSTRUCTION instructionfun={instructionfun} />
        )}
        <div
          style={{ width: "20%" }}
          className="right-instr text-center pt-2 text-sm">
          {userdata?.email}
        </div>
      </div>
    </div>
  );
}
