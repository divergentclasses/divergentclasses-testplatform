const mongoose = require('mongoose')


const ttSchema = new mongoose.Schema({
    paper_name: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true
    },
    totalmarks: {
        type: String,
        required: true,
    },
    no_of_questions: {
        type: String,
        required: true
    },
    no_of_sections: {
        type: String,
        required: true,
    },
    exam_duration: {
        type: String,
        required: true,
    },
    questions: [
        {
            question: {
                type: String
            },
            selectedType: {
                type: String
            },
            ans: {
                type: mongoose.Schema.Types.Mixed,
            },
            marks: {
                type: String
            },
            negativemarks: {
                type: String
            },
            solution: {
                type: String
            },
            videoSolution: String
        }
    ],
    marking_scheme_instructions: {
        type: String
    }
    , status: {
        type: String,
        default: "saved"
    },
    conduct_time: {
        type: Date
    }
    , time: {
        type: Date,
        default: Date.now
    }
})




module.exports = mongoose.model("TESTS", ttSchema)