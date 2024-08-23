import React, { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useFormik, Field } from "formik";
import * as Yup from "yup";
Modal.setAppElement("#root");
import { useAuth } from "../contexts/AuthContext";
import Logo from "../images/DC Dot Logo PNG_edited.png";
import { format, parseISO } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Design from "../images/Design.png";
import SpinnerLoader from "./spinnerloader";

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
const notify = () => toast.success("OTP resent");

const ProfileImage = () => {
  const { userdata, Updatepropic } = useAuth();

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile instanceof Blob) {
      setSelectedImage(URL.createObjectURL(imageFile));
    }
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("id", userdata._id);

    Updatepropic(formData);
  };

  useEffect(() => {
    setSelectedImage(userdata.image);
  }, []);
  return (
    <div className="uplq text-xl ml-1 font-bold w-1/5">
      <div className="relative">
        <label
          style={{
            background: `url(${selectedImage}) center/cover`,
            border: selectedImage ? "none" : ""
          }}
          htmlFor="input-file"
          id="drop-area">
          {selectedImage ? null : (
            <span className="material-symbols-outlined text-gray-400 text-sm">
              add_a_photo
            </span>
          )}
          {selectedImage ? (
            <div className="delete-img">
              <i className="fa-solid fa-camera fa-xs"></i>
            </div>
          ) : null}
        </label>
      </div>
      <input
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
  );
};

const NewEmail = () => {
  const { userdata, modalIsOpenNE, closeModalNE, NEWemail, ErrorExist } =
    useAuth();
  const otpSchema = Yup.object({
    email: Yup.string().email().required("Please fill email id")
  });
  const initialValues = {
    email: ""
  };
  const { values, touched, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: otpSchema,
    onSubmit: (values) => {
      values.id = userdata._id;
      NEWemail(values);
    }
  });
  return (
    <>
      <Modal
        isOpen={modalIsOpenNE}
        onRequestClose={closeModalNE}
        style={customStyles}
        shouldCloseOnOverlayClick={false}>
        <div className="justify-between flex yth">
          <div>Enter New Email</div>
          <button
            style={{ color: "black" }}
            className="text-xl"
            onClick={closeModalNE}>
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
        <div className="text-gray-600 text-sm my-2 text-center">
          OTP will be sent on this email for verification
        </div>
        <form style={{ padding: "20px 0px" }} onSubmit={handleSubmit}>
          <label className="text-sm flex items-center" htmlFor="email">
            Email
          </label>
          <input
            className={
              errors.email && touched.email
                ? "bg-ffeeee border-red-500 inpt-pt npt"
                : "bg-white inpt-pt npt"
            }
            id="email"
            type="text"
            name="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
          />
          {ErrorExist ? (
            <div className="text-red-500 flex items-center justify-center mt-2 mb-2">
              <span style={{ fontSize: "14px" }}>
                <i className="fa-solid fa-circle-exclamation mr-1"></i>
              </span>{" "}
              <div className="text-sm">{ErrorExist}</div>
            </div>
          ) : null}
          <div className="text-xs mb-2 flex items-center text-gray-500">
            <i className="fa-solid fa-circle-exclamation mr-1"></i>{" "}
            <div>You content won't be accessible on the old email</div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              style={{ width: "130px" }}
              className="btn-sub">
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
const NewEmailOTP = () => {
  const {
    errorO,
    otpResend,
    ResendOTPs,
    NEOsendOTP,
    modalIsOpenNEO,
    closeModalNEO,
    newtempemail,
    userdata
  } = useAuth();

  const otpSchema = Yup.object({
    otp: Yup.string().max(7).required("Please fill otp")
  });
  const initialValues = {
    otp: ""
  };
  const { values, touched, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: otpSchema,
    onSubmit: (values) => {
      values.id = userdata._id;
      values.email = newtempemail;
      NEOsendOTP(values);
    }
  });

  return (
    <>
      <Modal
        isOpen={modalIsOpenNEO}
        onRequestClose={closeModalNEO}
        style={customStyles}
        shouldCloseOnOverlayClick={false}>
        <div className="justify-between flex yth">
          <div>Verify OTP</div>
          <button
            style={{ color: "black" }}
            className="text-xl"
            onClick={closeModalNEO}>
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
        <div className="text-red-500 text-sm my-2">
          Please verify email, OTP sent to {newtempemail}
        </div>
        <form style={{ padding: "20px 0px" }} onSubmit={handleSubmit}>
          <input
            placeholder="Enter OTP"
            onChange={handleChange}
            value={values.otp}
            id="otp"
            type="number"
            className={
              errors.otp && touched.otp
                ? "bg-ffeeee border-red-500 inp-lgsg npt "
                : "bg-white npt  inp-lgsg"
            }
            name="otp"
          />

          <div className="mt-4 mb-1 text-xs text-center">
            Didn't receive OTP?
            <a
              className=" text-red-600 cursor-pointer"
              onClick={() => {
                notify();
                ResendOTPs(userdata.email);
              }}>
              {" "}
              Resend
            </a>
          </div>
          <div className="text-green-600 my-1 text-center text-xs">
            {otpResend}
          </div>
          {errorO ? (
            <div className="text-red-500 flex items-center justify-center mt-2 mb-2">
              <span style={{ fontSize: "14px" }}>
                <i className="fa-solid fa-circle-exclamation mr-1"></i>
              </span>{" "}
              <div className="text-sm">{errorO}</div>
            </div>
          ) : null}
          <div className="text-center">
            <button
              type="submit"
              style={{ width: "130px" }}
              className="btn-sub">
              Verify
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
const UpdateEmail = ({ userdata }) => {
  const {
    updateEmail,
    errorO,
    otpResend,
    ResendOTPs,
    UEsendOTP,
    modalIsOpen,
    openModalUE,
    closeModalUE
  } = useAuth();

  const otpSchema = Yup.object({
    otp: Yup.string().max(7).required("Please fill otp")
  });
  const initialValues = {
    otp: ""
  };
  const { values, touched, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: otpSchema,
    onSubmit: (values) => {
      values.id = userdata._id;
      UEsendOTP(values);
    }
  });

  return (
    <>
      <div className="w-1/3 text-gray-500">Email</div>
      <div className="w-2/3">
        {" "}
        {userdata.email ? userdata.email : "-NA-"}
        {userdata.googleId ? null : (
          <button
            onClick={() => {
              updateEmail(userdata.email, userdata._id);
              openModalUE();
            }}
            style={{ color: "#209bd1" }}
            className="ml-10 font-semibold text-xs">
            Update email
          </button>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModalUE}
        style={customStyles}
        shouldCloseOnOverlayClick={false}>
        <div className="justify-between flex yth">
          <div>Verify OTP</div>
          <button
            style={{ color: "black" }}
            className="text-xl"
            onClick={closeModalUE}>
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
        <div className="text-red-500 text-sm my-2">
          Please verify it's you. OTP sent to {userdata?.email}
        </div>
        <form style={{ padding: "20px 0px" }} onSubmit={handleSubmit}>
          <input
            placeholder="Enter OTP"
            onChange={handleChange}
            value={values.otp}
            id="otp"
            type="number"
            className={
              errors.otp && touched.otp
                ? "bg-ffeeee border-red-500 inp-lgsg npt "
                : "bg-white npt  inp-lgsg"
            }
            name="otp"
          />

          <div className="mt-4 mb-1 text-xs text-center">
            Didn't receive OTP?
            <a
              className=" text-red-600 cursor-pointer"
              onClick={() => {
                notify();
                ResendOTPs(userdata.email);
              }}>
              {" "}
              Resend
            </a>
          </div>
          <div className="text-green-600 my-1 text-center text-xs">
            {otpResend}
          </div>
          {errorO ? (
            <div className="text-red-500 flex items-center justify-center mt-2 mb-2">
              <span style={{ fontSize: "14px" }}>
                <i className="fa-solid fa-circle-exclamation mr-1"></i>
              </span>{" "}
              <div className="text-sm">{errorO}</div>
            </div>
          ) : null}
          <div className="text-center">
            <button
              type="submit"
              style={{ width: "130px" }}
              className="btn-sub">
              Verify
            </button>
          </div>
        </form>
      </Modal>
      <NewEmail />
      <NewEmailOTP />
    </>
  );
};

export default function UserProfile() {
  const { tests, userdata, userlogin, editProfile } = useAuth();

  useEffect(() => {
    // console.log(userdata);
  }, []);

  const initialValues = {
    name: userdata?.displayName || "",
    mobileno: userdata?.mobileno || "",
    stream: userdata?.stream || "",
    exams: userdata?.exams || "",
    address: userdata?.address || ""
  };
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  const testSchema = Yup.object({
    // email: Yup.string().email().required("Please fill your email id")
  });
  const notify = () => toast.success("Profile updated!");
  const { values, touched, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: testSchema,
    onSubmit: (values) => {
      closeModal();
      values._id = userdata._id;
      editProfile(values);
      notify();
    }
  });
  return (
    <>
      {userlogin ? (
        <>
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
              <div className="flex justify-between items-center kh ">
                <Link
                  to="/test-series"
                  style={{ margin: "4.8px 0" }}
                  className="p-3 font-semibold cursor-pointer">
                  <i className="fa-solid fa-angle-left mr-1"></i> Back
                </Link>
              </div>
              <div style={{ backgroundColor: "#f7f9fe", padding: "10px" }}>
                <div style={{ margin: "0px" }} className="tstcd hjb">
                  <div className="uft flex justify-between  ">
                    <ProfileImage />

                    <div className="w-4/5 ">
                      <div className="flex justify-between">
                        <div className=" font-semibold text-xl">
                          Profile Detail
                        </div>
                        <button className=" text-sm" onClick={openModal}>
                          Edit
                        </button>
                      </div>
                      <div className="flex justify-between items-center my-3">
                        <h6 className="text-xs text-gray-400">
                          Personal Details
                        </h6>
                        <hr className="w-2/3" />
                      </div>
                      <div className="flex my-2 justify-between text-sm">
                        <div className="w-1/3 text-gray-500">Name</div>
                        <div className="w-2/3">
                          {userdata.displayName ? userdata.displayName : "-NA-"}
                        </div>
                      </div>
                      <div className="flex my-2 justify-between text-sm">
                        <div className="w-1/3 text-gray-500">Mobile No</div>
                        <div className="w-2/3">
                          {" "}
                          {userdata.mobileno ? userdata.mobileno : "-NA-"}
                        </div>
                      </div>
                      <div className="flex my-2 justify-between text-sm">
                        <UpdateEmail userdata={userdata} />
                      </div>
                      <div className="flex my-2 justify-between text-sm">
                        <div className="w-1/3 text-gray-500">
                          Living city/Village/Town
                        </div>
                        <div className="w-2/3">
                          {" "}
                          {userdata.address ? userdata.address : "-NA-"}
                        </div>
                      </div>
                      <div className="flex justify-between items-center my-3">
                        <h6 className="text-xs text-gray-400">
                          Academic Details
                        </h6>
                        <hr className="w-2/3" />
                      </div>
                      <div className="flex my-2 justify-between text-sm">
                        <div className="w-1/3 text-gray-500">Stream</div>
                        <div className="w-2/3">
                          {" "}
                          {userdata.stream ? userdata.stream : "-NA-"}
                        </div>
                      </div>
                      <div className="flex my-2 justify-between text-sm">
                        <div className="w-1/3 text-gray-500">Exams</div>
                        <div className="w-2/3">
                          {" "}
                          {userdata.exams ? userdata.exams : "-NA-"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <img style={{ width: "260px" }} src={Design} alt="img" />
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
              <div>Edit details</div>
              <button
                style={{ color: "black" }}
                className="text-xl"
                onClick={closeModal}>
                <i className="fa-regular fa-circle-xmark"></i>
              </button>
            </div>
            <form style={{ padding: "20px 0px" }} onSubmit={handleSubmit}>
              <label className="text-sm flex items-center" htmlFor="name">
                Name
              </label>
              <input
                className={
                  errors.name && touched.name
                    ? "bg-ffeeee border-red-500 inpt-pt npt"
                    : "bg-white inpt-pt npt"
                }
                id="name"
                type="text"
                name="name"
                placeholder="Name"
                value={values.name}
                onChange={handleChange}
              />

              <label className="text-sm flex items-center" htmlFor="mobileno">
                Mobile no
              </label>
              <input
                className={
                  errors.mobileno && touched.mobileno
                    ? "bg-ffeeee border-red-500 inpt-pt npt"
                    : "bg-white inpt-pt npt"
                }
                id="mobileno"
                type="number"
                name="mobileno"
                placeholder="Mobile no"
                value={values.mobileno}
                onChange={handleChange}
              />

              <label className="text-sm flex items-center" htmlFor="address">
                Address
              </label>
              <input
                className={
                  errors.address && touched.address
                    ? "bg-ffeeee border-red-500 inpt-pt npt"
                    : "bg-white inpt-pt npt"
                }
                id="address"
                type="text"
                name="address"
                placeholder="address"
                value={values.address}
                onChange={handleChange}
              />
              <label className="text-sm flex items-center" htmlFor="exams">
                Exams
              </label>
              <input
                className={
                  errors.exams && touched.exams
                    ? "bg-ffeeee border-red-500 inpt-pt npt"
                    : "bg-white inpt-pt npt"
                }
                id="exams"
                type="text"
                name="exams"
                placeholder="exams"
                value={values.exams}
                onChange={handleChange}
              />
              <label className="text-sm flex items-center" htmlFor="stream">
                Stream
              </label>
              <input
                className={
                  errors.stream && touched.stream
                    ? "bg-ffeeee border-red-500 inpt-pt npt"
                    : "bg-white inpt-pt npt"
                }
                id="stream"
                type="text"
                name="stream"
                placeholder="stream"
                value={values.stream}
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
      ) : (
        <SpinnerLoader />
      )}
    </>
  );
}
