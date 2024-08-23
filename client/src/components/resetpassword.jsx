import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {
  const { ResetPass,ErrorReset } = useAuth();
  const { id } = useParams();
  const initialValues = {
    npassword: "",
    cpassword: ""
  };

  const questionSchema = Yup.object({
    npassword: Yup.string().min(5).required("Please fill your new password"),
    cpassword: Yup.string().min(5).required("Please fill your confirm password")
  });

  const { values, touched, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: questionSchema,
    onSubmit: (values) => {
      values.id = id;
      ResetPass(values);
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [showCPassword, setShowCPassword] = useState(false);
  const toggleCPasswordVisibility = () => {
    setShowCPassword(!showCPassword);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div
        style={{
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
        }}
        className="px-14 py-10 lgsg">
        <div className="font-bold text-3xl text-center">Reset Password</div>
        <form onSubmit={handleSubmit}>
          <div className="text-left mt-3">
            <label className="font-light" htmlFor="npassword">
              New password
            </label>
          </div>
          <div className="position-relative">
            <input
              className={
                errors.npassword && touched.npassword
                  ? "bg-ffeeee border-red-500 inp-lgsg "
                  : "bg-white  inp-lgsg"
              }
              id="npassword"
              type={showPassword ? "text" : "password"}
              name="npassword"
              onChange={handleChange}
              value={values.npassword}
            />
            <div
              style={{ right: "0px", top: "0px" }}
              className="position-absolute cursor-pointer">
              <a
                onClick={() => {
                  togglePasswordVisibility();
                }}>
                {showPassword ? (
                  <i className="fa-solid fa-eye-slash"></i>
                ) : (
                  <i className="fa-solid fa-eye"></i>
                )}
              </a>
            </div>
          </div>
          <div className="text-left mt-10">
            <label className="font-light" htmlFor="cpassword">
              Confirm password
            </label>
          </div>
          <div className="position-relative">
            <input
              id="cpassword"
              type={showCPassword ? "text" : "password"}
              className={
                errors.cpassword && touched.cpassword
                  ? "bg-ffeeee border-red-500 inp-lgsg "
                  : "bg-white  inp-lgsg"
              }
              name="cpassword"
              onChange={handleChange}
              value={values.cpassword}
            />
            <div
              style={{ right: "0px", top: "0px" }}
              className="position-absolute cursor-pointer">
              <a
                onClick={() => {
                  toggleCPasswordVisibility();
                }}>
                {showCPassword ? (
                  <i className="fa-solid fa-eye-slash"></i>
                ) : (
                  <i className="fa-solid fa-eye"></i>
                )}
              </a>
            </div>
          </div>
          {ErrorReset ? (
            <div className="text-red-500 flex items-center mt-2">
              <span style={{ fontSize: "14px" }}>
                <i className="fa-solid fa-circle-exclamation mr-1"></i>
              </span>{" "}
              <span className="text-sm">{ErrorReset}</span>
            </div>
          ) : null}
          <button type="submit" className="btn-lgsg">
            Reset
          </button>
        </form>
      </div>
    </div>
  );
}
