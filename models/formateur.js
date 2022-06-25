const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
    formationRoutes: {
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
        type: Number
    }
});



module.exports = mongoose.model('Formateur', formationSchema);