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
    likes : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like"
    }],
    dislikes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Dislike"
    }],
},{timestamps : true});

commentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

commentSchema.set('toJSON',{
    virtuals : true,
});

module.exports = mongoose.model('Comment', commentSchema);
