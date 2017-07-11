var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var searchedSchema = new Schema({
    "query": String,
}, {timestamps: true}); 

var ModelClass = mongoose.model("Searched", searchedSchema);

module.exports = ModelClass;
