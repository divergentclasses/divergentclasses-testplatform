const mongoose = require("mongoose")

const answerSchema = new mongoose.Schema({
    PaperID: {
        type: String
    },
    Participants: {
        Students: [{
            studentID: String,
            email: String,
            answers: [{
                q_id: String,
                ans: {
                    type: mongoose.Schema.Types.Mixed,
                },
                status: String,
                imagename: String,
                imagesize: String,
                ansstatus: String,
                cmarks: String
            }],
            AttemptedOn: Date,
            startTime: Date,
            endTime: {
                type: Date,
                default: 0
            },
            duration: {
                type: Number,
                default: ""
            },
            SubmitPartA: {
                type: Boolean,
                default: false
            },
            startTimeB: Date,
            endTimeB: {
                type: Date,
                default: 0
            },
            durationB: {
                type: Number,
                default: ""
            },
            Noofattempt: String,
            SubmitPaper: {
                type: Boolean,
                default: false
            },
            SubmitTime: {
                type: Date
            }
        }]
    },
})

module.exports = mongoose.model("ANSWER", answerSchema)