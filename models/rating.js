const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    typeRating: {
        type: Number,
        enum : [1, 2, 3, 4, 5],
        required:true
    },
    course : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps : true});

ratingSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ratingSchema.set('toJSON',{
    virtuals : true,
});

module.exports = mongoose.model('Rating', ratingSchema);
