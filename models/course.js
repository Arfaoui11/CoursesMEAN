const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required:true
    },
    niveau: {
        type: String,
        enum : ['DEBUTANT','INTERMEDIAIRE','AVANCE'],
        default: 'DEBUTANT',
        required:true
    },
    dateDebut: {
        type: Date,
        required:true
    },
    dateFin: {
        type: Date,
        required:true
    },
    nbrHeures: {
        type: Number,
        required:true
    },
    nbrMaxParticipant: {
        type: Number
    },
    frais: {
        type: Number,
        required:true
    },
    apprenants :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Apprenant"
    }],
    formateur : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Formateur"
    }

},{timestamps : true});


module.exports = mongoose.model('Course', courseSchema);