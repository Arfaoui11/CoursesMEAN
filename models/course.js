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
    image : {
        type :String,
        default: ''
    },
    images : [{
        type :String
    }],
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
    }],
    quizzes :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Quiz"
    }],
    comments :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }],
    Certificates :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Certificate"
    }],
    Ratings :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Rating"
    }]

},{timestamps : true});

    courseSchema.virtual('id').get(function () {
    return this._id.toHexString();
    });

    courseSchema.set('toJSON',{
        virtuals : true,
    });

    //   main


    // legion change    hello mahdi

module.exports = mongoose.model('Course', courseSchema);