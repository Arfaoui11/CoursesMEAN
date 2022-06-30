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


module.exports = mongoose.model('CourseApprenant', courseAppSchema);
