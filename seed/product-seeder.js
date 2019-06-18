var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect("mongodb+srv://admin:aluthra1403@cluster0-mrukq.gcp.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });
var products = [
new Product({
	imagePath:'https://images.unsplash.com/photo-1545160995-4c0f38b9b3e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80',
	title:'Fresh Apple',
	description: 'Take apple a day and keep doctor away!!!',
	price: 100,
	qty:20
}),
new Product({
	imagePath:'https://images.unsplash.com/photo-1518596689038-8ff493785c2c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1266&q=80',
	title:'Delicious Grapes',
	description: 'Save 20 Rs. Now!!!',
	price: 50,
	qty:50
}),
new Product({
	imagePath:'https://images.unsplash.com/photo-1543218024-57a70143c369?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80',
	title:'BANANA',
	description: 'GO OUT AND GET BANANA!!!',
	price: 100,
	qty:60
}),
new Product({
	imagePath:'https://images.unsplash.com/photo-1502741282025-a9c6a20aa697?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
	title:'Water Melon',
	description: 'Faviourate One!!!',
	price: 100,
	qty:100
}),
new Product({
	imagePath:'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80',
	title:'Strawberry',
	description: 'Sweet and Delicious!!!',
	price: 300,
	qty:40
}),
new Product({
	imagePath:'https://images.unsplash.com/photo-1534723570441-4c448d1010e5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
	title:'MANGO',
	description: 'Fresh and Delicious!!!',
	price: 400,
	qty:100
})
];
var done =0;
for(var i=0; i<products.length; i++){
	products[i].save(function(err,result){
		done++;
		if (done == products.length) {
			exit();
		}
	});
}function exit(){
	mongoose.disconnect();
}