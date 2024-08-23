const express = require("express")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const cors = require('cors')
const session = require("express-session")
const passport = require("passport")
const WebSocket = require('ws');
const http = require('http');
const Answer = require('./model/answers')
const cloudinary = require('cloudinary').v2

const PORT = process.env.PORT || 5000;
dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


wss.on('connection', async (ws) => {
    try {
        const answers = await Answer.find({});
        ws.send(JSON.stringify(answers));
    } catch (err) {
        console.error('Error fetching answers:', err);
    }

    ws.on('message', async (message) => {
        const { PaperID, studentID, q_id, ans, status, imagename, imagesize } = JSON.parse(message);

        let imageUrl = ans;

        // If ans is a base64 string, upload it to Cloudinary
        if (typeof ans === 'string' && ans.startsWith('data:image/')) {
            const uploadResponse = await cloudinary.uploader.upload(ans, {
                folder: process.env.CLOUDINARY_NAME,
                resource_type: 'auto',
            });
            imageUrl = uploadResponse.secure_url;
        }
        const updatedAnswer = {
            q_id,
            ans: imageUrl,
            status,
            imagename, imagesize
        };

        try {
            await Answer.findOneAndUpdate(
                { 'PaperID': PaperID, 'Participants.Students.studentID': studentID },
                { $pull: { 'Participants.Students.$.answers': { q_id: q_id } } },
                { new: true }
            );

            await Answer.findOneAndUpdate(
                { 'PaperID': PaperID, 'Participants.Students.studentID': studentID },
                { $push: { 'Participants.Students.$.answers': updatedAnswer } },
                { upsert: true, new: true }
            );

            const allAnswers = await Answer.find({});

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(allAnswers));
                }
            });

        } catch (err) {
            console.error('Error handling message:', err);
        }

    });
});


app.use(cors({ origin: process.env.FRONTEND_URI, credentials: true }))
require("./db/connection.js");
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({ secret: process.env.COOKIE_SECRET, resave: false, saveUninitialized: true }))

app.use(passport.initialize());
app.use(passport.session());


const Router = require('./routes/routes.js');

app.use('/', Router)


server.listen(PORT, () => {
    console.log(`server running in port no ${PORT}`)
})