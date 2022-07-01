const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required:true
    },
    domain: {
        type: String,
        enum : ['IT', 'ART', 'CINEMA', 'MUSIC', 'DANCE', 'PHY', 'ECONOMIC', 'MARKETING'],
        default: 'IT',
        required:true
    },
    level: {
        type: String,
        enum : ['BEGINNER','INTERMEDIATE','ADVANCED'],
        default: 'BEGINNER',
        required:true
    },
    start: {
        type: Date,
        required:true
    },
    end: {
        type: Date,
        required:true
    },
    nbrHours: {
        type: Number,
        required:true
    },
    lieu: {
        type: String,
        required:true
    },
    nbrMaxParticipant: {
        type: Number
    },
    costs: {
        type: Number,
        required:true
    },
    userF : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    courseApprenants :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "CourseApprenant"
    }]

},{timestamps : true});

    courseSchema.virtual('id').get(function () {
    return this._id.toHexString();
    });

    courseSchema.set('toJSON',{
        virtuals : true,
    });


    // legion change    hello

module.exports = mongoose.model('Course', courseSchema);
