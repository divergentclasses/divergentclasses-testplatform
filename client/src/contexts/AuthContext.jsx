import { createContext, useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  CreateTest,
  GetTest,
  UpdateTest,
  deleteTestDetail,
  UploadQuestion,
  deleteQuestion,
  UpdateQuestion,
  AddInstruction,
  Adminlogin,
  checkAuthStatus,
  AdminLogout,
  ConductTest,
  getUser,
  UserLogout,
  LoginWithGoogle,
  SignUp,
  OTPverify,
  checkUserLogin,
  ResendOtp,
  loginUser,
  otpForgot,
  OTPverifyforgot,
  ResetPassword,
  EditProfile,
  UpdateEmail,
  UeSendOTP,
  NEWEmail,
  NEOSEndOTP,
  UpdatePropic,
  CheckSubmitPaper,
  SubmitETest,
  ChecksubmitPaperStatus,
  ShowResult,
  Uploadsolution,
  AnswerData,
  Studentanswer,
  UpdateansStatus,
  DeclarePartBresult,
  scoreAnalytics,
  ResultpartB
} from "../helpers/api-communication";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [tests, setTests] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorl, setErrorl] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [userdata, setUserdata] = useState({});
  const [userlogin, setuserlogin] = useState(false);
  const [errorS, setErrorS] = useState(null);
  const [errorO, setErrorO] = useState(null);
  const [otpfield, setotpfield] = useState(false);
  const [tempemail, settempemail] = useState(null);
  const [otpResend, setOtpResend] = useState(null);
  const [errorL, setErrorL] = useState(null);
  const [ErrorReset, setErrorReset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState();
  const [refresh, setRefresh] = useState();
  const [submitStatus, setSubmitStatus] = useState(null);
  const [btnStatus, setbtnStatus] = useState(null);
  const [StudentAns, setStudentAns] = useState(null);
  const PaperID = localStorage.getItem("testId");
  const StudentID = localStorage.getItem("studentID");

  useEffect(() => {
    async function GetStudentAns() {
      try {
        const data = await AnswerData();
        if (data) {
          setStudentAns(data);
        }
      } catch (err) {}
    }
    GetStudentAns();
    async function checkStatus() {
      try {
        const data = await checkAuthStatus();
        if (data) {
          setAdmin({
            username: data.username,
            id: data.id
          });
          setIsLoggedIn(true);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, []);

  useEffect(() => {
    async function checkUserStatus() {
      try {
        const data = await checkUserLogin();
        if (data) {
          setUserdata(data.data);
          setuserlogin(true);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }

      try {
        const data = await getUser();
        if (data) {
          setUserdata(data.user);
          setuserlogin(true);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    checkUserStatus();
  }, [state]);

  useEffect(() => {
    async function Gettest() {
      try {
        const data = await GetTest();
        if (data) {
          setTests(data);
          setActiveSection(
            ["NAT", "MSQ", "MCQ"].filter((type) =>
              [
                ...new Set(
                  data
                    ?.filter(
                      (item) => item._id === localStorage.getItem("testId")
                    )[0]
                    .questions.map((q) => q.selectedType)
                    .filter((type) => ["NAT", "MSQ", "MCQ"].includes(type))
                )
              ].includes(type)
            )[0]
          );
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    Gettest();
  }, [refresh]);
  useEffect(() => {
    const fetchSubmitStatus = async () => {
      try {
        const response = await CheckSubmitPaper(PaperID, StudentID);
        const { TestID, SubmitPaper } = response.data;
        setSubmitStatus({ TestID, SubmitPaper });
      } catch (error) {
        console.error("Error fetching submit status:", error);
      }
    };

    fetchSubmitStatus();
  }, []);

  useEffect(() => {
    const submitPaperStatus = async () => {
      try {
        const res = await ChecksubmitPaperStatus(StudentID);
        setbtnStatus(res.result);
        // console.log(res.result);
      } catch (error) {
        console.error("Error fetching submit status:", error);
      }
    };
    submitPaperStatus();
  }, [StudentID]);

  const testdetails = async ({
    papername,
    course,
    totalmarks,
    noofquestions,
    noofsections,
    examduration
  }) => {
    const res = await CreateTest(
      papername,
      course,
      totalmarks,
      noofquestions,
      noofsections,
      examduration
    );

    if (res.message) {
      setRefresh(res.message);
    }
  };

  const UpdateTestDetail = async ({
    papername,
    course,
    totalmarks,
    noofquestions,
    noofsections,
    examduration,
    id
  }) => {
    const res = await UpdateTest(
      papername,
      course,
      totalmarks,
      noofquestions,
      noofsections,
      examduration,
      id
    );
    if (res.message) {
      setRefresh(res.message);
    }
  };

  const deleteTest = async (id) => {
    const res = await deleteTestDetail(id);
    if (res.message) {
      setRefresh(res.message);
    }
  };

  const questions = async ({
    ans,
    id,
    questionimg,
    selectedType,
    marks,
    negativemarks
  }) => {
    const res = await UploadQuestion(
      selectedType,
      ans,
      id,
      questionimg,
      marks,
      negativemarks
    );
    if (res.message) {
      setRefresh(res.message);
    }
  };
  const deletequestion = async (questionid, id) => {
    const res = await deleteQuestion(questionid, id);
    if (res.message) {
      setRefresh(res.message);
    }
  };

  const Updatequestions = async ({
    ans,
    id,
    questionimg,
    selectedType,
    questionID,
    marks,
    negativemarks
  }) => {
    const res = await UpdateQuestion(
      ans,
      id,
      questionimg,
      selectedType,
      questionID,
      marks,
      negativemarks
    );
    if (res.message) {
      setRefresh(res.message);
    }
  };

  const addinstructions = async ({ instructions, id }) => {
    await AddInstruction(instructions, id);
  };

  const adminlogin = async ({ username, password }) => {
    const res = await Adminlogin(username, password);
    if (res.error) {
      setErrorl(res.error);
    } else {
      setIsLoggedIn(true);
      window.location.href = "/uploadtest";
    }
  };

  const Adminlogout = async () => {
    const res = await AdminLogout();
    if (res) {
      window.location.href = "/adminlogin";
    }
  };

  const Conducttest = async (id) => {
    const res = await ConductTest(id);
  };

  const logout = async () => {
    const res = await UserLogout();
    if (res) {
      window.location.href = "/test-series";
    }
  };

  const loginwithgoogle = async () => {
    await LoginWithGoogle();
  };

  const signup = async ({ email, password }) => {
    const res = await SignUp(email, password);
    if (res.error) {
      setErrorS(res.error);
    } else {
      settempemail(res.email);
      setotpfield(true);
    }
  };

  const verifyOTP = async ({ otp, tempemail }) => {
    const res = await OTPverify(otp, tempemail);
    if (res.error) {
      setErrorO(res.error);
    } else {
      setuserlogin(true);
      window.location.href = "/test-series";
    }
  };

  const ResendOTPs = async (tempemail) => {
    const res = await ResendOtp(tempemail);
    if (res) {
      setOtpResend(res.resend);
    }
  };

  const LoginUser = async ({ email, password }) => {
    const res = await loginUser(email, password);
    if (res.error) {
      setErrorL(res.error);
    } else {
      setuserlogin(true);
      window.location.href = "/test-series";
    }
  };

  const OTPForgot = async (email) => {
    const res = await otpForgot(email);
    if (res) {
      settempemail(res.email);
    }
  };
  const verifyOTPforgot = async ({ otp, tempemail }) => {
    const res = await OTPverifyforgot(otp, tempemail);
    if (res.error) {
      setErrorO(res.error);
    } else {
      window.location.href = `/reset-password/${res.id}`;
    }
  };

  const ResetPass = async ({ npassword, cpassword, id }) => {
    const res = await ResetPassword(npassword, cpassword, id);
    if (res.error) {
      setErrorReset(res.error);
    } else {
      window.location.href = `/login`;
    }
  };

  const editProfile = async ({
    name,
    mobileno,
    stream,
    exams,
    address,
    _id
  }) => {
    const res = await EditProfile(name, mobileno, stream, exams, address, _id);
    if (res) {
      setState(res.message);
    }
  };
  const updateEmail = async (email, id) => {
    const res = await UpdateEmail(email, id);
    if (res) {
    }
  };
  const [modalIsOpen, setIsOpen] = useState(false);
  function openModalUE() {
    setIsOpen(true);
  }
  function closeModalUE() {
    setIsOpen(false);
  }
  const [modalIsOpenNE, setIsOpenNE] = useState(false);
  function openModalNE() {
    setIsOpenNE(true);
  }
  function closeModalNE() {
    setIsOpenNE(false);
  }
  const UEsendOTP = async ({ otp, id }) => {
    const res = await UeSendOTP(otp, id);
    if (res.error) {
      setErrorO(res.error);
    } else {
      closeModalUE();
      openModalNE();
    }
  };
  const [modalIsOpenNEO, setIsOpenNEO] = useState(false);
  function openModalNEO() {
    setIsOpenNEO(true);
  }
  function closeModalNEO() {
    setIsOpenNEO(false);
  }

  const [ErrorExist, setErrorEXIST] = useState();
  const [newtempemail, setnewtempemail] = useState();
  const NEWemail = async ({ email, id }) => {
    const res = await NEWEmail(email, id);
    if (res.message) {
      setnewtempemail(res.message);
      closeModalNE();
      openModalNEO();
    } else {
      setErrorEXIST(res.error);
    }
  };

  const NEOsendOTP = async ({ otp, id, email }) => {
    const res = await NEOSEndOTP(otp, id, email);
    if (res.error) {
      setErrorO(res.error);
    } else {
      closeModalNEO();
      setState(res.message);
    }
  };

  const [dataclick, setdataclick] = useState();
  const clickData = (data) => {
    setdataclick(data);
  };

  const setTestID = (id) => {
    localStorage.setItem("testId", id);
  };
  const [activeSection, setActiveSection] = useState();
  const [currentSliceIndex, setCurrentSliceIndex] = useState(0);
  const onUpdateQuestion = (data) => {
    setCurrentSliceIndex(data);
  };
  const [part, setpart] = useState(true);
  const SubmitPartA = () => {
    setpart(false);
  };
  useEffect(() => {
    setCurrentSliceIndex(0);
  }, [activeSection, part]);

  const Updatepropic = async (formData) => {
    const res = await UpdatePropic(formData);
  };

  const SubmitTest = async () => {
    const res = await SubmitETest(PaperID, StudentID);
    console.log(res);
    if (res.success) {
      window.location.href = "/submitpage";
    }
  };
  const [TimeTaken, setTimeTaken] = useState();
  const [Result, setResult] = useState();
  const [activesolSection, setactivesolSection] = useState();

  const showResult = async (StudentID, testID) => {
    try {
      const res = await ShowResult(testID, StudentID);

      if (res) {
        setTimeTaken(res.TimeTaken);
        setResult(res.answerStatus);
        // console.log(res.answerStatus);

        const data = res.answerStatus.filter((k) => k.selectedType === "MSQ");

        data.forEach((question) => {
          const { answer, correctAnswer } = question;
          const allFalse = Object.values(answer).every(
            (value) => value === false
          );
          if (allFalse) {
            question.status = "skipped";
            return;
          }
          const convertedCorrectAnswer = {};
          for (let key in correctAnswer) {
            convertedCorrectAnswer[key] = correctAnswer[key] === "true";
          }

          let isIncorrect = false;
          let correctCount = 0;
          let trueMatchCount = 0;

          for (let key in answer) {
            if (answer[key] && !convertedCorrectAnswer[key]) {
              isIncorrect = true;
              break;
            }
            if (answer[key] === convertedCorrectAnswer[key]) {
              correctCount++;
              if (answer[key] === true) {
                trueMatchCount++;
              }
            }
          }

          if (isIncorrect) {
            question.status = "incorrect";
          } else if (
            correctCount > 0 &&
            correctCount < Object.keys(answer).length
          ) {
            question.status = "pcorrect";
            question.trueMatchCount = trueMatchCount;
          } else {
            question.status = "correct";
          }
        });
        setactivesolSection(
          [...new Set(res.answerStatus.map((item) => item.selectedType))][0]
        );
      }
    } catch (err) {}
  };

  const UploadSolution = ({ solutionimg, testID, questionID, vidlink }) => {
    const res = Uploadsolution(solutionimg, testID, questionID, vidlink);
  };

  const StudentAnswer = async (StudentID, testID) => {
    try {
      const res = await Studentanswer(testID, StudentID);

      if (res) {
        setResult(res.answerStatus);
        console.log(res.answerStatus);

        const data = res.answerStatus.filter((k) => k.selectedType === "MSQ");

        data.forEach((question) => {
          const { answer, correctAnswer } = question;
          const allFalse = Object.values(answer).every(
            (value) => value === false
          );
          if (allFalse) {
            question.status = "skipped";
            return;
          }
          const convertedCorrectAnswer = {};
          for (let key in correctAnswer) {
            convertedCorrectAnswer[key] = correctAnswer[key] === "true";
          }

          let isIncorrect = false;
          let correctCount = 0;
          let trueMatchCount = 0;

          for (let key in answer) {
            if (answer[key] && !convertedCorrectAnswer[key]) {
              isIncorrect = true;
              break;
            }
            if (answer[key] === convertedCorrectAnswer[key]) {
              correctCount++;
              if (answer[key] === true) {
                trueMatchCount++;
              }
            }
          }

          if (isIncorrect) {
            question.status = "incorrect";
          } else if (
            correctCount > 0 &&
            correctCount < Object.keys(answer).length
          ) {
            question.status = "pcorrect";
            question.trueMatchCount = trueMatchCount;
          } else {
            question.status = "correct";
          }
        });
        setactivesolSection(
          [...new Set(res.answerStatus.map((item) => item.selectedType))][0]
        );
      }
    } catch (err) {}
  };

  const UpdateAnsStatus = async ({
    ansstatus,
    studentID,
    testID,
    questionID,
    cmarks
  }) => {
    const res = await UpdateansStatus(
      ansstatus,
      studentID,
      testID,
      questionID,
      cmarks
    );
    if (res) {
      // StudentAnswer(studentID, testID);
    }
  };

  const DeclarePartBResult = async (PaperID) => {
    const res = await DeclarePartBresult(PaperID);
  };
  const [ResultPartB, setResultpartB] = useState();
  const [scoreData, SetscoreData] = useState();
  useEffect(() => {
    const ScoreAnalytics = async () => {
      const res = await scoreAnalytics();
      if (res.data) {
        SetscoreData(res.data);
      }
      if (res.data?.find((k) => k.PaperID === PaperID)?.DeclaredresultpartB) {
      }
    };

    ScoreAnalytics();
  }, [localStorage.getItem("testId")]);

  const ResultpartBfun = async (StudentID, PaperID) => {
    const response = await ResultpartB(StudentID, PaperID);

    if (response) {
      console.log(response.answerStatus);
      setResultpartB(response.answerStatus);
    }
  };

  const [buttonload, setbuttonload] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        buttonload,
        setbuttonload,
        ResultpartBfun,
        ResultPartB,
        scoreData,
        DeclarePartBResult,
        UpdateAnsStatus,
        StudentAnswer,
        StudentAns,
        UploadSolution,
        activesolSection,
        setactivesolSection,
        TimeTaken,
        Result,
        showResult,
        btnStatus,
        SubmitTest,
        submitStatus,
        part,
        SubmitPartA,
        Updatepropic,
        ErrorExist,
        NEOsendOTP,
        modalIsOpenNEO,
        closeModalNEO,
        newtempemail,
        NEWemail,
        modalIsOpenNE,
        closeModalNE,
        modalIsOpen,
        openModalUE,
        closeModalUE,
        UEsendOTP,
        updateEmail,
        editProfile,
        activeSection,
        setActiveSection,
        setTestID,
        onUpdateQuestion,
        currentSliceIndex,
        setCurrentSliceIndex,
        loading,
        testdetails,
        dataclick,
        tests,
        UpdateTestDetail,
        deleteTest,
        questions,
        deletequestion,
        Updatequestions,
        addinstructions,
        adminlogin,
        isLoggedIn,
        errorl,
        admin,
        Adminlogout,
        Conducttest,
        userdata,
        logout,
        userlogin,
        loginwithgoogle,
        signup,
        otpfield,
        errorS,
        verifyOTP,
        errorO,
        tempemail,
        ResendOTPs,
        otpResend,
        LoginUser,
        errorL,
        OTPForgot,
        verifyOTPforgot,
        ResetPass,
        ErrorReset,
        clickData
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
