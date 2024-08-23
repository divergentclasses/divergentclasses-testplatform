const mongoose = require("mongoose")

const userSchemaG = new mongoose.Schema({

    email: {
        type: String,
    },
    password: {
        type: String
    },
    image: {
        type: String,
    },
    googleId: {
        type: String,
    },
    displayName: {
        type: String,
    },
    otp: {
        type: String,
        default: ""
    },
    isVerifiedEmail: {
        type: Boolean,
        default: false
    },
    mobileno: {
        type: String
    },
    stream: {
        type: String
    },
    exams: {
        type: String
    },
    address: {
        type: String
    }
})

module.exports = mongoose.model("USER", userSchemaG)