const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
    nom: {
        type: String,

    },
    prenom: {
        type: String
    },
    mobile: {
        type: String
    },
    email: {
        type: String
    },
    courseApprenant :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "CourseApprenant"
    }]
});



module.exports = mongoose.model('Apprenant', formationSchema);
