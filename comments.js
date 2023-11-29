// Create web server

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');

// GET comments
router.get('/', function(req, res, next) {
  Comment.find(function(err, comments){
    if(err){ return next(err); }

    res.json(comments);
  });
});

// POST comments
router.post('/', function(req, res, next) {
  var comment = new Comment(req.body);

  comment.save(function(err, comment){
    if(err){ return next(err); }

    res.json(comment);
  });
});

// Preload comment objects on routes with ':comment'
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});

// GET comment
router.get('/:comment', function(req, res) {
  res.json(req.comment);
});

// PUT comment
router.put('/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});

// POST comment
router.post('/:comment/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.comment;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.comment.comments.push(comment);
    req.comment.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

module.exports = router;