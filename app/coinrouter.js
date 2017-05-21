var User  = require('../app/models/user');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = function(app, passport) {

    app.post('/coin/add', isLoggedIn, (req, res) =>  {

        const newCoin = req.body.abrv;
        const coinsDotNewCoin = `coins.${newCoin}`;
 
        User.findById(req.user._id, 
        function(err, user) {
            user.coins[newCoin] = req.body.qty;
            user.markModified('coins'); 
            user.save(function(err, savedUser) {
                console.log("post Updated User", savedUser);
                res.json(savedUser.coins);
            });
            
        });
        
    });  

};
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
 