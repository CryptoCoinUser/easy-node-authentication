// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    },
    coins    : {
	    BTC: { type : Number, default : -1 },
	    ETH: { type : Number, default : -1 },
	    DASH: { type : Number, default : -1 },
	    ZEC: { type : Number, default : -1 },
	    LTC: { type : Number, default : -1 },
	    DOGE: { type : Number, default : -1 }
	},
	cur : String // currency 3-letter abr.; defaults to USD

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
 