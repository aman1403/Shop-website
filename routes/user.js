var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var User = require('../models/user');
var Order = require('../models/order');
var Cart = require('../models/cart');

 // var MongoClient = require('mongodb').MongoClient;
 // var url = "mongodb://localhost:27017/shopping";
var csrfProtection = csrf();
router.use(csrfProtection);
///------User Porfile 

     // var cart;
        // orders.forEach(function(order) {
        //     cart = new Cart(order.cart);
        //     order.items = cart.generateArray();
        // });
        // res.render('user/admin', { orders: orders });
router.get('/admin', isLoggedIn, function (req,res,next) {
      // mongoose.connect(url,{ useNewUrlParser: true } ,function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("shopping");
//   dbo.collection("orders").find({}).toArray(function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     res.render('user/admin', { orders: result});
//     db.close();
//   });
// }); 
Order.find({},function(err,orders){
    if(err){
        res.send('something went wrong!!');
        next();
    }
            var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
    console.log(orders);

   // for (var i=0;i<orders.length;i++){orders[i]}
   res.render('user/admin', { orders: orders}); 
});
});
        
  
router.get('/profile', isLoggedIn, function (req, res, next) {
    Order.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }      
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        console.log(orders);
        res.render('user/profile', { orders: orders });
    });
});
router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});
///////for user sign up
router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
   // console.log(req.body);
     if(req.body.email == "aluthra1403@gmai.com" && req.body.password == "hariomji"){
                 res.redirect('/user/admin');
     }
    else{
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
         //console.log("Aman");
        res.redirect('/user/profile');
    }
}
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}