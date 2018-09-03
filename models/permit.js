var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
    permit: Object
});


module.exports = mongoose.model('permits', Account);
