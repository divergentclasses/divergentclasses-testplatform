const mongoose = require("mongoose")

const resultSchema = new mongoose.Schema({
    PaperID: {
        type: String
    },
    DeclaredresultpartB: {
        type: Boolean,
        default: false
    },
    Students: [{
        studentID: String,
        email: String,
        score:String,
        rank:String
    }]
})

module.exports = mongoose.model("RESULT", resultSchema)