const mongoose = require('mongoose');

const certificatSchema = new mongoose.Schema({
    name: {
        type: String,
        required :true
    },
    path: {
        type: String,
        required :true
    },
    course : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
},{timestamps : true});

certificatSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

certificatSchema.set('toJSON',{
    virtuals : true,
});

module.exports = mongoose.model('Certificate', certificatSchema);
