var express = require('express');
var moment = require('moment');
var bodyParser = require('body-parser');
var mongoose = require('mongoose-promised');
var hbs = require('hbs');
var config = require('./config');

var app = express();

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

// Database Schema

var articleSchema = {
	id : Number,
	title : String,
	body : String,
	published : String
}


var Article = mongoose.model('Article', articleSchema, 'articles');

app.get('/', function(req, res) {
	Article.find(function(err, entries) {
		res.render('index', {
			title: "My Blog",  
			className: "home",
			entries:entries
		});
	});
});

app.get('/about', function(req, res) {
	res.render('about', {
		title: "About me",  
		className: "about"
	});
});

app.get('/article/:id', function(req, res) {
	Article.where({id: req.params.id}).findOne(function(err, entry) {
		res.render('article', {title: entry.title, blog:entry });
	})
});

// Post, Update , Delete System 

// for too many post calculate 
var randomNumber = function() {
	 return Math.floor((Math.random() * 9999) + 1);
}
// date system
var publishedDate = function() {
	return moment().format('MMMM Do YYYY | h:mm:ss a');
}

// add post system 
app.get('/addpost', function(req, res) {
	res.render('addpost', {
		title: "A your new post",
		className:"addpost"
	})
});

app.post('/add', function(req, res) {
	var article = new Article ({
		id : randomNumber(),
		title: req.body.title,
		body: req.body.body,
		published: publishedDate()
	});
	article.saveQ().then(function() {
		Article.find(function(err, entries) {
			res.render('index', {title:"My blog", entries:entries});
		});
	}).catch(function(err) {
		console.log('There was a problem');
	});
});





// Database connection 
 mongoose.connect(config.database, function(err) {
 	if (err) {
 		console.log(err);
 	} else {
 		console.log('Database connected successfuly');
 	}
 });
// server connection
 app.listen(3000, function(err) {
 	if(err) {
 		console.log(err);
 	} else {
 		console.log('Server is running http://localhost:3000');
 	}
 });