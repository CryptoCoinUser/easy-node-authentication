var User  = require('../app/models/user');
var Price  = require('../app/models/price');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = function(app, passport) {

    app.post('/coin/add', isLoggedIn, (req, res) =>  {

        const newCoin = req.body.abrv;
        // console.log('coin/add req.user');
        // console.log(req.user);
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


    app.post('/user/cur', isLoggedIn, (req, res) => {
        User.findById(req.user._id)
        .exec()
        .then(function(user) {
           console.log('coinrouter user/cur req.body.cur is');
           console.log(req.body.cur);

           user.cur = req.body.cur;
           user.markModified('cur');
           user.save(function(err, savedUser){
                //console.log('in /user/cur savedUser.cur is ' + savedUser.cur);
                res.send({cur: savedUser.cur});
                //console.log('currency updated', savedUser);
           }); 
           
        });
            
    })


    app.put('/coin/qty', isLoggedIn, (req, res) =>  {
        //console.log('coin/qty endpoint');
        const {abrv, qty} = req.body;
        //console.log(`abrv is ${abrv}, qty is ${qty}`);

        User.findById(req.user._id)
        .exec()
        .then(function(user) {
            user.coins[abrv] = qty;
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


    app.delete('/coin/delete', isLoggedIn, (req, res) =>  {
        const {abrv} = req.body;
        User.findById(req.user._id)
        .exec()
        .then(function(user) {
            user.coins[abrv] = -1;
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
    if (req.isAuthenticated() || process.env.NODE_ENV === 'test'){
        return next();
    }
    res.redirect('/');
}
 