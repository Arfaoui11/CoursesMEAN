const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    typeRating: {
        type: String,
        enum : ['LIKE', 'DISLIKE', 'ANGRY', 'SAD', 'HAPPY'],
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
