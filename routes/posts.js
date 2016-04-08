var express = require('express');
var router = express.Router();
var mongo = require('mongo');
var db = require('monk')('localhost/nodeblog');
var multer = require('multer');
var upload = multer({ dest: './public/images'});

/* GET posts page. */
router.get('/show/:id', function(req, res, next) {
  var posts = db.get('posts');
  posts.findById(req.params.id, function(err, post){
	  res.render('show', {
	    "post": post
	  });
  });
});

/* GET posts page. */
router.get('/add', function(req, res, next) {
  var db = req.db;
  var categories = db.get('categories');
  categories.find({}, {}, function(err,categories){
	  res.render('addpost', {
	    "title": "Add Post", 
	    "categories": categories
	  });
  });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  var db = req.db;
  var categories = db.get('categories');
  categories.find({}, {}, function(err,categories){
	  res.render('login', {
	    "title": "Add Post", 
	    "categories": categories
	  });
  });
});

/* post login page. */
router.post('/login', function(req, res, next) {
  console.log('Posted Log in');
  res.redirect('/');
});

router.post('/add', upload.single('mainimage'), function(req, res, next){
	// get form values
	var title		= req.body.title;
	var category	= req.body.category;
	var body		= req.body.body;
	var author		= req.body.author;
	var date 		= new Date();

	if(req.file){
		var mainimage = req.file.filename
		}
	else{
			var mainimage = 'noimage.jpg'
		} 
	//Form validator
	req.checkBody('title', 'Title field is required').notEmpty();
	req.checkBody('body', 'Body field is required');

	// Check errors
	var errors = req.validationErrors();

	if(errors){
		res.render('addpost', {
			'errors': errors,
			'title': title,
			'body': body
		});
	} else{
		var posts = db.get('posts');

		// Submit to DB
		posts.insert({
			"title": title,
			"body": body,
			"category": category,
			"date": date,
			"author": author,
			"mainimage": mainimage
		}, function(err, post){
			if(err){
				res.send('There was an issue submitting the post');
			} else{
				req.flash('success', 'Post Submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}
}); 


router.post('/addcomment', function(req, res, next){
	// get form values
	var name = req.body.name;
	var email = req.body.email;
	var postid = req.body.postid;
	var body = req.body.body;
	var commentdate = new Date();
	
	//Form validator
	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('email', 'Email field is required but never displayed').notEmpty();
	req.checkBody('email', 'Email must be in proper format').isEmail();
	req.checkBody('body', 'Body field is required').notEmpty();

	// Check errors
	var errors = req.validationErrors();

	if(errors){
		var post = db.get('posts');
		posts.findById(postid, function(err,post){
			res.render('show', {
				"errors": errors,
				"post": post
			});
		});
	} else{
		var comment = {
			"name": name,
			"email": email,
			"body": body,
			"commentdate": commentdate
		}
		var posts = db.get('posts');
		posts.update({
			"_id":postid
		},{
			$push:{
				"comment":comment
			}
		}, function(err, doc){
			if(err){
				throw err;
			} else{
				req.flash('success', 'Comment Added');
				res.location('/posts/show/'+postid);
				console.log(postid);
				res.redirect('/posts/show/'+postid);
			}

		});
	}
}); 

module.exports = router;
