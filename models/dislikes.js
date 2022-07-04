const mongoose = require('mongoose');

const dislikesSchema = new mongoose.Schema({
    nbrDislikes: {
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

dislikesSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

dislikesSchema.set('toJSON',{
    virtuals : true,
});

module.exports = mongoose.model('Dislike', dislikesSchema);
