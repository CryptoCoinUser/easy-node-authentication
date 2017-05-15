var User  = require('../app/models/user');

module.exports = function(app, passport) {

    app.post('/coin/add', isLoggedIn, (req, res) =>  {
        console.log(req.user);
        console.log(req.body);
        User.findByIdAndUpdate(req.user._id, {
            $push: {"coins": {"abrv": req.body.abrv, "qty": req.body.qty}}
        },
        {upsert: true, new : true},
        function(err, user){
            console.log(user);
        });
    });


};
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
 

 /*
OCase.findByIdAndUpdate(req.params.id, {
        $set: {
            subject: req.body.subject,
            description: req.body.description,
            currentStep: req.body.currentStep
        }
    }, callback);

 */