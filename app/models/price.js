// load the things we need
var mongoose = require('mongoose');
var request = require('request');

var priceSchema = mongoose.Schema({
  BTC: {
    lastPrice: {
      USD: Number,
      EUR: Number,
      CNY: Number
    },
    lastPriceDate: Date
  },
  ETH: {
    lastPrice: {
      USD: Number,
      EUR: Number,
      CNY: Number
    },
    lastPriceDate: Date
  },
  DASH: {
    lastPrice: {
      USD: Number,
      EUR: Number,
      CNY: Number
    },
    lastPriceDate: Date
  },
  LTC: {
    lastPrice: {
      USD: Number,
      EUR: Number,
      CNY: Number
    },
    lastPriceDate: Date
  },
  ZEC: {
    lastPrice: {
      USD: Number,
      EUR: Number,
      CNY: Number
    },
    lastPriceDate: Date
  },
  DOGE: {
    lastPrice: {
      USD: Number,
      EUR: Number,
      CNY: Number
    },
    lastPriceDate: Date
  }
});


priceSchema.methods.lookupPricesForAllCoins = function(callback){
  var BASE_URL = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,DASH,ZEC,LTC,DOGE&tsyms=USD,EUR,CNY';
  request(BASE_URL, function(err, response, coinsApiResponse){
    callback(coinsApiResponse); // db
  });
}


// create the model for prices and expose it to our app
module.exports = mongoose.model('Price', priceSchema);
