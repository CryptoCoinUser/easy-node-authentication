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
    before(function() {
      let user = new User;
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

    // after(function() {
    //   return closeServer();
    // });


    // switch currency
    it('switch currency for new user', function() {
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
      let coinQtyPair = {abrv: "BTC", qty: 100}
      return chai.request(app)
        .post('/coin/add')
        .send(coinQtyPair)
        .then(function(res) {
          expect(res.body.savedUser.coins["BTC"]).to.equal(100);
        })
        // .catch(function(err){
        //   // console.log(err);
        // });
    });


    // delete user

    
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
});

