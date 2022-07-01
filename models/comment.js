const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    message: {
        type: String,
        required :true
    },
    course : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
},{timestamps : true});

commentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

commentSchema.set('toJSON',{
    virtuals : true,
});

module.exports = mongoose.model('Comment', commentSchema);
