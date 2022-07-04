const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema({
    nbrLikes: {
        type: Number,
        required :true
    },
    comment : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
},{timestamps : true});

likesSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

likesSchema.set('toJSON',{
    virtuals : true,
});

module.exports = mongoose.model('Like', likesSchema);
