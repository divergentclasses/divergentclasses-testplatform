import React, { useEffect } from "react";
import { useFormik, Field } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const { adminlogin, isLoggedIn, errorl, admin } = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      return navigate("/uploadtest");
    }
  }, [isLoggedIn]);

  const initialValues = {
    username: "",
    password: ""
  };

  const adminSchema = Yup.object({
    username: Yup.string().min(1).required("Please fill the above field"),
    password: Yup.string().required("Please fill the above field")
  });

  const { values, touched, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: adminSchema,
    onSubmit: (values) => {
      adminlogin(values);
    }
  });

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="ad-login">
        <div className="ad-txt">Admin login</div>
        <form className="py-2" onSubmit={handleSubmit}>
          <label className="text-sm flex items-center" htmlFor="username">
            <i className="fa-solid fa-circle-user mr-1"></i> Username
          </label>
          <input
            className={
              errors.username && touched.username
                ? "bg-ffeeee border-red-500 inpt-pt npt"
                : "bg-white inpt-pt npt"
            }
            id="username"
            type="text"
            name="username"
            placeholder="Username"
            value={values.username}
            onChange={handleChange}
          />
          <label className="text-sm flex items-center" htmlFor="password">
            <i className="fa-solid fa-key mr-1"></i>Password
          </label>
          <input
            className={
              errors.password && touched.password
                ? "bg-ffeeee border-red-500 inpt-pt npt"
                : "bg-white inpt-pt npt"
            }
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
          />
          {errorl ? (
            <div className="text-red-500 flex items-center my-1">
              <span style={{ fontSize: "7px" }}>
                <i className="fa-solid fa-circle mr-1"></i>
              </span>{" "}
              <span className="text-sm">{errorl}</span>
            </div>
          ) : null}
          <div className="text-right">
            <button
              type="submit"
              style={{ width: "170px" }}
              className="btn-sub">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
