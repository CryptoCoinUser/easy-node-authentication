// load the things we need
var mongoose = require('mongoose');

// define the schema for our porfolio model
var portfolioSchema = mongoose.Schema({
	user	: String,
    coins    : [{
        abrv    : String, //BTC, DASH, etc.
        qty     : String
    }]

    

});

module.exports = mongoose.model('Portfolio', portfolioSchema);