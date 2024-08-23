import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SpinnerLoader from "./spinnerloader";

const ProfileRoute = ({ children }) => {
  const { userlogin, loading } = useAuth();

  if (loading) {
    return (
      <div>
        <SpinnerLoader />
      </div>
    );
  }

  return userlogin ? children : <Navigate to="/login" />;
};

export { ProfileRoute };
