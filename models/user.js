const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true
    },
    profession: {
        type: String,
        enum : ['IT', 'ART', 'CINEMA', 'MUSIC', 'DANCE', 'PHY', 'ECONOMIC', 'MARKETING'],
        default: 'IT',
    },
    type: {
        type: String,
        enum : ['STUDENT','ADMIN','SPUSER','FORMER',],
        default: 'SPUSER',
    },
    file : {
        type :String,
        default: ''
    },

    state: {
        type: String,
        enum : ['DISCIPLINED','WARNED','PUNISHED','EXCLUDED'],
        default: 'DISCIPLINED',
    },
    lastName: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    salary: {
        type: Number
    },
    tarifHoraire: {
        type: Number
    },
    age: {
        type: Number
    },
    phoneNumber: {
        type: String,
        required:true
    },
    isAdmin: {
        type: Boolean,
        default : false
    },

    coursesF : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course"
    }],
    courseApprenants :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "CourseApprenant"
    }],
    likes :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Like"
    }],
    dislikes :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Dislike"
    }],
    comments :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }],
    Certificates :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Certificate"
    }],
    results :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Result"
    }],
    Ratings :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Rating"
    }]

},{timestamps : true});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON',{
    virtuals : true,
});
//hellloooo mahdi 7:51


module.exports = mongoose.model('User', userSchema);
