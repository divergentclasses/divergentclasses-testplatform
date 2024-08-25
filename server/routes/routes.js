const express = require("express")
const dotenv = require("dotenv")
const appcontroller = require('../controller/appcontroller')
const cloudinary = require('cloudinary').v2
const middleware = require('../middleware/token-manager')
const middlewareuser = require('../middleware/token-manageruser')
const passport = require("passport")
const OAuth2Strategy = require("passport-google-oauth2").Strategy
const userdb = require('../model/userSchemaG')
const COOKIE_NAME_USER = process.env.COOKIE_NAME_USER;
const User = require('../model/userSchemaG')
const MongoStore = require('connect-mongo');
const session = require('express-session');


const routes = express();
dotenv.config();

routes.use(express.urlencoded({ extended: false }));
routes.use(express.json());
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET
});
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'))

    },
    filename: function (req, file, cb) {
        const name = Date.now() + '_' + file.originalname
        cb(null, name)
    }
})
const upload = multer({ storage: storage })
routes.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
    cookie: { secure: true }
}));

routes.use(passport.initialize());
routes.use(passport.session());

passport.use(
    new OAuth2Strategy({
        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        callbackURL: "/auth/google/callback",
        scope: ["profile", "email"]
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let userE = await userdb.findOne({ email: profile.emails[0].value })
                if (!userE) {
                    userE = new userdb({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        image: profile.photos[0].value
                    });
                    await userE.save();
                    return done(null, userE)
                } else {
                    let user = await userdb.findOne({ googleId: profile.id });
                    if (!user) {
                        return done(null, false, { message: "Please use email id and password" });
                    }
                    return done(null, user)
                }

            } catch (error) {
                return done(error, null)
            }
        }
    )
)
passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userdb.findById(id); 
        done(null, user);
    } catch (error) {
        done(error);
    }
});
// initial google ouath login
routes.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
routes.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: `${process.env.FRONTEND_URI}/test-series`,
    failureRedirect: `${process.env.FRONTEND_URI}/login`
}))

routes.get("/login/sucess", async (req, res) => {

    if (req.user && req.user.googleId) {
        const user = await User.findOne({ googleId: req.user.googleId });
        if (user) {
            res.status(200).json({ message: "User login", user: user });
        } else {
            res.status(400).json({ message: "User not found in database" });
        }
    } else {
        res.status(400).json({ message: "Not Authorized" });
    }
})

routes.post("/logout", (req, res, next) => {

    try {
        req.logout(function (err) {
            if (err) { return next(err) }
            return res.status(200).json({ message: "OK" })
        })

        res.clearCookie(COOKIE_NAME_USER, {
            path: "/",
            signed: true, sameSite: 'none',
            secure: true
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
})
routes.post('/createtest', middleware.verifyToken, appcontroller.CreateTest)
routes.post('/updatetest', middleware.verifyToken, appcontroller.UpdateTest)
routes.post('/deletetest', middleware.verifyToken, appcontroller.DeleteTest)
routes.post('/uploadquestion', upload.single('questionimg'), appcontroller.UploadQuestion)
routes.post('/deletequestion', appcontroller.DeleteQuestion)
routes.post('/updatequestion', upload.single('questionimg'), appcontroller.UpdateQuestion)
routes.post('/addinstruction', appcontroller.AddInstruction)
routes.post('/adminlogin', appcontroller.AdminLogin)
routes.post('/adminlogout', appcontroller.AdminLogout)
routes.post('/conducttest', appcontroller.ConductTest)
routes.post('/usersignup', appcontroller.SignUp)
routes.post('/otpverify', appcontroller.OTPverify)
routes.post('/resendotp', appcontroller.ResendOTP)
routes.post('/userlogin', appcontroller.UserLogin)
routes.post('/otpforgot', appcontroller.OtpForgot)
routes.post('/otpverifyforgot', appcontroller.OtpVerifyForgot)
routes.post('/resetpassword', appcontroller.ResetPassword)
routes.post('/editprofile', appcontroller.EditProfile)
routes.post('/updateeotp', appcontroller.UEotp)
routes.post('/ueverifyotp', appcontroller.UEverifyOTP)
routes.post('/upnewemail', appcontroller.UpNewEmail)
routes.post('/newemailotp', appcontroller.NewEmailOTP)
routes.post('/start-exam', appcontroller.StartExam)
routes.post('/submit-examA', appcontroller.SubmitExam);
routes.post('/updatepropic', upload.single('image'), appcontroller.UpdateProPic)
routes.post('/submit-exam', appcontroller.SubmitPaper);
routes.post('/uploadsolution', upload.single('solutionimg'), appcontroller.UploadSolution);
routes.post('/updateansstatus', appcontroller.UpdateAnsStatus);
routes.post('/declarepartbresult', appcontroller.DeclareResultPartB)

routes.get('/', appcontroller.basic)
routes.get('/gettest', appcontroller.GetTest)
routes.get('/auth-status', middleware.verifyToken, appcontroller.verifyAdmin)
routes.get('/getuserdata', middlewareuser.verifyToken, appcontroller.verifyUser)
routes.get('/remaining-time', appcontroller.RemainingTime)
routes.get('/remaining-timeB', appcontroller.RemainingTimeB)
routes.get('/checksubmitpaper', appcontroller.CheckSubmitPaper)
routes.get('/checkpaperstatus', appcontroller.Checkpaperstatus)
routes.get('/showresult', appcontroller.ShowResult)
routes.get('/studentanswer', appcontroller.StudentAnswer)
routes.get('/answerdata', appcontroller.AnswerData)
routes.get('/scoreanalytics', appcontroller.ScoreAnalytics)
routes.get('/resultpartb', appcontroller.ResultPartB)


module.exports = routes;
