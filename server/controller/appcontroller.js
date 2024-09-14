const Test = require('../model/ttmodal');
const cloudinary = require('cloudinary').v2
const Admin = require('../model/adminSchema')
const COOKIE_NAME = process.env.COOKIE_NAME;
const jwt = require('jsonwebtoken')
const User = require('../model/userSchemaG')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const COOKIE_NAME_USER = process.env.COOKIE_NAME_USER;
const Answer = require('../model/answers');
const Result = require('../model/result');

const OAuth2 = google.auth.OAuth2;

async function createTransporter() {
    const oauth2Client = new OAuth2(
        process.env.CLIENTID,
        process.env.CLIENTSECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESHTOKEN
    });

    try {
        const { token } = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.USER,
                clientId: process.env.CLIENTID,
                clientSecret: process.env.CLIENTSECRET,
                refreshToken: process.env.REFRESHTOKEN,
                accessToken: token
            }
        });

        return transporter;
    } catch (error) {
        console.error('Error creating transporter:', error);
        throw error;
    }
}

const basic = (req, res) => {
    res.send('hello from server')
}
const createToken = (id, username, expiresIn) => {
    const payload = { id, username }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
    });
    return token;
}

const CreateTest = async (req, res) => {
    try {
        const { papername, course, noofquestions, noofsections, examduration, totalmarks, } = req.body;

        const newTest = new Test({
            paper_name: papername,
            course,
            totalmarks,
            no_of_questions: noofquestions,
            no_of_sections: noofsections,
            exam_duration: examduration,
        });
        await newTest.save();
        let min = 1111;
        let max = 9999;
        let step1 = max - min + 1
        let code = Math.floor((Math.random() * step1) + min);

        return res.status(200).json({ message: code })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}
const UpdateTest = async (req, res) => {
    try {
        const { id, papername, course, totalmarks, noofquestions, noofsections, examduration } = req.body;
        const update = {
            paper_name: papername,
            course, totalmarks,
            no_of_questions: noofquestions,
            no_of_sections: noofsections,
            exam_duration: examduration,
        }
        const tests = await Test.findByIdAndUpdate(id, update, { new: true })

        if (!tests) {
            return res.status(401).send("Something went wrong!!");
        } else {
            let min = 1111;
            let max = 9999;
            let step1 = max - min + 1
            let code = Math.floor((Math.random() * step1) + min);
            return res.status(200).json({ message: code })
        }
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}
const DeleteTest = async (req, res) => {
    try {
        const { id } = req.body;
        const tests = await Test.findByIdAndDelete(id);
        if (!tests) {
            return res.status(401).send("Something went wrong!!");
        }
        let min = 1111;
        let max = 9999;
        let step1 = max - min + 1
        let code = Math.floor((Math.random() * step1) + min);
        return res.status(200).json({ message: code, tests })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const GetTest = async (req, res) => {
    try {
        const tests = await Test.find({});
        if (!tests) {
            return res.status(401).send("Something went wrong!!");
        } else {
            return res.status(200).json(tests)
        }


    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const UploadQuestion = async (req, res) => {
    try {
        const { selectedType, ans, id, marks, negativemarks } = req.body;
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: process.env.CLOUDINARY_NAME,
            resource_type: 'auto'
        });
        const UploadQuestion = await Test.findOne({ _id: id })

        UploadQuestion.questions = [...UploadQuestion.questions
            , {
            question: result.secure_url,
            selectedType,
            ans, marks, negativemarks
        }];
        await UploadQuestion.save();
        let min = 1111;
        let max = 9999;
        let step1 = max - min + 1
        let code = Math.floor((Math.random() * step1) + min);
        return res.status(200).json({ message: code })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const DeleteQuestion = async (req, res) => {
    try {
        const { questionid, id } = req.body;

        await Test.findByIdAndUpdate(
            id,
            { $pull: { questions: { _id: questionid } } },
            { new: true }
        );
        let min = 1111;
        let max = 9999;
        let step1 = max - min + 1
        let code = Math.floor((Math.random() * step1) + min);
        return res.status(200).json({ message: code })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const UpdateQuestion = async (req, res) => {
    try {
        const { questionID, id, selectedType, ans, marks, negativemarks } = req.body;
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: process.env.CLOUDINARY_NAME,
            resource_type: 'auto'
        });

        const updates = {
            question: result.secure_url,
            selectedType,
            ans, marks, negativemarks
        }

        const test = await Test.findOneAndUpdate(
            { _id: id, "questions._id": questionID },
            { $set: { "questions.$": updates } },
            { new: true, useFindAndModify: false }
        );
        let min = 1111;
        let max = 9999;
        let step1 = max - min + 1
        let code = Math.floor((Math.random() * step1) + min);
        return res.status(200).json({ message: code })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const AddInstruction = async (req, res) => {
    try {
        const { instructions, id } = req.body;
        const tests = await Test.findByIdAndUpdate(id, { marking_scheme_instructions: instructions }, { new: true })

        if (!tests) {
            return res.status(401).send("Something went wrong!!");
        }
        return res.status(200)


    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const AdminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Admin.findOne({ username: username })
        if (user) {
            if (user.password === password) {
                const expires = new Date();
                expires.setDate(expires.getDate() + 7)
                const token = createToken(user._id.toString(), user.username, "7d")
                res.cookie(COOKIE_NAME, token, {
                    path: "/", expires,
                    signed: true,
                    sameSite: 'none',
                    secure: true

                })
                return res.status(200).json({ message: "OK" })
            } else {
                errorMessage = 'You are not authorized to login!';
                return res.send({ error: errorMessage });
            }
        } else {
            errorMessage = 'You are not authorized to login!';
            return res.send({ error: errorMessage });
        }
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}
const verifyAdmin = async (req, res) => {
    try {

        const user = await Admin.findById(res.locals.jwtData.id)
        if (!user) {
            return res.status(401).send("Admin not registred OR Token Malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Premissions didn't match");
        }

        return res.status(200).json({
            message: "OK", id: user._id.toString(), username: user.username
        })
    } catch (err) {
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}
const AdminLogout = (req, res) => {
    try {
        res.clearCookie(COOKIE_NAME, {
            path: "/",
            signed: true,
        })
        return res.status(200).json({ message: "OK" })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const ConductTest = async (req, res) => {
    try {
        const { id } = req.body;

        const update = {
            status: "live",
            conduct_time: new Date()
        }
        const tests = await Test.findByIdAndUpdate(id, update, { new: true })

        if (!tests) {
            return res.status(401).send("Something went wrong!!");
        }

        const newTest = new Answer({
            PaperID: id
        });
        await newTest.save();
        return res.status(200)
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const SignUp = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        let min = 1111;
        let max = 9999;
        let step1 = max - min + 1
        let otpcode = Math.floor((Math.random() * step1) + min);

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            let errorMessage = '';
            if (existingUser.email === email) {
                errorMessage = 'Email already exists';
            }
            return res.send({ error: errorMessage });
        } else {
            const newUser = new User({
                email, password: hashedPassword, otp: otpcode
            });
            await newUser.save();
            sendOTP(email, otpcode)
            setTimeout(async () => {
                await User.findOneAndDelete({ email: email })
            }, 1800000)


            return res.status(200).json({ message: "OK", email: email })

        }
    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}


const OTPverify = async (req, res) => {
    try {

        const { otp, tempemail } = req.body;
        const newUser = await User.findOne({ email: tempemail })

        if (newUser.otp === otp.toString()) {
            const expires = new Date();
            expires.setDate(expires.getDate() + 7)
            const token = createToken(newUser._id.toString(), newUser.email, "7d")
            res.cookie(COOKIE_NAME_USER, token, {
                path: "/", expires,
                signed: true, sameSite: 'none',
                secure: true

            })


            await User.updateOne({ email: tempemail }, {
                $set: {
                    isVerifiedEmail: true
                }
            });

            return res.status(200).json({ message: "OK" })
        } else {
            let errorMessage = 'Incorrect OTP';
            return res.send({ error: errorMessage });
        }



    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const ResendOTP = async (req, res) => {
    try {

        const { tempemail } = req.body;
        let min = 1111;
        let max = 9999;
        let step1 = max - min + 1
        let otpcode = Math.floor((Math.random() * step1) + min);

        const userExist = await User.findOneAndUpdate({ email: tempemail },
            { $set: { "otp": otpcode } },
            { new: true });

        if (userExist) {
            sendOTP(tempemail, otpcode)
            const message = "otp resent"
            return res.send({ resend: message });
        }

    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const verifyUser = async (req, res) => {
    try {
        const user = await User.findById(res.locals.jwtDataUser.id)
        if (!user) {
            return res.status(401).send("User not registred OR Token Malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtDataUser.id) {
            return res.status(401).send("Premissions didn't match");
        }

        return res.status(200).json({
            message: "OK", data: user
        })
    } catch (err) {
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            errorMessage = 'User not found';
            return res.send({ error: errorMessage });
        } else if (!user.isVerifiedEmail) {
            errorMessage = 'User not found';
            return res.send({ error: errorMessage });
        } else {
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                errorMessage = 'Incorrect password';
                return res.send({ error: errorMessage });
            }
            const expires = new Date();
            expires.setDate(expires.getDate() + 7)
            const token = createToken(user._id.toString(), user.email, "7d")
            res.cookie(COOKIE_NAME_USER, token, {
                path: "/", expires,
                signed: true,
                sameSite: 'none',
                secure: true

            })
            return res.status(200).json({ message: "OK" })
        }

    } catch (err) {
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const OtpForgot = async (req, res) => {
    try {
        const { email } = req.body;
        let min = 1111;
        let max = 9999;
        let step1 = max - min + 1
        let otpcode = Math.floor((Math.random() * step1) + min);

        const user = await User.findOneAndUpdate({ email: email }, {
            $set: { otp: otpcode }
        }, { new: true })

        sendOTP(email, otpcode);
        return res.status(200).json({ message: "OK", email: email })
    } catch (err) {
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }

}
const OtpVerifyForgot = async (req, res) => {
    try {
        const { otp, tempemail } = req.body;
        const newUser = await User.findOne({ email: tempemail })
        console.log(newUser.otp)
        console.log(otp)

        if (newUser.otp === otp.toString()) {
            return res.status(200).json({ message: "OK", id: newUser._id })
        } else {
            let errorMessage = 'Incorrect OTP';
            return res.send({ error: errorMessage });
        }

    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const ResetPassword = async (req, res) => {
    try {
        const { npassword, cpassword, id } = req.body;

        if (npassword !== cpassword) {
            let errorMessage = 'Both password do not match';
            return res.send({ error: errorMessage });
        } else {
            const hashedPassword = await bcrypt.hash(npassword, 10);
            const Update = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true })

            if (Update) {
                return res.status(200).json({ message: "OK" })
            }
        }

    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const EditProfile = async (req, res) => {
    try {
        const { name, mobileno, stream, exams, address, _id } = req.body
        const update = {
            displayName: name,
            mobileno, stream,
            exams,
            address,
        }
        const updateProfile = await User.findByIdAndUpdate(_id, update, { new: true })

        if (!updateProfile) {
            return res.status(401).send("Something went wrong!!");
        }
        let min = 1111;
        let max = 9999;
        let step1 = max - min + 1
        let code = Math.floor((Math.random() * step1) + min);
        return res.status(200).json({ message: code })
    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const UEotp = async (req, res) => {
    try {
        const { email, id } = req.body;
        let min = 1111;
        let max = 9999;
        let step1 = max - min + 1
        let otpcode = Math.floor((Math.random() * step1) + min);
        const update = {
            otp: otpcode,
        }
        const Update = await User.findByIdAndUpdate(id, update, { new: true })
        if (!Update) {
            return res.status(401).send("Something went wrong!!");
        } else {
            sendOTP(email, otpcode)
        }
        return res.status(200)


    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}
const UEverifyOTP = async (req, res) => {
    try {
        const { otp, id } = req.body;
        const newUser = await User.findOne({ _id: id })

        if (newUser.otp === otp.toString()) {
            return res.status(200).json({ message: "OK" })
        } else {
            let errorMessage = 'Incorrect OTP';
            return res.send({ error: errorMessage });
        }

    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}
const UpNewEmail = async (req, res) => {
    try {
        const { email, id } = req.body;
        let min = 1111;
        let max = 9999;
        let step1 = max - min + 1
        let otpcode = Math.floor((Math.random() * step1) + min);
        const update = {
            otp: otpcode,
        }
        const find = await User.findOne({ email })
        if (find) {
            let errorMessage = 'Email already exist';
            return res.send({ error: errorMessage });
        } else {
            const Update = await User.findByIdAndUpdate(id, update, { new: true })
            if (!Update) {
                return res.status(401).send("Something went wrong!!");
            } else {
                sendOTP(email, otpcode)
            }
            return res.status(200).json({ message: email })
        }

    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const NewEmailOTP = async (req, res) => {
    try {
        const { otp, id, email } = req.body;
        const newUser = await User.findOne({ _id: id })
        let min = 1111;
        let max = 9999;
        let step1 = max - min + 1
        let code = Math.floor((Math.random() * step1) + min);

        if (newUser.otp === otp.toString()) {

            const update = {
                email: email,
            }
            const Update = await User.findByIdAndUpdate(id, update, { new: true })
            if (!Update) {
                return res.status(401).send("Something went wrong!!");
            }
            return res.status(200).json({ message: code })
        } else {
            let errorMessage = 'Incorrect OTP';
            return res.send({ error: errorMessage });
        }

    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}
const sendOTP = async (email, otpcode) => {
    const mailOptions = {
        from: 'devansh@divergentclasses.com',
        to: email,
        subject: 'Email otp verification',
        html: `<p>Thank you to join divergent classes. Your OTP for email verification is <b>${otpcode}</b></p>`
    };
    const transporter = await createTransporter();
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
        } else {
            // console.log('Email sent:', info.response);
        }
    });
}

const StartExam = async (req, res) => {
    const { testID, studentID, duration, email } = req.body;

    try {
        let exam = await Answer.findOne({ 'PaperID': testID });

        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        let student = exam.Participants.Students.find(s => s.studentID === studentID);

        const durationB = 60;
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + duration * 60000);
        const startTimeB = new Date(startTime.getTime() + duration * 60000)
        const endTimeB = new Date(startTime.getTime() + duration * 60000 + durationB * 60000)

        if (!student) {
            student = {
                studentID: studentID,
                email: email,
                answers: [],
                startTime: startTime,
                endTime: endTime,
                duration: duration,
                Noofattempt: "",
                SubmitPartA: false,
                AttemptedOn: new Date(),
                startTimeB: startTimeB,
                endTimeB: endTimeB,
                durationB: durationB,
                SubmitPaper: false,
            };
            exam.Participants.Students.push(student);
        }
        await exam.save();
        // if (!student.SubmitPartA && startTime >= student.endTime) {
        //     student.startTime = startTime;
        //     student.endTime = endTime;
        //     student.duration = duration;

        //     await exam.save();
        // }
        return res.json({ examId: exam._id, endTime });

    } catch (error) {
        console.error('Failed to start exam:', error);
        res.status(500).json({ error: 'Failed to start exam' });
    }


}

const SubmitExam = async (req, res) => {
    const { PaperID, StudentID } = req.body;

    try {
        const result = await Answer.findOneAndUpdate(
            { 'PaperID': PaperID, 'Participants.Students.studentID': StudentID },
            { $set: { 'Participants.Students.$.SubmitPartA': true } },
            { new: true }
        );

        if (result) {
            res.status(200).json({ message: 'Part A submitted successfully.' });
        } else {
            res.status(404).json({ message: 'Submission failed. Student or Paper not found.' });
        }
    } catch (err) {
        console.error('Error submitting Part A:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }

}

const RemainingTime = async (req, res) => {
    const { PaperID, studentID } = req.query;
    // console.log(PaperID)

    const exam = await Answer.findOne({ 'PaperID': PaperID, 'Participants.Students.studentID': studentID });

    if (!exam) {
        return res.status(404).json({ error: 'Exam or student not found' });
    }
    const student = exam.Participants.Students.find(s => s.studentID === studentID);

    if (!student) {
        return res.status(404).json({ error: 'Student not found in the exam' });
    }
    const currentTime = new Date();
    let remainingTime = (student.endTime - currentTime); // in minutes

    if (remainingTime <= 0) {
        remainingTime = 0
    }

    res.json({ remainingTime });
}

const UpdateProPic = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: process.env.CLOUDINARY_NAME,
            resource_type: 'auto'
        });
        const updates = {
            image: result.secure_url,
        }

        const Update = await User.findByIdAndUpdate(id, updates, { new: true })
        if (!Update) {
            return res.status(401).send("Something went wrong!!");
        } else {
            return res.status(200).json({ message: "OK" })
        }


    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

// const StartPartB = async (req, res) => {
//     try {
//         const { testID, studentID, duration } = req.body;

//         let exam = await Answer.findOne({ 'PaperID': testID });

//         if (!exam) {
//             return res.status(404).json({ error: 'Exam not found' });
//         }

//         let student = exam.Participants.Students.find(s => s.studentID === studentID);

//         const startTime = new Date();
//         const endTime = new Date(startTime.getTime() + duration * 60000);

//         // Ensure that the student exists before checking conditions
//         if (!student) {
//             student = {
//                 studentID: studentID,
//                 answers: [],
//                 startTimeB: startTime,
//                 endTimeB: endTime,
//                 durationB: duration,
//                 SubmitPaper: false,

//             };
//             exam.Participants.Students.push(student);
//         }
//         await exam.save();
//         // Check if SubmitPaper is false and if the current start time is after the previous Part B end time
//         if (!student.SubmitPaper && startTime >= student.endTimeB) {
//             student.startTimeB = startTime;
//             student.endTimeB = endTime;
//             student.durationB = duration;

//             await exam.save();
//         }
//         return res.json({ examId: exam._id, endTime });

//     } catch (error) {
//         console.error('Failed to start exam:', error);
//         res.status(500).json({ error: 'Failed to start exam' });
//     }

// }
const RemainingTimeB = async (req, res) => {
    const { PaperID, studentID } = req.query;

    const exam = await Answer.findOne({ 'PaperID': PaperID, 'Participants.Students.studentID': studentID });

    if (!exam) {
        return res.status(404).json({ error: 'Exam or student not found' });
    }
    const student = exam.Participants.Students.find(s => s.studentID === studentID);

    if (!student) {
        return res.status(404).json({ error: 'Student not found in the exam' });
    }
    const currentTime = new Date();
    let remainingTime = (student.endTimeB - currentTime); // in minutes

    if (remainingTime <= 0) {
        remainingTime = 0
    }

    res.json({ remainingTime });
}
const SubmitPaper = async (req, res) => {
    const { PaperID, StudentID } = req.body;

    try {
        const result = await Answer.findOneAndUpdate(
            { 'PaperID': PaperID, 'Participants.Students.studentID': StudentID },
            {
                $set: {
                    'Participants.Students.$.SubmitPaper': true,
                    'Participants.Students.$.SubmitTime': new Date()
                }
            },
            { new: true }
        );

        if (result) {
            res.status(200).json({ success: 'Exam submitted successfully.' });
        } else {
            res.status(404).json({ message: 'Submission failed. Student or Paper not found.' });
        }
    } catch (err) {
        console.error('Error submitting exam:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

const CheckSubmitPaper = async (req, res) => {
    const { PaperID, studentID } = req.query;

    try {
        const examData = await Answer.findOne(
            { 'PaperID': PaperID, 'Participants.Students.studentID': studentID },
            { 'Participants.Students.$': 1 }
        );

        if (!examData) {
            return res.status(404).json({ message: 'Paper or Student not found.' });
        }

        const student = examData.Participants.Students[0];
        const submitPaperStatus = student.SubmitPaper;

        res.status(200).json({ TestID: PaperID, SubmitPaper: submitPaperStatus });
    } catch (err) {
        console.error('Error checking SubmitPaper status:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

const Checkpaperstatus = async (req, res) => {
    const { studentID } = req.query;
    try {
        const result = await Answer.find(
            {
                "Participants.Students": {
                    $elemMatch: {
                        "studentID": studentID,
                    }
                }
            },
            {
                "PaperID": 1,
                "Participants.Students.$": 1
            }
        );
        res.status(200).json({ result });

    } catch (error) {
        console.error("Error fetching student data:", error);
        throw error;
    }
}

const ShowResult = async (req, res) => {

    try {
        const { studentID, PaperID } = req.query;


        const testData = await Test.findOne({ _id: PaperID });
        if (!testData) {
            throw new Error('Test not found');
        }

        const questions = testData.questions;
        const answerData = await Answer.findOne({ 'Participants.Students.studentID': studentID, PaperID: PaperID });
        const answeredQuestionIDs = answerData.Participants.Students.find(s => s.studentID === studentID).answers.map(a => a.q_id);

        const unmatchedQuestions = questions.filter(q => !answeredQuestionIDs.includes(q._id.toString())).filter(q => ['MCQ', 'MSQ', 'NAT'].includes(q.selectedType));

        const unmatchedQuestionsDetails = unmatchedQuestions.map(q => ({
            question: q.question,
            questionId: q._id,
            answer: "",
            correctAnswer: q.ans,
            marks: q.marks,
            negativeMarks: q.negativemarks,
            selectedType: q.selectedType,
            status: "skipped",
            solution: q.solution,
            videoSolution: q.videoSolution
        }));

        const answerStatuses = await Answer.aggregate([
            { $match: { PaperID: PaperID, "Participants.Students.studentID": studentID } },
            { $unwind: "$Participants.Students" },
            { $match: { "Participants.Students.studentID": studentID } },
            { $unwind: "$Participants.Students.answers" },
            {
                $lookup: {
                    from: "tests",
                    let: { questionId: { $toObjectId: "$Participants.Students.answers.q_id" } },
                    pipeline: [
                        { $unwind: "$questions" },
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$questions._id", "$$questionId"] },
                                        { $in: ["$questions.selectedType", ["NAT", "MSQ", "MCQ"]] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "matchedQuestion"
                }
            },
            { $unwind: { path: "$matchedQuestion" } },
            {
                $addFields: {
                    answerStatus: {
                        $cond: {
                            if: {
                                $or: [
                                    { $eq: ["$Participants.Students.answers.ans", ""] },
                                    "$questionNotFound"
                                ]
                            },
                            then: "skipped",
                            else: {
                                $switch: {
                                    branches: [
                                        {
                                            case: { $eq: ["$matchedQuestion.questions.selectedType", "NAT"] },
                                            then: {
                                                $cond: {
                                                    if: { $eq: ["$Participants.Students.answers.ans", "$matchedQuestion.questions.ans"] },
                                                    then: "correct",
                                                    else: "incorrect"
                                                }
                                            }
                                        },
                                        {
                                            case: { $eq: ["$matchedQuestion.questions.selectedType", "MSQ"] },
                                            then: {
                                                $let: {
                                                    vars: {
                                                        studentAnswers: {
                                                            $objectToArray: "$Participants.Students.answers.ans"
                                                        },
                                                        correctAnswers: {
                                                            $objectToArray: "$matchedQuestion.questions.ans"
                                                        },
                                                        allFalse: {
                                                            $not: {
                                                                $in: [true, {
                                                                    $map: {
                                                                        input: {
                                                                            $objectToArray: "$Participants.Students.answers.ans"
                                                                        },
                                                                        as: "item",
                                                                        in: "$$item.v"
                                                                    }
                                                                }]
                                                            }
                                                        }
                                                    },
                                                    in: {
                                                        $cond: {
                                                            if: "$$allFalse",
                                                            then: "skipped",
                                                            else: {
                                                                $cond: {
                                                                    if: {
                                                                        $setEquals: [
                                                                            {
                                                                                $map: {
                                                                                    input: "$$studentAnswers",
                                                                                    as: "item",
                                                                                    in: {
                                                                                        $cond: [
                                                                                            { $eq: ["$$item.v", true] },
                                                                                            "$$item.k",
                                                                                            null
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                $map: {
                                                                                    input: "$$correctAnswers",
                                                                                    as: "item",
                                                                                    in: {
                                                                                        $cond: [
                                                                                            { $eq: ["$$item.v", "true"] },
                                                                                            "$$item.k",
                                                                                            null
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            }
                                                                        ]
                                                                    },
                                                                    then: "correct",
                                                                    else: "incorrect"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            case: { $eq: ["$matchedQuestion.questions.selectedType", "MCQ"] },
                                            then: {
                                                $cond: {
                                                    if: { $eq: ["$Participants.Students.answers.ans", "$matchedQuestion.questions.ans"] },
                                                    then: "correct",
                                                    else: "incorrect"
                                                }
                                            }
                                        }
                                    ],
                                    default: "incorrect"
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    questionId: "$Participants.Students.answers.q_id",
                    question: "$matchedQuestion.questions.question",
                    solution: "$matchedQuestion.questions.solution",
                    videoSolution: "$matchedQuestion.questions.videoSolution",
                    answer: "$Participants.Students.answers.ans",
                    correctAnswer: "$matchedQuestion.questions.ans",
                    status: "$answerStatus",
                    selectedType: "$matchedQuestion.questions.selectedType",
                    marks: "$matchedQuestion.questions.marks",
                    negativeMarks: "$matchedQuestion.questions.negativemarks"
                }
            }
        ]);

        const result = await Answer.findOne(
            { 'PaperID': PaperID, 'Participants.Students.studentID': studentID },
            { 'Participants.Students.$': 1 }
        );
        if (result) {
            const studentData = result.Participants.Students[0];
            const startTime = studentData.startTime;
            const submitTime = studentData.SubmitTime;

            if (startTime && submitTime) {
                const timeTakenMs = new Date(submitTime) - new Date(startTime);

                const hours = Math.floor(timeTakenMs / (1000 * 60 * 60));
                const minutes = Math.floor((timeTakenMs % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeTakenMs % (1000 * 60)) / 1000);

                const maxHours = 3;
                const maxMinutes = 0;
                const maxSeconds = 0;

                if (hours > maxHours || (hours === maxHours && (minutes > maxMinutes || (minutes === maxMinutes && seconds > maxSeconds)))) {
                    const formattedTime = `${maxHours.toString().padStart(2, '0')}:${maxMinutes.toString().padStart(2, '0')}:${maxSeconds.toString().padStart(2, '0')}`;
                    return res.status(200).json({
                        answerStatus: [...answerStatuses, ...unmatchedQuestionsDetails], TimeTaken: {
                            hours: hours,
                            minutes: minutes,
                            seconds: seconds,
                            formattedTime
                        }
                    })
                } else {
                    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    return res.status(200).json({
                        answerStatus: [...answerStatuses, ...unmatchedQuestionsDetails], TimeTaken: {
                            hours: hours,
                            minutes: minutes,
                            seconds: seconds,
                            formattedTime
                        }
                    })
                }


            }
        }


    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }

}

const StudentAnswer = async (req, res) => {
    try {
        const { studentID, PaperID } = req.query;


        const testData = await Test.findOne({ _id: PaperID });
        if (!testData) {
            throw new Error('Test not found');
        }

        const questions = testData.questions;
        const answerData = await Answer.findOne({ 'Participants.Students.studentID': studentID, PaperID: PaperID });
        const answeredQuestionIDs = answerData.Participants.Students.find(s => s.studentID === studentID).answers.map(a => a.q_id);
        const answeredQuestion = answerData.Participants.Students.find(s => s.studentID === studentID).answers

        const unmatchedQuestions = questions.filter(q => !answeredQuestionIDs.includes(q._id.toString()));

        const unmatchedQuestionsDetails = unmatchedQuestions.map(q => ({
            question: q.question,
            questionId: q._id,
            answer: "",
            correctAnswer: q.ans,
            marks: q.marks,
            negativeMarks: q.negativemarks,
            selectedType: q.selectedType,
            status: "skipped",
            solution: q.solution,
            videoSolution: q.videoSolution
        }));
        const matchedQuestions = questions.filter(q => answeredQuestionIDs.includes(q._id.toString())).filter(q => !['MCQ', 'MSQ', 'NAT'].includes(q.selectedType));

        const matchedQuestionDetails = matchedQuestions.map(q => ({
            question: q.question,
            questionId: q._id,
            answer: answeredQuestion.find((k) => k.q_id === q._id.toString())?.ans,
            correctAnswer: q.ans,
            marks: q.marks,
            providedmarks: answeredQuestion.find((k) => k.q_id === q._id.toString())?.cmarks,
            negativeMarks: q.negativemarks,
            selectedType: q.selectedType,
            status: answeredQuestion.find((k) => k.q_id === q._id.toString())?.ansstatus || "skipped",
            solution: q.solution,
            videoSolution: q.videoSolution
        }))

        const answerStatuses = await Answer.aggregate([
            { $match: { PaperID: PaperID, "Participants.Students.studentID": studentID } },
            { $unwind: "$Participants.Students" },
            { $match: { "Participants.Students.studentID": studentID } },
            { $unwind: "$Participants.Students.answers" },
            {
                $lookup: {
                    from: "tests",
                    let: { questionId: { $toObjectId: "$Participants.Students.answers.q_id" } },
                    pipeline: [
                        { $unwind: "$questions" },
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$questions._id", "$$questionId"] },
                                        { $in: ["$questions.selectedType", ["NAT", "MSQ", "MCQ"]] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "matchedQuestion"
                }
            },
            { $unwind: { path: "$matchedQuestion" } },
            {
                $addFields: {
                    answerStatus: {
                        $cond: {
                            if: {
                                $or: [
                                    { $eq: ["$Participants.Students.answers.ans", ""] }
                                ]
                            },
                            then: "skipped",
                            else: {
                                $switch: {
                                    branches: [
                                        {
                                            case: { $eq: ["$matchedQuestion.questions.selectedType", "NAT"] },
                                            then: {
                                                $cond: {
                                                    if: { $eq: ["$Participants.Students.answers.ans", "$matchedQuestion.questions.ans"] },
                                                    then: "correct",
                                                    else: "incorrect"
                                                }
                                            }
                                        },
                                        {
                                            case: { $eq: ["$matchedQuestion.questions.selectedType", "MSQ"] },
                                            then: {
                                                $let: {
                                                    vars: {
                                                        studentAnswers: {
                                                            $objectToArray: "$Participants.Students.answers.ans"
                                                        },
                                                        correctAnswers: {
                                                            $objectToArray: "$matchedQuestion.questions.ans"
                                                        },
                                                        allFalse: {
                                                            $not: {
                                                                $in: [true, {
                                                                    $map: {
                                                                        input: {
                                                                            $objectToArray: "$Participants.Students.answers.ans"
                                                                        },
                                                                        as: "item",
                                                                        in: "$$item.v"
                                                                    }
                                                                }]
                                                            }
                                                        }
                                                    },
                                                    in: {
                                                        $cond: {
                                                            if: "$$allFalse",
                                                            then: "skipped",
                                                            else: {
                                                                $cond: {
                                                                    if: {
                                                                        $setEquals: [
                                                                            {
                                                                                $map: {
                                                                                    input: "$$studentAnswers",
                                                                                    as: "item",
                                                                                    in: {
                                                                                        $cond: [
                                                                                            { $eq: ["$$item.v", true] },
                                                                                            "$$item.k",
                                                                                            null
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                $map: {
                                                                                    input: "$$correctAnswers",
                                                                                    as: "item",
                                                                                    in: {
                                                                                        $cond: [
                                                                                            { $eq: ["$$item.v", "true"] },
                                                                                            "$$item.k",
                                                                                            null
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            }
                                                                        ]
                                                                    },
                                                                    then: "correct",
                                                                    else: "incorrect"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            case: { $eq: ["$matchedQuestion.questions.selectedType", "MCQ"] },
                                            then: {
                                                $cond: {
                                                    if: { $eq: ["$Participants.Students.answers.ans", "$matchedQuestion.questions.ans"] },
                                                    then: "correct",
                                                    else: "incorrect"
                                                }
                                            }
                                        }
                                    ],
                                    default: "incorrect"
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    questionId: "$Participants.Students.answers.q_id",
                    question: "$matchedQuestion.questions.question",
                    solution: "$matchedQuestion.questions.solution",
                    videoSolution: "$matchedQuestion.questions.videoSolution",
                    answer: "$Participants.Students.answers.ans",
                    correctAnswer: "$matchedQuestion.questions.ans",
                    status: "$answerStatus",
                    selectedType: "$matchedQuestion.questions.selectedType",
                    marks: "$matchedQuestion.questions.marks",
                    negativeMarks: "$matchedQuestion.questions.negativemarks"
                }
            }
        ]);

        const result = await Answer.findOne(
            { 'PaperID': PaperID, 'Participants.Students.studentID': studentID },
            { 'Participants.Students.$': 1 }
        );
        if (result) {
            const studentData = result.Participants.Students[0];
            const startTime = studentData.startTime;
            const submitTime = studentData.SubmitTime;

            if (startTime && submitTime) {
                const timeTakenMs = new Date(submitTime) - new Date(startTime);

                const hours = Math.floor(timeTakenMs / (1000 * 60 * 60));
                const minutes = Math.floor((timeTakenMs % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeTakenMs % (1000 * 60)) / 1000);
                const formattedTime = `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

                return res.status(200).json({
                    answerStatus: [...answerStatuses, ...unmatchedQuestionsDetails, ...matchedQuestionDetails], TimeTaken: {
                        hours: hours,
                        minutes: minutes,
                        seconds: seconds,
                        formattedTime
                    }
                })
            }
        }


    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const UploadSolution = async (req, res) => {
    const { testID, questionID, vidlink } = req.body;

    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: process.env.CLOUDINARY_NAME,
            resource_type: 'auto'
        });
        const updates = {
            solution: result.secure_url,
            videoSolution: vidlink
        }

        const paper = await Test.findOne({ _id: testID });
        const question = paper.questions.id(questionID);
        Object.assign(question, updates);
        await paper.save();

    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }

}

const AnswerData = async (req, res) => {
    try {
        const tests = await Answer.find({});
        if (!tests) {
            return res.status(401).send("Something went wrong!!");
        } else {
            return res.status(200).json(tests)
        }
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const UpdateAnsStatus = async (req, res) => {
    const { ansstatus, studentID, testID, questionID, cmarks } = req.body

    try {
        Answer.updateOne(
            {
                PaperID: testID,
                "Participants.Students.studentID": studentID,
                "Participants.Students.answers.q_id": questionID
            },
            {
                $set: {
                    "Participants.Students.$[student].answers.$[answer].ansstatus": ansstatus,
                    "Participants.Students.$[student].answers.$[answer].cmarks": cmarks,
                }
            },
            {
                arrayFilters: [
                    { "student.studentID": studentID },
                    { "answer.q_id": questionID }
                ],
                upsert: true

            }
        ).then(result => {
            res.status(200).json({ message: "Answer status added/updated successfully" });
        })
            .catch(err => {
                console.error("Update failed:", err);
                res.status(500).json({ error: "An error occurred while adding/updating the answer status" });
            });
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const DeclareResultPartB = async (req, res) => {
    try {
        const { PaperID } = req.body;
        const answerDoc = await Answer.findOne({ PaperID });

        if (!answerDoc) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        const studentsData = await Promise.all(answerDoc.Participants.Students.map(async (student) => {
            const studentID = student.studentID;
            const testData = await Test.findOne({ _id: PaperID });
            if (!testData) {
                throw new Error('Test not found');
            }

            const questions = testData.questions;
            const answeredQuestionIDs = student.answers.map(a => a.q_id);
            const answeredQuestion = student.answers;

            const matchedQuestions = questions.filter(q => answeredQuestionIDs.includes(q._id.toString())).filter(q => !['MCQ', 'MSQ', 'NAT'].includes(q.selectedType));
            const matchedQuestionDetails = matchedQuestions.map(q => ({
                providedmarks: answeredQuestion.find(k => k.q_id === q._id.toString())?.cmarks,
                status: answeredQuestion.find(k => k.q_id === q._id.toString())?.ansstatus || "skipped",
            }));

            const answer = [...matchedQuestionDetails];

            const answerStatuses = await Answer.aggregate([
                { $match: { PaperID: PaperID, "Participants.Students.studentID": studentID } },
                { $unwind: "$Participants.Students" },
                { $match: { "Participants.Students.studentID": studentID } },
                { $unwind: "$Participants.Students.answers" },
                {
                    $lookup: {
                        from: "tests",
                        let: { questionId: { $toObjectId: "$Participants.Students.answers.q_id" } },
                        pipeline: [
                            { $unwind: "$questions" },
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$questions._id", "$$questionId"] },
                                            { $in: ["$questions.selectedType", ["NAT", "MSQ", "MCQ"]] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "matchedQuestion"
                    }
                },
                { $unwind: { path: "$matchedQuestion" } },
                {
                    $addFields: {
                        answerStatus: {
                            $cond: {
                                if: {
                                    $or: [
                                        { $eq: ["$Participants.Students.answers.ans", ""] },
                                        "$questionNotFound"
                                    ]
                                },
                                then: "skipped",
                                else: {
                                    $switch: {
                                        branches: [
                                            {
                                                case: { $eq: ["$matchedQuestion.questions.selectedType", "NAT"] },
                                                then: {
                                                    $cond: {
                                                        if: { $eq: ["$Participants.Students.answers.ans", "$matchedQuestion.questions.ans"] },
                                                        then: "correct",
                                                        else: "incorrect"
                                                    }
                                                }
                                            },
                                            {
                                                case: { $eq: ["$matchedQuestion.questions.selectedType", "MSQ"] },
                                                then: {
                                                    $let: {
                                                        vars: {
                                                            studentAnswers: {
                                                                $objectToArray: "$Participants.Students.answers.ans"
                                                            },
                                                            correctAnswers: {
                                                                $objectToArray: "$matchedQuestion.questions.ans"
                                                            },
                                                            allFalse: {
                                                                $not: {
                                                                    $in: [true, {
                                                                        $map: {
                                                                            input: {
                                                                                $objectToArray: "$Participants.Students.answers.ans"
                                                                            },
                                                                            as: "item",
                                                                            in: "$$item.v"
                                                                        }
                                                                    }]
                                                                }
                                                            }
                                                        },
                                                        in: {
                                                            $cond: {
                                                                if: "$$allFalse",
                                                                then: "skipped",
                                                                else: {
                                                                    $cond: {
                                                                        if: {
                                                                            $setEquals: [
                                                                                {
                                                                                    $map: {
                                                                                        input: "$$studentAnswers",
                                                                                        as: "item",
                                                                                        in: {
                                                                                            $cond: [
                                                                                                { $eq: ["$$item.v", true] },
                                                                                                "$$item.k",
                                                                                                null
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                },
                                                                                {
                                                                                    $map: {
                                                                                        input: "$$correctAnswers",
                                                                                        as: "item",
                                                                                        in: {
                                                                                            $cond: [
                                                                                                { $eq: ["$$item.v", "true"] },
                                                                                                "$$item.k",
                                                                                                null
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                }
                                                                            ]
                                                                        },
                                                                        then: "correct",
                                                                        else: "incorrect"
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                case: { $eq: ["$matchedQuestion.questions.selectedType", "MCQ"] },
                                                then: {
                                                    $cond: {
                                                        if: { $eq: ["$Participants.Students.answers.ans", "$matchedQuestion.questions.ans"] },
                                                        then: "correct",
                                                        else: "incorrect"
                                                    }
                                                }
                                            }
                                        ],
                                        default: "incorrect"
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        questionId: "$Participants.Students.answers.q_id",
                        question: "$matchedQuestion.questions.question",
                        solution: "$matchedQuestion.questions.solution",
                        videoSolution: "$matchedQuestion.questions.videoSolution",
                        answer: "$Participants.Students.answers.ans",
                        correctAnswer: "$matchedQuestion.questions.ans",
                        status: "$answerStatus",
                        selectedType: "$matchedQuestion.questions.selectedType",
                        marks: "$matchedQuestion.questions.marks",
                        negativeMarks: "$matchedQuestion.questions.negativemarks"
                    }
                }
            ]);

            const data = answerStatuses.filter((k) => k.selectedType === "MSQ");
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


            const partascore = (
                answerStatuses?.filter(
                    (question) => question.status === "correct"
                ).reduce(
                    (sum, question) => sum + parseFloat(question.marks, 10),
                    0
                ) +
                answerStatuses?.filter(
                    (question) => question.status === "pcorrect"
                ).reduce(
                    (sum, question) =>
                        sum + parseFloat(question.trueMatchCount, 10),
                    0
                ) +
                answerStatuses?.filter(
                    (question) => question.status === "incorrect"
                ).reduce(
                    (sum, question) =>
                        sum + parseFloat(question.negativeMarks, 10),
                    0
                )
            ).toFixed(2)

            const score = Number(answer.filter(
                (question) => question.status === "correct"
            ).reduce(
                (sum, question) =>
                    sum + parseFloat(question.providedmarks, 10),
                0
            ).toFixed(2)) + Number(partascore);

            return {
                studentID: student.studentID,
                email: student.email,
                score: score.toString(),  // Convert score to string if necessary
                rank: ""  // Placeholder for actual rank if needed
            };
        }));

        studentsData.sort((a, b) => b.score - a.score);

        // Assign ranks based on sorted scores
        studentsData.forEach((student, index) => {
            student.rank = (index + 1).toString();
        });

        let resultDoc = await Result.findOne({ PaperID });

        if (resultDoc) {
            resultDoc.DeclaredresultpartB = true;
            resultDoc.Students = studentsData;
            await resultDoc.save();
        } else {
            resultDoc = new Result({
                PaperID,
                DeclaredresultpartB: true,
                Students: studentsData
            });
            await resultDoc.save();
        }

        res.status(200).json({ message: 'Results saved successfully', result: resultDoc });


    } catch (error) {
        console.error("Error saving new result:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const ScoreAnalytics = async (req, res) => {
    try {

        const data = await Result.find();
        res.status(200).json({ data: data });

    } catch (error) {
        console.error("Error saving new result:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const ResultPartB = async (req, res) => {
    try {
        const { studentID, PaperID } = req.query;


        const testData = await Test.findOne({ _id: PaperID });
        if (!testData) {
            throw new Error('Test not found');
        }

        const questions = testData.questions;
        const answerData = await Answer.findOne({ 'Participants.Students.studentID': studentID, PaperID: PaperID });
        const answeredQuestionIDs = answerData.Participants.Students.find(s => s.studentID === studentID).answers.map(a => a.q_id);
        const answeredQuestion = answerData.Participants.Students.find(s => s.studentID === studentID).answers

        const unmatchedQuestions = questions.filter(q => !answeredQuestionIDs.includes(q._id.toString())).filter(q => !['MCQ', 'MSQ', 'NAT'].includes(q.selectedType));;

        const unmatchedQuestionsDetails = unmatchedQuestions.map(q => ({
            question: q.question,
            questionId: q._id,
            answer: "",
            correctAnswer: q.ans,
            marks: q.marks,
            negativeMarks: q.negativemarks,
            selectedType: q.selectedType,
            status: "skipped",
            solution: q.solution,
            videoSolution: q.videoSolution
        }));
        const matchedQuestions = questions.filter(q => answeredQuestionIDs.includes(q._id.toString())).filter(q => !['MCQ', 'MSQ', 'NAT'].includes(q.selectedType));

        const matchedQuestionDetails = matchedQuestions.map(q => ({
            question: q.question,
            questionId: q._id,
            answer: answeredQuestion.find((k) => k.q_id === q._id.toString())?.ans,
            correctAnswer: q.ans,
            marks: q.marks,
            providedmarks: answeredQuestion.find((k) => k.q_id === q._id.toString())?.cmarks,
            negativeMarks: q.negativemarks,
            selectedType: q.selectedType,
            status: answeredQuestion.find((k) => k.q_id === q._id.toString())?.ansstatus || "skipped",
            solution: q.solution,
            videoSolution: q.videoSolution
        }))

        return res.status(200).json({
            answerStatus: [...unmatchedQuestionsDetails, ...matchedQuestionDetails]
        })

    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

module.exports = {
    CreateTest, basic, GetTest, UpdateTest, DeleteTest, UploadQuestion, DeleteQuestion, UpdateQuestion, AddInstruction, AdminLogin, verifyAdmin, AdminLogout, ConductTest, SignUp, OTPverify, ResendOTP, verifyUser, UserLogin, OtpForgot, OtpVerifyForgot, ResetPassword, EditProfile, UEotp, UEverifyOTP, UpNewEmail, NewEmailOTP, StartExam, SubmitExam, RemainingTime, UpdateProPic, RemainingTimeB, SubmitPaper, CheckSubmitPaper, Checkpaperstatus, ShowResult, UploadSolution, AnswerData, StudentAnswer, UpdateAnsStatus, DeclareResultPartB, ScoreAnalytics, ResultPartB,
}    
