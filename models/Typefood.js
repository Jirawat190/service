const mongoose = require('mongoose');

const TypefoodSchema = new mongoose.Schema({
    typefood : String,
});

module.exports = mongoose.model('Typefood', TypefoodSchema)

module.exports.saveTypefood = function(model, data){
    model.save(data)
}
