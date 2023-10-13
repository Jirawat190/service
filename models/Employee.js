const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    username : String,
    prassword : String,
    img : String,
    firstname : String,
    lastname : String,
    work : String
});

module.exports = mongoose.model('Employee', EmployeeSchema)

module.exports.saveEmployee = function(model, data){
    model.save(data)
}
