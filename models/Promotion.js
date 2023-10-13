const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({
    name : String,
    price : Number,
    typefood : String,
    img : String, 
    menu : {
        category1: String,
        category2: String,
        category3: String,
        category4: String,
    },
});

module.exports = mongoose.model('Promotion', PromotionSchema)

module.exports.savePromotion = function(model, data){
    model.save(data)
}
