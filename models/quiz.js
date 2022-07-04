const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required :true
    },
    score: {
        type: Number,
        required :true
    },
    content: {
        type: String,
        required :true
    },
    course : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    questions : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Question"
    }],
    results : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Result"
    }
},{timestamps : true});

quizSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

quizSchema.set('toJSON',{
    virtuals : true,
});

module.exports = mongoose.model('Quiz', quizSchema);
