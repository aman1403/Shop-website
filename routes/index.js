var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var mongoose = require('mongoose');
var Product = require('../models/product');
var Order = require('../models/order');
const nodemailer = require('nodemailer');
const log = console.log;
const alert = require('alert-node');
/* GET home page. */
 j=0;
router.get('/', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', {title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
    });
});

router.get('/stock', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/inde', {title: 'Stock Management', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
    });
});
router.get('/delete/:id', function (req, res, next) {
    var productId = req.params.id;

    Product.findById(productId, function(err, product) {
       if (err) {
           return res.redirect('/');
       }
       Product.findOneAndUpdate(productId,function(err,product){
            product.qty = product.qty -1;
       })
       console.log(product.qty);
        Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
       res.render('shop/inde',{title: 'Stock Management', products: productChunks});
});
})
});
router.get('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product) {
       if (err) {
           return res.redirect('/');
       }
        cart.add(product, product.id);
        req.session.cart = cart;
        alert('Successfully added this item to your Shopping Cart ');
        res.redirect('/');

    });
});

router.get('/remov/:id',function(req,res,next){
    // var productId = req.params.id;
    // var cart = new Cart(req.session.cart ? req.session.cart: {} );
    // console.log(productId);
    // cart.reducebyon(productId);
    // res.redirect('/user/admin');
   // var OdrerId = req.params.id;
     Order.findOneAndDelete(req.params.id, function(err) {
        if (err)
            res.send(err);
        else
             console.log('Offer Deleted!');
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
})
router.get('/reduce/:id',function(req,res,next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart: {} );
    cart.reducebyone(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});
router.get('/remove/:id',function(req,res,next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart: {} );
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});
router.get('/shopping-cart', function(req, res, next) {
   if (!req.session.cart) {
       return res.render('shop/shopping-cart', {products: null});
   } 
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});
router.get('/about', function(req, res, next) {
    res.render('shop/about');
});
router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];

    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});
router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            phoneno:req.body.phoneno
        });
        alert('Just Check Your Email inbox as well as spam email inbox');
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
            let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:'aluthra1403@gmail.com', // TODO: your gmail account
        pass:'vluthra2504' // TODO: your gmail password
    }
});
            console.log(order.cart.items);

var email = req.user.email;
// Step 2
 var arr = [];
        for (var id in order.cart.items) {
            arr.push(order.cart.items[id]);
        }
var html = '';
var vtml='';
var i;        
var price=0;
 for ( i=0;i<arr.length;i++) {
        price = price + arr[i].price;
  html +='<font size='+3 +'color='+'black'+'>'+ arr[i].item.title + '<br>'+'<img src='+ arr[i].item.imagePath + 'height='+100+' '+'width='+100+'>'+'<br>'+'<font size='+3 +'color='+'black'+'>'+'Qty:-'+arr[i].qty+'<br>'+'<font size='+3 +'color='+'black'+'>'+'price:-'+arr[i].price+'<br>'
}
 vtml += 'Total items:-'+arr.length +'<font size='+5+'>'+'<br>'+html;


let mailOptions = {

    from: "Subzi Mandi"+"<aluthra1403@gmail.com>", // TODO: email sender
    to:email , // TODO: email receiver
    subject: 'Order Confirmation',
    html: "Hello,<br>"+"<font size="+5 +"color="+"black"+">"+"Your Order Details are:-<br>" +vtml+'<br>'+'Total price:-'+price+"<br>"+"<font size="+1 +"color="+"green"+">"+"Thanks For Shopping!!"+"<br>"+"Fruits Shop,Bhiwani"
// Step 3
}
transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
        return log('Error occurs');
    }
    return log('Email sent!!!');
});    
 
//launch it.

        });
    }); 

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}