const mongoose = require('mongoose');

const RandomSchema = new mongoose.Schema({
    random : String,
    tableid: Number
});

module.exports = mongoose.model('Random', RandomSchema)

module.exports.saveRandom = function(model, data){
    model.save(data)
}
