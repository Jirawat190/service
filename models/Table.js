const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
    tableid: Number,
    seat : Number,
    order: [{
        menuid: String,
        menuname: String,
        menuprice: Number,
        set: Number,
        option: [{
            id: String,
            name: String,
            price: Number
        }],
        comment: String,
        totalprice: Number,
    }],
    pricesum: Number,
    statustable: Boolean,
    qrcode: String,
});

module.exports = mongoose.model('Table', TableSchema)

module.exports.saveTable = function (model, data) {
    model.save(data)
}
