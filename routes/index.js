var express = require('express');
var router = express.Router();
var mongo = require('mongo');
//Try to delete these, it should still find these from app.js
var db = require('monk')('localhost/nodeblog');

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({},{},function(err, posts){
  	res.render('index', {
  		"posts": posts
  	});
  });
});




module.exports = router;