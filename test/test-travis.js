process.env.NODE_ENV = 'test';
var User  = require('../app/models/user');
var passport = require('passport');

const chai = require('chai');
const chaiHttp = require('chai-http');
//const faker = require('faker');
let {app} = require('../server');
const should = chai.should();
const expect = chai.expect;



chai.use(chaiHttp);

describe('endpoints with authenticated user', function() {
    /**/
    let user;
    before(function() {
      user = new User;
      user.local.email = 'example@example.com';
      user.local.password = 'abc123';
      return user.save()
      .then(user => {

        app.use('*', (req, res, next) => {
          //console.log('Server.js INSIDE APP.USE');
          req.user = user;
          req.isAuthenticated = function() {
            return true;
          };
          next();
        });

        require('../app/routes.js')(app, passport); 
        require('../app/coinrouter.js')(app, passport);

        //console.log('Server.js END of APP.USE')
        app.listen(3030);
      });
    });

    after(function() {
      User.findByIdAndRemove(user._id)
      .exec()
      .then(function(deletedUser) {
        console.log("AFTER: deleted test user " + deletedUser);
      });
    });


    // switch currency
    it('switch new user', function() {
      let curObject = {cur : "cny"}
      return chai.request(app)
        .post('/user/cur')
        .send(curObject)
        .then(function(res) {
            expect(res.body.cur).to.equal("cny");
        })
        // .catch(function(err){
        //   // console.log(err);
        // });
    });


    //add coin
    it('add coin for new user', function() {
      const magicQty = 2;
      const supportedCoin = "BTC"
      let coinQtyPair = {abrv: supportedCoin, qty: magicQty}
      return chai.request(app)
        .post('/coin/add')
        .send(coinQtyPair)
        .then(function(res) {
          expect(res.body.savedUser.coins[supportedCoin]).to.equal(magicQty);
          expect(res.body.savedUser.coins[supportedCoin]).to.be.at.least(0, 'should not be negative');
        })
        // .catch(function(err){
        //   // console.log(err);
        // });
    });


    //app.put('/coin/qty'
    it('put/change qty of new user\'s coin', function() {
      const supportedCoin = "BTC";
      const magicQty = 3;
      let coinQtyPair = {abrv: supportedCoin, qty: magicQty}
      return chai.request(app)
        .put('/coin/qty')
        .send(coinQtyPair)
        .then(function(res) {
          expect(res.body.savedUser.coins[supportedCoin]).to.equal(magicQty);
        })
        // .catch(function(err){
        //    console.log(err);
        // });
    });

    //delete coin
    it('delete new user\'s coin', function() {
      const coinObject = {abrv: "BTC"};
      return chai.request(app)
        .delete('/coin/delete')
        .send(coinObject)
        .then(function(res) {
          expect(res.body.savedUser.coins[coinObject.abrv]).to.equal(-1);
        })
        // .catch(function(err){
        //    console.log(err);
        // });
    });

    
 }); // end describe auth


describe('non-autheticated endpoints', function() {

 it('slash should return home page', function() {
      require('../app/routes.js')(app, passport); 
      require('../app/coinrouter.js')(app, passport);
    return chai.request(app)
      .get('/')
      .then(function(res) {
        console.log('res is ' + res);
        res.should.have.status(200);

      })
  });

  /**/
  it('/login should return login page', function() {
    return chai.request(app)
      .get('/login')
      .then(function(res) {
        res.should.have.status(200);
      });
  });

  //refresh coin prices?

});

