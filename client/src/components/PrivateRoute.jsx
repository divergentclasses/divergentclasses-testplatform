import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SpinnerLoader from "./spinnerloader";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div>
        <SpinnerLoader />
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/adminlogin" />;
};

export { PrivateRoute };
