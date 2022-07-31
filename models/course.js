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

    },
    end: {
        type: Date,

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
    description: {
        type: String,

    },

    skills: {
        type: String,

    },
    prerequisites: {
        type: String,

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
    certificates :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Certificate"
    }],
    ratings :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Rating"
    }],
    orderDetails :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "OrderDetail"
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
