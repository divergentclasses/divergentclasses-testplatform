import React, { useEffect, useState } from "react";
import google from "../images/search.png";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notify = () => toast.success("OTP resent");
const notify2 = () => toast.warn("Email requied");
const OtpVerify = ({}) => {
  const { errorO, verifyOTP, tempemail, ResendOTPs, otpResend } = useAuth();
  const initialValues = {
    otp: ""
  };

  const questionSchema = Yup.object({
    otp: Yup.string().min(4).max(4).required("Please fill your password")
  });

  const { values, touched, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: questionSchema,
    onSubmit: (values) => {
      values.tempemail = tempemail;
      verifyOTP(values);
    }
  });

  return (
    <>
      <div
        style={{
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
        }}
        className="px-14 py-10 lgsg">
        <div className="font-bold text-5xl text-center">OTP Verify</div>
        <div className="my-4 font-light text-center text-red-600">
          OTP sent to {tempemail}
        </div>
        <form onSubmit={handleSubmit}>
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
          <div className="mt-2  text-sm">
            Didn't receive OTP?
            <a
              className=" text-red-600 cursor-pointer"
              onClick={() => {
                notify();
                ResendOTPs(tempemail);
              }}>
              {" "}
              Resend
            </a>
          </div>
          <div className="text-green-600 text-xs">{otpResend}</div>
          {errorO ? (
            <div className="text-red-500 flex items-center mt-2">
              <span style={{ fontSize: "14px" }}>
                <i className="fa-solid fa-circle-exclamation mr-1"></i>
              </span>{" "}
              <span className="text-sm">{errorO}</span>
            </div>
          ) : null}
          <button type="submit" className="btn-lgsg">
            Verify
          </button>
        </form>
      </div>
    </>
  );
};

const SignUp = ({ setsignUplogin }) => {
  const { loginwithgoogle, signup, errorS } = useAuth();
  const initialValues = {
    email: "",
    password: ""
  };

  const questionSchema = Yup.object({
    email: Yup.string().email().required("Please fill your email id"),
    password: Yup.string().min(5).required("Please fill your password")
  });

  const { values, touched, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: questionSchema,
    onSubmit: (values) => {
      signup(values);
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div
        style={{
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
        }}
        className="px-14 py-10 lgsg">
        <div className="font-bold text-5xl text-center">SignUp</div>
        <div className="my-4 font-light text-center">
          Already a member?{" "}
          <button
            onClick={() => setsignUplogin(false)}
            style={{ color: "#3d9bdb" }}>
            LogIn
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="text-left">
            <label className="font-light" htmlFor="email">
              Email
            </label>
          </div>
          <input
            onChange={handleChange}
            value={values.email}
            id="email"
            type="text"
            className={
              errors.email && touched.email
                ? "bg-ffeeee border-red-500 inp-lgsg "
                : "bg-white  inp-lgsg"
            }
            name="email"
          />

          <div className="text-left mt-10">
            <label className="font-light" htmlFor="password">
              Password
            </label>
          </div>
          <div className="position-relative">
            <input
              onChange={handleChange}
              value={values.password}
              id="password"
              type={showPassword ? "text" : "password"}
              className={
                errors.password && touched.password
                  ? "bg-ffeeee border-red-500 inp-lgsg "
                  : "bg-white  inp-lgsg"
              }
              name="password"
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
          {errorS ? (
            <div className="text-red-500 flex items-center mt-2">
              <span style={{ fontSize: "14px" }}>
                <i className="fa-solid fa-circle-exclamation mr-1"></i>
              </span>{" "}
              <span className="text-sm">{errorS}</span>
            </div>
          ) : null}
          <button type="submit" className="btn-lgsg">
            Sign Up
          </button>
        </form>
        <div className="dec-lgsg">
          <div className="font-light gdshg">or Sign up with</div>
        </div>
        <div style={{ position: "relative" }} className="my-8 ">
          <button className=" btn-lgs" onClick={loginwithgoogle}>
            <img
              style={{
                height: "20px",
                position: "absolute",
                top: "13px"
              }}
              src={google}
              alt="img"
            />
            Sign up in with Google
          </button>
          <div className="font-light text-sm mt-2">
            Your profile will be set to public automatically when you sign up.
            You can change this later in your profile settings.
          </div>
        </div>
      </div>
    </>
  );
};

const OtpVerifyForgot = ({}) => {
  const { errorO, verifyOTPforgot, tempemail, ResendOTPs, otpResend } =
    useAuth();
  const initialValues = {
    otp: ""
  };

  const questionSchema = Yup.object({
    otp: Yup.string().min(4).max(4).required("Please fill your password")
  });

  const { values, touched, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: questionSchema,
    onSubmit: (values) => {
      values.tempemail = tempemail;
      verifyOTPforgot(values);
    }
  });

  return (
    <>
      <div
        style={{
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
        }}
        className="px-14 py-10 lgsg">
        <div className="font-bold text-5xl text-center">OTP Verify</div>
        <div className="my-4 font-light text-center text-red-600">
          OTP sent to {tempemail}
        </div>
        <form onSubmit={handleSubmit}>
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
          <div className="mt-2  text-sm">
            Didn't receive OTP?
            <a
              className=" text-red-600 cursor-pointer"
              onClick={() => notify()}>
              {" "}
              Resend
            </a>
          </div>
          <div className="text-green-600 text-xs">{otpResend}</div>
          {errorO ? (
            <div className="text-red-500 flex items-center mt-2">
              <span style={{ fontSize: "14px" }}>
                <i className="fa-solid fa-circle-exclamation mr-1"></i>
              </span>{" "}
              <span className="text-sm">{errorO}</span>
            </div>
          ) : null}
          <button type="submit" className="btn-lgsg">
            Verify
          </button>
        </form>
      </div>
    </>
  );
};

const Login = ({ setsignUplogin, setforgotPotp }) => {
  const { loginwithgoogle, LoginUser, errorL, OTPForgot } = useAuth();
  const initialValues = {
    email: "",
    password: ""
  };

  const questionSchema = Yup.object({
    email: Yup.string().email().required("Please fill your email id"),
    password: Yup.string().min(5).required("Please fill your password")
  });

  const { values, touched, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: questionSchema,
    onSubmit: (values) => {
      LoginUser(values);
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div
        style={{
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
        }}
        className="px-14 py-10 lgsg">
        <div className="font-bold text-5xl text-center">LogIn</div>
        <div className="my-4 font-light text-center">
          New to this site?{" "}
          <button
            onClick={() => setsignUplogin(true)}
            style={{ color: "#3d9bdb" }}>
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="text-left">
            <label className="font-light" htmlFor="email">
              Email
            </label>
          </div>
          <input
            className={
              errors.email && touched.email
                ? "bg-ffeeee border-red-500 inp-lgsg "
                : "bg-white  inp-lgsg"
            }
            id="email"
            type="text"
            name="email"
            onChange={handleChange}
            value={values.email}
          />
          <div className="text-left mt-10">
            <label className="font-light" htmlFor="password">
              Password
            </label>
          </div>
          <div className="position-relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className={
                errors.password && touched.password
                  ? "bg-ffeeee border-red-500 inp-lgsg "
                  : "bg-white  inp-lgsg"
              }
              name="password"
              onChange={handleChange}
              value={values.password}
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
          {errorL ? (
            <div className="text-red-500 flex items-center mt-2">
              <span style={{ fontSize: "14px" }}>
                <i className="fa-solid fa-circle-exclamation mr-1"></i>
              </span>{" "}
              <span className="text-sm">{errorL}</span>
            </div>
          ) : null}
          <div className="text-sm text-left mt-2">
            <a
              onClick={
                values.email
                  ? () => {
                      setforgotPotp(true);
                      OTPForgot(values.email);
                    }
                  : () => {
                      notify2();
                    }
              }
              className="text-red-600 cursor-pointer">
              Forgot password?
            </a>
          </div>
          <button type="submit" className="btn-lgsg">
            Login
          </button>
        </form>
        <div className="dec-lgsg">
          <div className="font-light gdshg">or Login up with</div>
        </div>
        <div style={{ position: "relative" }} className="my-8 ">
          <button className=" btn-lgs" onClick={loginwithgoogle}>
            <img
              style={{
                height: "20px",
                position: "absolute",
                top: "13px"
              }}
              src={google}
              alt="img"
            />
            Log in with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default function LoginSignup() {
  const { userlogin, otpfield } = useAuth();
  const [signUplogin, setsignUplogin] = useState(false);
  const [forgotPotp, setforgotPotp] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (userlogin) {
      navigate("/test-series");
    }
  }, [userlogin]);
  return (
    <div className="flex justify-center items-center h-screen">
      {signUplogin ? (
        otpfield ? (
          <OtpVerify />
        ) : (
          <SignUp setsignUplogin={setsignUplogin} />
        )
      ) : forgotPotp ? (
        <OtpVerifyForgot />
      ) : (
        <Login setsignUplogin={setsignUplogin} setforgotPotp={setforgotPotp} />
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
}
