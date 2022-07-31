const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({

    order : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    course : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course"
    }
},{timestamps : true});

orderDetailSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderDetailSchema.set('toJSON',{
    virtuals : true,
});

module.exports = mongoose.model('OrderDetail', orderDetailSchema);
