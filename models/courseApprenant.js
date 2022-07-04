const mongoose = require('mongoose');

const courseAppSchema = new mongoose.Schema({

    course : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course"
    },
    userA : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }

});

courseAppSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

courseAppSchema.set('toJSON',{
    virtuals : true,
});

module.exports = mongoose.model('CourseApprenant', courseAppSchema);
