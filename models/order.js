const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    total: {
        type: Number,
        required :true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    orderDetails : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderDetail"
    }]
},{timestamps : true});

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON',{
    virtuals : true,
});

module.exports = mongoose.model('Order', orderSchema);
