const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    username: {
        type: String,
        required :true
    },
    totalCorrect: {
        type: Number,
        required :true
    },
    correctAnswer: {
        type: Number,
        required :true
    },
    inCorrectAnswer: {
        type: Number,
        required :true
    },
    quiz : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz"
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps : true});

resultSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

resultSchema.set('toJSON',{
    virtuals : true,
});

module.exports = mongoose.model('Result', resultSchema);
