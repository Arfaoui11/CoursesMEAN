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
        required:true
    },
    type: {
        type: String,
        enum : ['STUDENT','ADMIN','SPUSER','FORMER',],
        default: 'SPUSER',
        required:true
    },
    state: {
        type: String,
        enum : ['DISCIPLINED','WARNED','PUNISHED','EXCLUDED'],
        default: 'DISCIPLINED',
        required:true
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
        type: Number,
        required:true
    },
    tarifHoraire: {
        type: Number,
        required:true
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
    }]

},{timestamps : true});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON',{
    virtuals : true,
});



module.exports = mongoose.model('User', userSchema);
