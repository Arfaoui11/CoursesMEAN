const mongoose = require('mongoose');

const courseAppSchema = new mongoose.Schema({

    course : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course"
    },
    apprenant : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Apprenant"
    }

});


module.exports = mongoose.model('CourseApprenant', courseAppSchema);
