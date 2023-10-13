const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username : String,
    prassword : String,
});

module.exports = mongoose.model('Admin', AdminSchema)

module.exports.saveAdmin = function(model, data){
    model.save(data)
}
