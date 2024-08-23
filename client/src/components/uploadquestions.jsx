import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useFormik, Field } from "formik";
import * as Yup from "yup";
Modal.setAppElement("#root");
import { useAuth } from "../contexts/AuthContext";
import { Editor } from "@tinymce/tinymce-react";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notify = () => toast.success("Solution Uploaded!");
const notify2 = () => toast.success("Question Uploaded!");
const UploadAnswer = ({ val }) => {
  const { UploadSolution } = useAuth();
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
  const { id } = useParams();
  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  const [selectedImage, setSelectedImage] = useState(null);

  const initialValues = {
    solutionimg: null,
    vidlink: ""
  };

  const questionSchema = Yup.object({
    solutionimg: Yup.mixed().required("Please fill above field")
  });

  const {
    values,
    touched,
    errors,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm
  } = useFormik({
    initialValues: initialValues,
    validationSchema: questionSchema,
    onSubmit: (values, { resetForm }) => {
      values.testID = id;
      values.questionID = val._id;
      UploadSolution(values);
      closeModal();
      setSelectedImage("");
      resetForm();
      notify();
    }
  });

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile instanceof Blob) {
      try {
        setSelectedImage(URL.createObjectURL(imageFile));
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <button
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Upload solution"
        className="mr-1"
        style={{ height: "20px" }}
        onClick={() => {
          openModal();
        }}>
        <i className="fa-solid mr-1 fa-upload text-green-500"></i>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}>
        <div className="justify-between flex yth">
          <div>Upload Solution</div>
          <button
            style={{ color: "black" }}
            className="text-xl"
            onClick={closeModal}>
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
        <form style={{ padding: "20px 0px" }} onSubmit={handleSubmit}>
          <label className="qstn-imgdiv mt-2" htmlFor="questionUpload">
            Upload solution image
          </label>
          <input
            name="solutionimg"
            accept="image/*"
            id="questionUpload"
            type="file"
            hidden
            onChange={(e) => {
              setFieldValue("solutionimg", e.currentTarget.files[0]);
              handleImageChange(e);
            }}
          />
          <div
            className="mb-2"
            style={
              selectedImage
                ? {
                    background: `url(${selectedImage}) center/cover`,
                    height: "200px"
                  }
                : {}
            }></div>
          <div className="flex items-center justify-between">
            <label className="text-sm flex items-center mr-2" htmlFor="vidlink">
              <i className="fa-solid fa-circle-play mr-1"></i>Video link:
            </label>
            <input
              className={
                errors.vidlink && touched.vidlink
                  ? "bg-ffeeee border-red-500 inpt-pt2 npt w-2/3"
                  : "bg-white inpt-pt2 npt w-2/3"
              }
              id="vidlink"
              name="vidlink"
              placeholder="Video link"
              type="text"
              value={values.vidlink}
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

const UPDATEQUESTION = ({ val, index }) => {
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
  const { Updatequestions, deletequestion } = useAuth();
  const [modalIsOpenU, setIsOpen] = useState(false);
  const { id } = useParams();
  const deleteQuestion = (questionid) => {
    let userConfirmed = confirm("Do you want to delete this question?");
    if (userConfirmed) {
      deletequestion(questionid, id);
    }
  };

  function openModalU() {
    setIsOpen(true);
  }
  function closeModalU() {
    setIsOpen(false);
  }

  const convertAnsToBoolean = (ans) => {
    return Object.fromEntries(
      Object.entries(ans).map(([key, value]) => [key, value === "true"])
    );
  };
  const getInitialAnsValue = (selectedType) => {
    switch (selectedType) {
      case "MSQ":
        return convertAnsToBoolean(val.ans);
      case "MCQ":
        return val.ans;
      case "NAT":
        return val.ans;
      case "SKETCHING":
      case "D-APTITUDE":
        return val.ans;
      default:
        return val.ans;
    }
  };

  const initialValues = {
    ans: getInitialAnsValue("NAT"),
    marks: `${val.marks}`,
    negativemarks: `${val.negativemarks}`,
    questionimg: null,
    selectedType: `${val.selectedType}`
  };

  const questionSchema = Yup.object({
    questionimg: Yup.mixed().required("Please fill above field"),
    ans: Yup.mixed().required("Please fill the answer"),
    marks: Yup.string().min(1).required("Please fill the marks"),
    negativemarks: Yup.string()
      .min(1)
      .required("Please fill the negative marks"),
    selectedType: Yup.string().required("Please select an option")
  });

  const { values, touched, errors, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: initialValues,
      validationSchema: questionSchema,
      onSubmit: (values) => {
        values = { ...values, id: id, questionID: val._id };
        Updatequestions(values);
        closeModalU();
      }
    });
  useEffect(() => {
    setFieldValue("ans", getInitialAnsValue(values.selectedType));
  }, [values.selectedType]);

  const [selectedImage, setSelectedImage] = useState(val.question);
  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile instanceof Blob) {
      try {
        setSelectedImage(URL.createObjectURL(imageFile));
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleAnsChange = (e) => {
    const { value, checked } = e.target;

    if (values.selectedType === "MSQ") {
      const updatedAns = {
        ...values.ans,
        [value]: checked
      };

      setFieldValue("ans", updatedAns);
    }
  };
  return (
    <>
      <Tooltip id="my-tooltip" />
      <div key={index} className="mt-2 p-3 bg-white hjg text-sm">
        <div className=" flex justify-between">
          <div className="flex">
            <span className="mr-1">{index + 1}.</span>
            <img style={{ height: "200px" }} alt="img" src={val?.question} />
          </div>
          <div className="flex text-xl">
            <div>
              <UploadAnswer val={val} />
            </div>
            <button
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Edit question"
              className="mr-1"
              style={{ height: "20px" }}
              onClick={() => {
                openModalU();
              }}>
              <i className="fa-solid fa-pen-to-square mr-1"></i>
            </button>
            <button
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Delete question"
              style={{ height: "20px" }}
              onClick={() => {
                deleteQuestion(val?._id);
              }}>
              <i className="fa-solid fa-trash text-red-600"></i>
            </button>
          </div>
        </div>
        <div>Type: {val?.selectedType}</div>
        <div className="text-green-600 flex">
          answer:{" "}
          {typeof val?.ans === "object" ? (
            <div>
              {Object.entries(val.ans).map(([key, value]) => (
                <span key={key} className="mr-2">
                  <strong>{key}:</strong> {value === "true" ? "true" : "false"}
                </span>
              ))}
            </div>
          ) : typeof val?.ans === "string" ? (
            <span>{val.ans}</span>
          ) : null}
        </div>
      </div>
      <Modal
        isOpen={modalIsOpenU}
        onRequestClose={closeModalU}
        style={customStyles}
        shouldCloseOnOverlayClick={false}>
        <div className="justify-between flex yth">
          <div>Question</div>
          <button
            style={{ color: "black" }}
            className="text-xl"
            onClick={closeModalU}>
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
        <form style={{ padding: "20px 0px" }} onSubmit={handleSubmit}>
          <div style={{ width: "100%" }}>
            <select
              value={values.selectedType}
              onChange={handleChange}
              name="selectedType"
              className="form-select form-select-sm">
              <option value="MCQ">Multiple choice questions(MCQ)</option>
              <option value="MSQ">Multiple selective questions(MSQ)</option>
              <option value="NAT">Numerical answer type(NAT)</option>
              <option value="SKETCHING">Sketching</option>
              <option value="D-APTITUDE">Design Aptitude</option>
            </select>
            <label className="qstn-imgdiv mt-2" htmlFor="questionUpload">
              Upload question image
            </label>
            <input
              name="questionimg"
              accept="image/*"
              id="questionUpload"
              type="file"
              hidden
              onChange={(e) => {
                setFieldValue("questionimg", e.currentTarget.files[0]);
                handleImageChange(e);
              }}
            />
            <div
              style={
                selectedImage
                  ? {
                      background: `url(${selectedImage}) center/cover`,
                      height: "200px"
                    }
                  : {}
              }></div>
          </div>
          <div className="flex items-center justify-between">
            <label
              className="text-sm flex items-center mr-2 text-green-700"
              htmlFor="ans">
              <i className="fa-solid fa-circle-check mr-1"></i>Answer:-
            </label>
            {values.selectedType === "MCQ" ? (
              <div
                className={
                  errors.ans && touched.ans
                    ? "bg-ffeeee border-red-500 inpt-pt2 npt w-2/3 flex justify-evenly"
                    : "bg-white inpt-pt2 npt w-2/3 flex justify-evenly"
                }>
                <label className="flex items-center">
                  <input
                    className="mr-1"
                    type="radio"
                    name="ans"
                    value="A"
                    checked={values.ans === "A"}
                    onChange={handleChange}
                  />
                  A
                </label>
                <label className="flex items-center">
                  <input
                    className="mr-1"
                    type="radio"
                    name="ans"
                    value="B"
                    checked={values.ans === "B"}
                    onChange={handleChange}
                  />
                  B
                </label>
                <label className="flex items-center">
                  <input
                    className="mr-1"
                    type="radio"
                    name="ans"
                    value="C"
                    checked={values.ans === "C"}
                    onChange={handleChange}
                  />
                  C
                </label>
                <label className="flex items-center">
                  <input
                    className="mr-1"
                    type="radio"
                    name="ans"
                    value="D"
                    checked={values.ans === "D"}
                    onChange={handleChange}
                  />
                  D
                </label>
              </div>
            ) : values.selectedType === "MSQ" ? (
              <div
                className={
                  errors.ans && touched.ans
                    ? "bg-ffeeee border-red-500 inpt-pt2 npt w-2/3 flex justify-evenly"
                    : "bg-white inpt-pt2 npt w-2/3 flex justify-evenly"
                }>
                {["A", "B", "C", "D"].map((option) => (
                  <label className="flex items-center" key={option}>
                    <input
                      className="mr-1"
                      type="checkbox"
                      name="ans"
                      value={option}
                      checked={values.ans[option] || false}
                      onChange={handleAnsChange}
                    />
                    {option}
                  </label>
                ))}
              </div>
            ) : values.selectedType === "SKETCHING" ||
              values.selectedType === "D-APTITUDE" ? (
              <input
                className="bg-white inpt-pt2 npt w-2/3"
                id="ans"
                name="ans"
                placeholder="answer"
                type="text"
                value="NA"
                readOnly
              />
            ) : (
              <input
                className={
                  errors.ans && touched.ans
                    ? "bg-ffeeee border-red-500 inpt-pt2 npt w-2/3"
                    : "bg-white inpt-pt2 npt w-2/3"
                }
                id="ans"
                name="ans"
                placeholder="answer"
                type="text"
                value={values.ans}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm flex items-center mr-2" htmlFor="ans">
              <i className="fa-solid fa-square-check mr-1"></i>Marks:-
            </label>
            <input
              className={
                errors.marks && touched.marks
                  ? "bg-ffeeee border-red-500 inpt-pt2 npt w-2/3"
                  : "bg-white inpt-pt2 npt w-2/3"
              }
              id="marks"
              name="marks"
              placeholder="marks"
              type="text"
              value={values.marks}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <label
              className="text-sm flex items-center mr-2 text-red-700"
              htmlFor="ans">
              <i className="fa-solid fa-square-xmark mr-1"></i>Negative marks:-
            </label>
            <input
              className={
                errors.negativemarks && touched.negativemarks
                  ? "bg-ffeeee border-red-500 inpt-pt2 npt w-2/3"
                  : "bg-white inpt-pt2 npt w-2/3"
              }
              id="negativemarks"
              name="negativemarks"
              placeholder="negative marks"
              type="text"
              value={values.negativemarks}
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

const TinyMCEEditor = ({ name, value, setFieldValue }) => {
  const handleEditorChange = (content) => {
    setFieldValue(name, content);
  };

  return (
    <>
      <Editor
        apiKey="vj4a5y1cyws11eygj5md1xieva7p2gagl3j3khi9ka9xldzx"
        init={{
          width: 800,
          plugins:
            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat"
        }}
        onEditorChange={handleEditorChange}
        initialValue={value}
      />
    </>
  );
};

const PaperInstruction = ({}) => {
  const { tests, addinstructions } = useAuth();
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "60%"
    }
  };
  const [modalIsOpen, setIsOpen] = useState(false);
  const { id } = useParams();

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const initialValues = {
    instructions: ""
  };

  const questionSchema = Yup.object({
    instructions: Yup.string().required("Please fill above field")
  });

  const { values, touched, errors, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: initialValues,
      validationSchema: questionSchema,
      onSubmit: (values) => {
        values.id = id;
        addinstructions(values);
        closeModal();
      }
    });

  return (
    <>
      <button className="btn-addq mr-4" onClick={openModal}>
        <i className="fa-solid fa-plus mr-1"></i>
        Add paper instructions
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}>
        <div className="justify-between flex yth">
          <div>Marking scheme instructions</div>
          <button
            style={{ color: "black" }}
            className="text-xl"
            onClick={closeModal}>
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
        <form style={{ padding: "20px 0px" }} onSubmit={handleSubmit}>
          <div className="flex items-center">
            <TinyMCEEditor
              name="instructions"
              value={values.instructions}
              setFieldValue={setFieldValue}
            />
          </div>
          <div className="text-right mt-3">
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

export default function UploadQuestions() {
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
  const { tests, questions, isLoggedIn } = useAuth();
  const [modalIsOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      return navigate("/adminlogin");
    }
  }, [isLoggedIn]);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const getInitialAnsValue = (selectedType) => {
    switch (selectedType) {
      case "MSQ":
        return {
          A: false,
          B: false,
          C: false,
          D: false
        };
      case "MCQ":
      case "NAT":
        return "";
      case "SKETCHING":
      case "D-APTITUDE":
        return "NA";
      default:
        return "";
    }
  };

  const initialValues = {
    ans: getInitialAnsValue("NAT"),
    marks: "",
    negativemarks: "",
    questionimg: null,
    selectedType: "NAT"
  };

  const questionSchema = Yup.object({
    questionimg: Yup.mixed().required("Please fill above field"),
    ans: Yup.mixed().required("Please fill the answer"),
    marks: Yup.string().min(1).required("Please fill the marks"),
    negativemarks: Yup.string()
      .min(1)
      .required("Please fill the negative marks"),
    selectedType: Yup.string().required("Please select an option")
  });

  const {
    values,
    touched,
    errors,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm
  } = useFormik({
    initialValues: initialValues,
    validationSchema: questionSchema,
    onSubmit: (values, { resetForm }) => {
      values.id = id;
      questions(values);
      setSelectedImage("");
      notify2()
      resetForm();
    }
  });
  useEffect(() => {
    setFieldValue("ans", getInitialAnsValue(values.selectedType));
  }, [values.selectedType]);

  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile instanceof Blob) {
      try {
        setSelectedImage(URL.createObjectURL(imageFile));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleAnsChange = (e) => {
    const { value, checked } = e.target;

    if (values.selectedType === "MSQ") {
      const updatedAns = {
        ...values.ans,
        [value]: checked
      };

      setFieldValue("ans", updatedAns);
    }
  };

  return (
    <>
      <div style={{ height: "100vh" }} className="flex">
        <div className="left">
          <Link to="/uploadtest">
            <div className="p-6 last-txt text-xl th">
              <i className="fa-solid fa-file-arrow-up mr-2"></i>Upload Tests
            </div>
          </Link>
        </div>
        <div className="right">
          <div className="tstcd">
            <div className="uft flex justify-between items-center">
              <div className="uplq text-xl ml-1 font-bold">
                {tests
                  ?.filter((item) => item._id === id)
                  .map((val, index) => {
                    return <div key={index}>{val.paper_name}</div>;
                  })}
              </div>
              <div className="flex items-center">
                <PaperInstruction />

                <button className="btn-addq" onClick={openModal}>
                  <i className="fa-solid fa-plus mr-1"></i>
                  Add questions
                </button>
              </div>
            </div>
            <div style={{ overflowY: "auto", maxHeight: "80vh" }}>
              {tests
                ?.filter((item) => item._id === id)[0]
                .questions?.map((val, index) => {
                  return <UPDATEQUESTION key={index} val={val} index={index} />;
                })}
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
          <div>Question</div>
          <button
            style={{ color: "black" }}
            className="text-xl"
            onClick={closeModal}>
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
        <form style={{ padding: "20px 0px" }} onSubmit={handleSubmit}>
          <div style={{ width: "100%" }}>
            <select
              value={values.selectedType}
              onChange={handleChange}
              name="selectedType"
              className="form-select form-select-sm">
              <option value="NAT">Numerical answer type(NAT)</option>
              <option value="MSQ">Multiple selective questions(MSQ)</option>
              <option value="MCQ">Multiple choice questions(MCQ)</option>
              <option value="SKETCHING">Sketching</option>
              <option value="D-APTITUDE">Design Aptitude</option>
            </select>
            <label className="qstn-imgdiv mt-2" htmlFor="questionUpload">
              Upload question image
            </label>
            <input
              name="questionimg"
              accept="image/*"
              id="questionUpload"
              type="file"
              hidden
              onChange={(e) => {
                setFieldValue("questionimg", e.currentTarget.files[0]);
                handleImageChange(e);
              }}
            />
            <div
              style={
                selectedImage
                  ? {
                      background: `url(${selectedImage}) center/cover`,
                      height: "200px"
                    }
                  : {}
              }></div>
          </div>
          <div className="flex items-center justify-between">
            <label
              className="text-sm flex items-center mr-2 text-green-700"
              htmlFor="ans">
              <i className="fa-solid fa-circle-check mr-1"></i>Answer:-
            </label>
            {values.selectedType === "MCQ" ? (
              <div
                className={
                  errors.ans && touched.ans
                    ? "bg-ffeeee border-red-500 inpt-pt2 npt w-2/3 flex justify-evenly"
                    : "bg-white inpt-pt2 npt w-2/3 flex justify-evenly"
                }>
                <label className="flex items-center">
                  <input
                    className="mr-1"
                    type="radio"
                    name="ans"
                    value="A"
                    checked={values.ans === "A"}
                    onChange={handleChange}
                  />
                  A
                </label>
                <label className="flex items-center">
                  <input
                    className="mr-1"
                    type="radio"
                    name="ans"
                    value="B"
                    checked={values.ans === "B"}
                    onChange={handleChange}
                  />
                  B
                </label>
                <label className="flex items-center">
                  <input
                    className="mr-1"
                    type="radio"
                    name="ans"
                    value="C"
                    checked={values.ans === "C"}
                    onChange={handleChange}
                  />
                  C
                </label>
                <label className="flex items-center">
                  <input
                    className="mr-1"
                    type="radio"
                    name="ans"
                    value="D"
                    checked={values.ans === "D"}
                    onChange={handleChange}
                  />
                  D
                </label>
              </div>
            ) : values.selectedType === "MSQ" ? (
              <div
                className={
                  errors.ans && touched.ans
                    ? "bg-ffeeee border-red-500 inpt-pt2 npt w-2/3 flex justify-evenly"
                    : "bg-white inpt-pt2 npt w-2/3 flex justify-evenly"
                }>
                {["A", "B", "C", "D"].map((option) => (
                  <label className="flex items-center" key={option}>
                    <input
                      className="mr-1"
                      type="checkbox"
                      name="ans"
                      value={option}
                      checked={values.ans[option] || false}
                      onChange={handleAnsChange}
                    />
                    {option}
                  </label>
                ))}
              </div>
            ) : values.selectedType === "SKETCHING" ||
              values.selectedType === "D-APTITUDE" ? (
              <input
                className="bg-white inpt-pt2 npt w-2/3"
                id="ans"
                name="ans"
                placeholder="answer"
                type="text"
                value="NA"
                readOnly
              />
            ) : (
              <input
                className={
                  errors.ans && touched.ans
                    ? "bg-ffeeee border-red-500 inpt-pt2 npt w-2/3"
                    : "bg-white inpt-pt2 npt w-2/3"
                }
                id="ans"
                name="ans"
                placeholder="answer"
                type="text"
                value={values.ans}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm flex items-center mr-2" htmlFor="ans">
              <i className="fa-solid fa-square-check mr-1"></i>Marks:-
            </label>
            <input
              className={
                errors.marks && touched.marks
                  ? "bg-ffeeee border-red-500 inpt-pt2 npt w-2/3"
                  : "bg-white inpt-pt2 npt w-2/3"
              }
              id="marks"
              name="marks"
              placeholder="marks"
              type="text"
              value={values.marks}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <label
              className="text-sm flex items-center mr-2 text-red-700"
              htmlFor="ans">
              <i className="fa-solid fa-square-xmark mr-1"></i>Negative marks:-
            </label>
            <input
              className={
                errors.negativemarks && touched.negativemarks
                  ? "bg-ffeeee border-red-500 inpt-pt2 npt w-2/3"
                  : "bg-white inpt-pt2 npt w-2/3"
              }
              id="negativemarks"
              name="negativemarks"
              placeholder="negative marks"
              type="text"
              value={values.negativemarks}
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
      <ToastContainer position="bottom-right" />
    </>
  );
}
