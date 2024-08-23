import { Route, Routes } from "react-router-dom";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import UploadTest from "./components/uploadtest";
import UploadQuestions from "./components/uploadquestions";
import TestStd from "./components/teststd";
import Instruction from "./components/instruction";
import TestPaper from "./components/testpaper";
import AdminLogin from "./components/adminlogin";
import LoginSignup from "./components/login";
import ResetPassword from "./components/resetpassword";
import Result from "./components/result";
import Analytics from "./components/analytics";
import { PrivateRoute } from "./components/PrivateRoute";
import UserProfile from "./components/profile";
import { ProfileRoute } from "./components/profileRoute";
import SubmitPage from "./components/SubmitPage";
import Solutions from "./components/solutions";
import StudentAnalysis from "./components/studentanalysis";
import StudentResults from "./components/studentresult";
import StudentAnswer from "./components/studentanswer";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<TestStd />}></Route>
        <Route
          path="/uploadtest"
          element={
            <PrivateRoute>
              <UploadTest />
            </PrivateRoute>
          }></Route>
        <Route path="/adminlogin" element={<AdminLogin />}></Route>
        <Route
          path="/uploadquestions/:id"
          element={<UploadQuestions />}></Route>
        <Route path="/test-series" element={<TestStd />}></Route>
        <Route path="/instructions/:id" element={<Instruction />}></Route>
        <Route path="/testpaper/:id" element={<TestPaper />}></Route>
        <Route path="/login" element={<LoginSignup />}></Route>
        <Route path="/reset-password/:id" element={<ResetPassword />}></Route>
        <Route path="/result/:id" element={<Result />}></Route>
        <Route path="/analytics/:id" element={<Analytics />}></Route>
        <Route path="/profile" element={<UserProfile />}></Route>
        <Route path="/submitpage" element={<SubmitPage />}></Route>
        <Route
          path="/solutions/:studentID/:testID"
          element={<Solutions />}></Route>
        <Route
          path="/studentanalysis"
          element={
            <PrivateRoute>
              <StudentAnalysis />
            </PrivateRoute>
          }></Route>
        <Route
          path="/studentresult/:id"
          element={
            <PrivateRoute>
              <StudentResults />
            </PrivateRoute>
          }></Route>
        <Route
          path="/studentanswer/:studentID/:testID"
          element={
            <PrivateRoute>
              <StudentAnswer />
            </PrivateRoute>
          }></Route>
      </Routes>
    </>
  );
}

export default App;
