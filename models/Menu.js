const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    name : String,
    price : Number,
    img : String,
    typefood : String,
    option : Array,
    abount : String,
    status : Boolean,
    
});

module.exports = mongoose.model('Menu', MenuSchema)

module.exports.saveMenu = function(model, data){
    model.save(data)
}
