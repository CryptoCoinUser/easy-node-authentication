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
        
    }); //app.post

// { $set: {coinsDotNewCoin: req.body.qty}  
//                 },
//                 {upsert: true, new : true},

};
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
 

 /*
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));
 */