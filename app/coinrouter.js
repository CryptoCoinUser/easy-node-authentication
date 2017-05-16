var User  = require('../app/models/user');

module.exports = function(app, passport) {

    app.post('/coin/add', isLoggedIn, (req, res) =>  {
         console.log(req.user);
         console.log(req.body);

        let newCoin = req.body.abrv;
        //if user alredy has this coin, update qty - later this can be done from table td
        
        // if(User.find({'abrv': newCoin})){
        //     console.log(`already have ${newCoin}`);
        // } else{

           //if user doesn't have this coin yet
            User.findByIdAndUpdate(req.user._id, {
                $push: {"coins": {"abrv": req.body.abrv, "qty": req.body.qty}}

            },
            {upsert: true, new : true},
            function(err, user){
                console.log(user);

            });

       // } // else




    });


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