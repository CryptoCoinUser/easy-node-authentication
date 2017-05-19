var User  = require('../app/models/user');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = function(app, passport) {

    app.post('/coin/add', isLoggedIn, (req, res) =>  {
         // console.log(req.user);
         // console.log(req.body);

        const newCoin = req.body.abrv;
        const coinsDotNewCoin = `coins.${newCoin}`;
        // User.where({coinsDotNewCoin}).ne(null)
        let previousQty
        User.findById(req.user._id, 
            function(err, user) {
                previousQty = user.coins[newCoin];
                if( previousQty > 0 ){
                console.log(`${req.user.local.email} already has ${previousQty} of ${newCoin}`);
                //update qty - later this can be done from table td
                // user.updateOne({ _id : req.user._id},
                //     { $set: {coinsDotNewCoin: req.body.qty}}
                //     )
                } else {
               //if user doesn't have this coin yet
              
 
                User.findById(req.user._id, 
                function(err, user) {
                    user.coins[newCoin] = req.body.qty;
                    user.markModified('coins'); 
                    user.save(function(err, savedUser) {
                        console.log("post Updated User", savedUser);
                    });
                    
                });

                } //else 
            });//User.findById
 
        // .exec()
        // .then(newCoinQty => {
        //     //if user alredy has this coin, 
            

        // })//then

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