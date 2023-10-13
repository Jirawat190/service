const mongoose = require('mongoose');
const OptionSchema = new mongoose.Schema({
    name : String,
    price: Number
});

module.exports = mongoose.model('Option', OptionSchema)
module.exports.saveOption = function(model, data){
    model.save(data)
}
