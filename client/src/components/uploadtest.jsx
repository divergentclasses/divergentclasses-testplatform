import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useFormik } from "formik";
import * as Yup from "yup";
Modal.setAppElement("#root");
import { useAuth } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SpinnerLoaderW from "./spinnerloaderW";

const notify = () => toast.success("Test is live now!");
const TESTDETAILS = ({ item }) => {
  const { UpdateTestDetail, deleteTest, Conducttest } = useAuth();

  const deleteTestDetail = (id) => {
    let userConfirmed = confirm("Do you want to delete this test?");
    if (userConfirmed) {
      deleteTest(id);
    }
  };

  const ConductTest = (id) => {
    let userConfirmed = confirm("Do you want to conduct this test?");
    if (userConfirmed) {
      Conducttest(id);
      notify();
    }
  };

  const initialValuestd = {
    papername: `${item.paper_name}`,
    course: `${item.course}`,
    totalmarks: `${item.totalmarks}`,
    examduration: `${item.exam_duration}`,
    noofquestions: `${item.no_of_questions}`,
    noofsections: `${item.no_of_sections}`
  };
  const [modalIsOpenU, setIsOpenU] = useState(false);
  function openModalU() {
    setIsOpenU(true);
  }
  function closeModalU() {
    setIsOpenU(false);
  }
  const [inputType, setInputType] = useState("text");
  const handleFocus = () => {
    setInputType("time");
  };

  const handleBlur = () => {
    setInputType("text");
  };
  const testSchema = Yup.object({
    papername: Yup.string().required("Please enter paper name"),
    course: Yup.string().required("Please enter course name"),
    totalmarks: Yup.string().min(1).max(3).required("Please enter total marks"),
    examduration: Yup.string().required("Please enter exam duration"),
    noofquestions: Yup.string()
      .min(1)
      .max(3)
      .required("Please enter no of questions"),
    noofsections: Yup.string()
      .min(1)
      .max(1)
      .required("Please enter no of sections")
  });

  const { values, touched, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValuestd,
    validationSchema: testSchema,
    onSubmit: (values) => {
      values.id = item._id;
      UpdateTestDetail(values);
      closeModalU();
    }
  });

  return (
    <>
      <tr key={item._id}>
        <td>{item.paper_name}</td>
        <td>{item.course}</td>
        <td>{item?.totalmarks}</td>
        <td>{item.exam_duration}</td>
        <td>{item.no_of_questions}</td>
        <td>{item.no_of_sections}</td>
        <td>
          <button
            onClick={() => {
              openModalU();
            }}>
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </td>
        <td>
          <button
            onClick={() => {
              deleteTestDetail(item._id);
            }}>
            <i className="fa-solid fa-trash text-red-600"></i>
          </button>
        </td>
        <td>
          <Link to={`/uploadquestions/${item._id}`}>
            <i className="fa-solid fa-file-circle-plus text-green-600"></i>
          </Link>
        </td>
        <td>
          <button
            className="btn-cdt"
            onClick={() => {
              ConductTest(item._id);
            }}>
            Conduct
          </button>
        </td>
      </tr>
      <Modal
        isOpen={modalIsOpenU}
        onRequestClose={closeModalU}
        style={customStyles}
        shouldCloseOnOverlayClick={false}>
        <div className="justify-between flex yth">
          <div>Update paper type</div>
          <button
            style={{ color: "black" }}
            className="text-xl"
            onClick={closeModalU}>
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
        <form style={{ padding: "20px 0px" }} onSubmit={handleSubmit}>
          <label className="text-sm flex items-center" htmlFor="papername">
            <i className="fa-solid fa-file-circle-question mr-1"></i> Paper name
          </label>
          <input
            className={
              errors.papername && touched.papername
                ? "bg-ffeeee border-red-500 inpt-pt npt"
                : "bg-white inpt-pt npt"
            }
            id="papername"
            type="text"
            name="papername"
            placeholder="Paper name"
            value={values.papername}
            onChange={handleChange}
          />
          <label className="text-sm flex items-center" htmlFor="course">
            <i className="fa-solid fa-book-open-reader mr-1"></i> Course
          </label>
          <input
            className={
              errors.course && touched.course
                ? "bg-ffeeee border-red-500 inpt-pt npt"
                : "bg-white inpt-pt npt"
            }
            id="course"
            type="text"
            name="course"
            placeholder="Course"
            value={values.course}
            onChange={handleChange}
          />
          <label className="text-sm flex items-center" htmlFor="course">
            <i className="fa-solid fa-square-check mr-1"></i>Total Marks
          </label>
          <input
            className={
              errors.totalmarks && touched.totalmarks
                ? "bg-ffeeee border-red-500 inpt-pt npt"
                : "bg-white inpt-pt npt"
            }
            id="totalmarks"
            type="text"
            name="totalmarks"
            placeholder="Total marks"
            value={values.totalmarks}
            onChange={handleChange}
          />
          <label className="text-sm flex items-center" htmlFor="noofquestions">
            <i className="fa-solid fa-clipboard-question mr-1"></i> No of
            questions
          </label>
          <input
            className={
              errors.noofquestions && touched.noofquestions
                ? "bg-ffeeee border-red-500 inpt-pt npt"
                : "bg-white inpt-pt npt"
            }
            id="noofquestions"
            type="number"
            name="noofquestions"
            placeholder="No of questions"
            value={values.noofquestions}
            onChange={handleChange}
          />
          <label className="text-sm flex items-center" htmlFor="noofsections">
            <i className="fa-solid fa-list-ol mr-1"></i> No of sections
          </label>
          <input
            className={
              errors.noofsections && touched.noofsections
                ? "bg-ffeeee border-red-500 inpt-pt npt"
                : "bg-white inpt-pt npt"
            }
            id="noofsections"
            type="number"
            name="noofsections"
            placeholder="No of sections"
            value={values.noofsections}
            onChange={handleChange}
          />
          <label className="text-sm flex items-center" htmlFor="examduration">
            <i className="fa-regular fa-clock mr-1"></i>Exam duration
          </label>
          <input
            className={
              errors.examduration && touched.examduration
                ? "bg-ffeeee border-red-500 inpt-pt npt"
                : "bg-white inpt-pt npt"
            }
            id="examduration"
            name="examduration"
            placeholder="Exam duration"
            type={inputType}
            onFocus={handleFocus}
            onBlur={handleBlur}
            step="1"
            value={values.examduration}
            onChange={handleChange}
          />
          <div className="text-right">
            <button
              type="submit"
              style={{ width: "170px" }}
              className="btn-sub"
              onClick={openModalU}>
              Update
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

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
const initialValues = {
  papername: "",
  course: "",
  totalmarks: "",
  examduration: "",
  noofquestions: "",
  noofsections: ""
};

export default function UploadTest() {
  const {
    testdetails,
    tests,
    UpdateTestDetail,
    isLoggedIn,
    admin,
    Adminlogout
  } = useAuth();
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const [inputType, setInputType] = useState("text");
  const handleFocus = () => {
    setInputType("time");
  };

  const handleBlur = () => {
    setInputType("text");
  };
  const testSchema = Yup.object({
    papername: Yup.string().required("Please enter paper name"),
    course: Yup.string().required("Please enter course name"),
    totalmarks: Yup.string().min(1).max(3).required("Please enter total marks"),
    examduration: Yup.string().required("Please enter exam duration"),
    noofquestions: Yup.string()
      .min(1)
      .max(3)
      .required("Please enter no of questions"),
    noofsections: Yup.string()
      .min(1)
      .max(1)
      .required("Please enter no of sections")
  });

  const { values, touched, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: testSchema,
    onSubmit: (values) => {
      closeModal();
      testdetails(values);
    }
  });

  return (
    <>
      <div className="flex main">
        <div className="left">
          <Link to="/studentanalysis">
            <div className="p-6 mid-txt text-xl th">
              <i className="fa-solid fa-file-arrow-up mr-2"></i>Students
              Analysis
            </div>
          </Link>
       
        </div>
        <div className="right">
          <div className="flex justify-between items-center kh">
            <h2 className="p-3 text-2xl font-bold">Upload Tests</h2>
            <div className="flex items-center">
              <div className="admin-txt">Welcome {admin?.username}</div>
              <button onClick={Adminlogout} className="btn-lgt">
                <i className="fa-solid fa-arrow-right-from-bracket mr-1"></i>
                Logout
              </button>
            </div>
          </div>
          <div className="tstcd">
            <div className="uft flex justify-between items-center">
              <div className="uplq text-xl ml-1 font-bold">Papers</div>
              <button className="btn-addq" onClick={openModal}>
                <i className="fa-solid fa-plus mr-1"></i>
                Add test
              </button>
            </div>
            <div className="p-3 bg-white hjg">
              <table>
                <thead>
                  <tr>
                    <th>Paper name</th>
                    <th>Course</th>
                    <th>Total Marks</th>
                    <th>Duration</th>
                    <th>No of questions</th>
                    <th>No of section</th>
                    <th>Edit</th>
                    <th>Delete</th>
                    <th>Add questions</th>
                    <th>Conduct test</th>
                  </tr>
                </thead>
                <tbody>
                  {tests ? (
                    tests.map((item) => (
                      <TESTDETAILS key={item._id} item={item} />
                    ))
                  ) : (
                    <tr>
                      <td>
                        <SpinnerLoaderW />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}>
        <div className="justify-between flex yth">
          <div>Paper Type</div>
          <button
            style={{ color: "black" }}
            className="text-xl"
            onClick={closeModal}>
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
        <form style={{ padding: "20px 0px" }} onSubmit={handleSubmit}>
          <label className="text-sm flex items-center" htmlFor="papername">
            <i className="fa-solid fa-file-circle-question mr-1"></i> Paper name
          </label>
          <input
            className={
              errors.papername && touched.papername
                ? "bg-ffeeee border-red-500 inpt-pt npt"
                : "bg-white inpt-pt npt"
            }
            id="papername"
            type="text"
            name="papername"
            placeholder="Paper name"
            value={values.papername}
            onChange={handleChange}
          />
          <label className="text-sm flex items-center" htmlFor="course">
            <i className="fa-solid fa-book-open-reader mr-1"></i> Course
          </label>
          <input
            className={
              errors.course && touched.course
                ? "bg-ffeeee border-red-500 inpt-pt npt"
                : "bg-white inpt-pt npt"
            }
            id="course"
            type="text"
            name="course"
            placeholder="Course"
            value={values.course}
            onChange={handleChange}
          />
          <label className="text-sm flex items-center" htmlFor="course">
            <i className="fa-solid fa-square-check mr-1"></i>Total Marks
          </label>
          <input
            className={
              errors.totalmarks && touched.totalmarks
                ? "bg-ffeeee border-red-500 inpt-pt npt"
                : "bg-white inpt-pt npt"
            }
            id="totalmarks"
            type="text"
            name="totalmarks"
            placeholder="Total marks"
            value={values.totalmarks}
            onChange={handleChange}
          />
          <label className="text-sm flex items-center" htmlFor="noofquestions">
            <i className="fa-solid fa-clipboard-question mr-1"></i> No of
            questions
          </label>
          <input
            className={
              errors.noofquestions && touched.noofquestions
                ? "bg-ffeeee border-red-500 inpt-pt npt"
                : "bg-white inpt-pt npt"
            }
            id="noofquestions"
            type="number"
            name="noofquestions"
            placeholder="No of questions"
            value={values.noofquestions}
            onChange={handleChange}
          />
          <label className="text-sm flex items-center" htmlFor="noofsections">
            <i className="fa-solid fa-list-ol mr-1"></i> No of sections
          </label>
          <input
            className={
              errors.noofsections && touched.noofsections
                ? "bg-ffeeee border-red-500 inpt-pt npt"
                : "bg-white inpt-pt npt"
            }
            id="noofsections"
            type="number"
            name="noofsections"
            placeholder="No of sections"
            value={values.noofsections}
            onChange={handleChange}
          />
          <label className="text-sm flex items-center" htmlFor="examduration">
            <i className="fa-regular fa-clock mr-1"></i>Exam duration
          </label>
          <input
            className={
              errors.examduration && touched.examduration
                ? "bg-ffeeee border-red-500 inpt-pt npt"
                : "bg-white inpt-pt npt"
            }
            id="examduration"
            name="examduration"
            placeholder="Exam duration"
            type={inputType}
            onFocus={handleFocus}
            onBlur={handleBlur}
            step="1"
            value={values.examduration}
            onChange={handleChange}
          />
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
      {/* update data modal   */}
      <ToastContainer position="bottom-right" />
    </>
  );
}
