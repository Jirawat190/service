const mongoose = require('mongoose');

const CashierSchema = new mongoose.Schema({
    username : String,
    prassword : String,
    img : String,
    firstname : String,
    lastname : String,
    work : String
});

module.exports = mongoose.model('Cashier', CashierSchema)

module.exports.saveCashier = function(model, data){
    model.save(data)
}
