var User  = require('../app/models/user');
var Price  = require('../app/models/price');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = function(app, passport) {

    app.post('/coin/add', isLoggedIn, (req, res) =>  {

        const newCoin = req.body.abrv;
 
        User.findById(req.user._id)
        .exec()
        .then(function(user) {
            user.coins[newCoin] = req.body.qty;
            user.markModified('coins'); 
            user.save(function(err, savedUser) {
                if (err) res.send(err);
                var latestPrices = new Price;

                latestPrices.lookupPricesForAllCoins(function(prices){ 
                    prices = JSON.parse(prices);

                    for (coin in prices){
                        latestPrices[coin].lastPrice = prices[coin];
                        latestPrices[coin].lastPriceDate = new Date();
                    }

                    mongoose.connection.collections['prices'].drop( function(err) {
                        console.log('prices collection dropped');
                    });
                    latestPrices.save(function(err, savedPrices){
                         if (err) res.send(err);
                         if (savedPrices) res.send({savedPrices, savedUser});
                    });
                 
               });
            });
            
        })
        
    });


    app.post('/coin/qty', isLoggedIn, (req, res) =>  {

        const {abrv, qty} = req.body;
 
        User.findById(req.user._id)
        .exec()
        .then(function(user) {
            user.coins[abrv] = req.body.qty;
            user.markModified('coins'); 
            user.save(function(err, savedUser) {
                if (err) res.send(err);   
                Price.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, savedPrices) { 
                     if (err) res.send(err);
                     if (savedPrices) res.send({savedPrices, savedUser});
               });
            });
            
        })        
    });





    app.post('/user/cur', isLoggedIn, (req, res) => {
        User.findById(req.user._id)
        .exec()
        .then(function(user) {
           console.log('coinrouter user/cur req.body.cur is');
           console.log(req.body.cur);

           user.cur = req.body.cur;
           user.markModified('cur');
           user.save(function(err, savedUser){
                console.log('currency updated', savedUser);
           }); 

           res.send(req.body.cur); 
         
        });
            
    })

    app.get('/coin/prices', isLoggedIn, (req, res) => {
        User.findById(req.user._id)
        .exec()
        .then(function(savedUser) {
            
            var latestPrices = new Price;

            latestPrices.lookupPricesForAllCoins(function(prices){ 
                prices = JSON.parse(prices);

                for (coin in prices){
                
                    latestPrices[coin].lastPrice = prices[coin];
                    latestPrices[coin].lastPriceDate = new Date();
                }
 
                mongoose.connection.collections['prices'].drop( function(err) {
                    console.log('prices collection dropped');
                });
                latestPrices.save(function(err, savedPrices){
                     if (err) res.send(err);
                     if (savedPrices) res.send({savedPrices, savedUser});
                });
             
           });
        });
            
    })

};
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
 