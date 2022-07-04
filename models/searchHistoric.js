const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
    keyword: {
        type: String,
        required :true
    }
},{timestamps : true});

searchSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

searchSchema.set('toJSON',{
    virtuals : true,
});

module.exports = mongoose.model('Search', searchSchema);
