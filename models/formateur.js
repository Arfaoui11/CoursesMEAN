const mongoose = require('mongoose');

const formateurSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: 'This field is required.'
    },
    prenom: {
        type: String
    },
    tarifHoraire: {
        type: Number
    },
    email: {
        type: String
    },
    formations :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course"
    }]
});



module.exports = mongoose.model('Formateur', formateurSchema);