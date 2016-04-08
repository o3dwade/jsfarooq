var express = require('express');
var router = express.Router();
var mongo = require('mongo');
var db = require('monk')('localhost/nodeblog');

/* GET posts page. */
router.get('/add', function(req, res, next) {
  res.render('addcategory', {
    "title": "Add Category", 
  });
});

/* GET posts page. */
router.get('/show/:category', function(req, res, next) {
  var posts = db.get('posts');
  posts.find({category : req.params.category }, {}, function(err, posts){
	  res.render('index', {
	    "title": req.params.category, 
	    "posts": posts
	  });
  });
});

router.post('/add', function(req, res, next) {
	var name = req.body.name;
	req.checkBody('name', 'Name field is required').notEmpty();

	// Check errors
	var errors = req.validationErrors();

	if(errors){
		res.render('addpost', {
			'errors': errors,
			'title': title, 
			'body': body
		});
	} else{
		var categories = db.get('categories');
		// Submit to DB
		categories.insert({
			"name": name,
		}, function(err, post){
			if(err){
				res.send('There was an issue submitting the category');
			} else{
				req.flash('success', 'Category added');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;