const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    tableid : String,
    menuid: String,
    menuname: String,
    menuprice: Number,
    set: Number,
    option: [{
        id: String,
        name : String,
        price: Number
    }],
    comment: String,
    totalprice: Number,
});

module.exports = mongoose.model('Cart', CartSchema)

module.exports.saveCart = function (model, data) {
    model.save(data)
}
