const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    tableid: Number,
    order: [
        
    ],
    orderamount: Number,
    getmoney : Number,
    changemoney : Number,
    week : String,
    day: Number,
    month: Number,
    year: Number,
    hours : Number,
    minutes : Number,
    seconds : Number,
    
});

module.exports = mongoose.model('Order', OrderSchema)

module.exports.saveOrder = function (model, data) {
    model.save(data)
}
