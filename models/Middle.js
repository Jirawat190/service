const mongoose = require('mongoose');

const MiddleSchema = new mongoose.Schema({
    username : String,
    prassword : String,
    img : String,
    firstname : String,
    lastname : String,
    work : String
});

module.exports = mongoose.model('Middle', MiddleSchema)

module.exports.saveMiddle = function(model, data){
    model.save(data)
}
