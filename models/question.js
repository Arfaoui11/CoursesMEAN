const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required :true
    },
    optionA: {
        type: String,
        required :true
    },
    optionB: {
        type: String,
        required :true
    },
    optionC: {
        type: String,
        required :true
    },
    optionD: {
        type: String,
        required :true
    },
    optionE: {
        type: String,
        required :true
    },
    ans: {
        type: Number,
        required :true
    },
    chose: {
        type: Number,

    },
    quiz : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz"
    }

},{timestamps : true});

questionSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

questionSchema.set('toJSON',{
    virtuals : true,
});

module.exports = mongoose.model('Question', questionSchema);
