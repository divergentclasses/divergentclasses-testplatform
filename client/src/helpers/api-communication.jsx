import axios from "axios";

export const CreateTest = async (
  papername,
  course,
  totalmarks,
  noofquestions,
  noofsections,
  examduration
) => {
  try {
    const res = await axios.post("/createtest", {
      papername,
      course,
      totalmarks,
      noofquestions,
      noofsections,
      examduration
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const GetTest = async () => {
  try {
    const res = await axios.get("/gettest");
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
export const AnswerData = async () => {
  try {
    const res = await axios.get("/answerdata");
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const UpdateTest = async (
  papername,
  course,
  totalmarks,
  noofquestions,
  noofsections,
  examduration,
  id
) => {
  try {
    const res = await axios.post("/updatetest", {
      papername,
      course,
      totalmarks,
      noofquestions,
      noofsections,
      examduration,
      id
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteTestDetail = async (id) => {
  try {
    const res = await axios.post("/deletetest", {
      id
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const UploadQuestion = async (
  selectedType,
  ans,
  id,
  questionimg,
  marks,
  negativemarks
) => {
  try {
    const res = await axios.post(
      "/uploadquestion",
      {
        selectedType,
        ans,
        id,
        questionimg,
        marks,
        negativemarks
      },
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};
export const deleteQuestion = async (questionid, id) => {
  try {
    const res = await axios.post("/deletequestion", {
      questionid,
      id
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const UpdateQuestion = async (
  ans,
  id,
  questionimg,
  selectedType,
  questionID,
  marks,
  negativemarks
) => {
  try {
    const res = await axios.post(
      "/updatequestion",
      {
        ans,
        id,
        questionimg,
        selectedType,
        questionID,
        marks,
        negativemarks
      },
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const AddInstruction = async (instructions, id) => {
  try {
    const res = await axios.post("/addinstruction", {
      instructions,
      id
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const Adminlogin = async (username, password) => {
  try {
    const res = await axios.post("/adminlogin", {
      username,
      password
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const checkAuthStatus = async () => {
  try {
    const res = await axios.get("/auth-status");

    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const AdminLogout = async () => {
  try {
    const res = await axios.post("/adminlogout");
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const ConductTest = async (id) => {
  try {
    const res = await axios.post("/conducttest", {
      id
    });
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const getUser = async () => {
  try {
    const response = await axios.get("/login/sucess", {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const UserLogout = async () => {
  try {
    const res = await axios.post("/logout");
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const SignUp = async (email, password) => {
  try {
    const res = await axios.post("/usersignup", {
      email,
      password
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};
export const OTPverify = async (otp, tempemail) => {
  try {
    const res = await axios.post("/otpverify", {
      otp,
      tempemail
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const checkUserLogin = async () => {
  try {
    const res = await axios.get("/getuserdata");
    return res.data;
  } catch (err) {
    console.log(err.message);
  }
};
export const ResendOtp = async (tempemail) => {
  try {
    const res = await axios.post("/resendotp", {
      tempemail
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};
export const loginUser = async (email, password) => {
  try {
    const res = await axios.post("/userlogin", {
      email,
      password
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const otpForgot = async (email) => {
  try {
    const res = await axios.post("/otpforgot", {
      email
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};
export const OTPverifyforgot = async (otp, tempemail) => {
  try {
    const res = await axios.post("/otpverifyforgot", {
      otp,
      tempemail
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};
export const ResetPassword = async (npassword, cpassword, id) => {
  try {
    const res = await axios.post("/resetpassword", {
      npassword,
      cpassword,
      id
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};
export const EditProfile = async (
  name,
  mobileno,
  stream,
  exams,
  address,
  _id
) => {
  try {
    const res = await axios.post("/editprofile", {
      name,
      mobileno,
      stream,
      exams,
      address,
      _id
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};
export const UpdateEmail = async (email, id) => {
  try {
    const res = await axios.post("/updateeotp", { email, id });

    return res.data;
  } catch (err) {
    console.log(err.message);
  }
};

export const UeSendOTP = async (otp, id) => {
  try {
    const res = await axios.post("/ueverifyotp", { otp, id });

    return res.data;
  } catch (err) {
    console.log(err.message);
  }
};
export const NEWEmail = async (email, id) => {
  try {
    const res = await axios.post("/upnewemail", { email, id });

    return res.data;
  } catch (err) {
    console.log(err.message);
  }
};
export const NEOSEndOTP = async (otp, id, email) => {
  try {
    const res = await axios.post("/newemailotp", { otp, id, email });

    return res.data;
  } catch (err) {
    console.log(err.message);
  }
};
// paste backend link here
export const LoginWithGoogle = async () => {
  try {
    const res = window.open(
      `${import.meta.env.VITE_BACKEND_URL}/auth/google/callback`,
      "_self"
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const UpdatePropic = async (formData) => {
  try {
    const response = await axios.post("/updatepropic", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};
export const CheckSubmitPaper = async (PaperID, StudentID) => {
  try {
    const response = await axios.get("/checksubmitpaper", {
      params: {
        PaperID,
        studentID: StudentID
      }
    });
    return response;
  } catch (error) {
    console.log(error.message);
  }
};

export const ChecksubmitPaperStatus = async (StudentID) => {
  try {
    const response = await axios.get("/checkpaperstatus", {
      params: {
        studentID: StudentID
      }
    });
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const SubmitETest = async (PaperID, StudentID) => {
  try {
    await axios.post(`/submit-examA`, {
      PaperID,
      StudentID
    });
    const res = await axios.post(`/submit-exam`, {
      PaperID,
      StudentID
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const ShowResult = async (PaperID, StudentID) => {
  try {
    const response = await axios.get("/showresult", {
      params: { PaperID, studentID: StudentID }
    });
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const Studentanswer = async (PaperID, StudentID) => {
  try {
    const response = await axios.get("/studentanswer", {
      params: { PaperID, studentID: StudentID }
    });
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const Uploadsolution = async (
  solutionimg,
  testID,
  questionID,
  vidlink
) => {
  try {
    const response = await axios.post(
      "/uploadsolution",
      { solutionimg, testID, questionID, vidlink },
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

export const UpdateansStatus = async (
  ansstatus,
  studentID,
  testID,
  questionID,
  cmarks
) => {
  try {
    const response = await axios.post("/updateansstatus", {
      ansstatus,
      studentID,
      testID,
      questionID,
      cmarks
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading data:", error);
  }
};

export const DeclarePartBresult = async (PaperID) => {
  try {
    const response = await axios.post("/declarepartbresult", {
      PaperID
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading data:", error);
  }
};

export const scoreAnalytics = async () => {
  try {
    const response = await axios.get("/scoreanalytics");
    return response.data;
  } catch (error) {
    console.error("Error uploading data:", error);
  }
};

export const ResultpartB = async (StudentID, PaperID) => {
  try {
    const response = await axios.get("/resultpartb", {
      params: { PaperID, studentID: StudentID }
    });
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    // Request full-screen mode
    const elem = document.getElementById("fullscreen-container"); // Fullscreen the entire document
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      // Firefox
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      // Chrome, Safari, Opera
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      // IE/Edge
      elem.msRequestFullscreen();
    }
  } else {
    // Exit full-screen mode
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      // Chrome, Safari, Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE/Edge
      document.msExitFullscreen();
    }
  }
};
