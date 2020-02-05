/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-return-assign */
/* eslint-disable no-shadow */
const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');
// { mergeParams: true } will access id of the comments
const router = express.Router({ mergeParams: true });

// middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
  }
};

// NEW Comments Route
router.get('/new', isLoggedIn, (req, res) => {
  // find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    return err ? console.log(err) : res.render('comments/new', { campground });
  });
});

// CREATE Comments Route
router.post('/', isLoggedIn, (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  // lookup campground using ID
  Campground.findById(id, (err, campground) => {
    return err
      ? (console.log(err), res.redirect('/campgrounds'))
      : Comment.create(comment, (err, newComment) => {
          return err
            ? console.log(err)
            : // add username and id to comment
              ((newComment.author.id = req.user._id),
              (newComment.author.username = req.user.username),
              // save comment
              newComment.save(),
              campground.comments.push(newComment),
              campground.save(),
              res.redirect(`/campgrounds/${id}`));
        });
  });
});

// EDIT Comments Route
router.get('/:comment_id/edit', (req, res) => {
  const campgroundId = req.params.id;
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    return err
      ? res.redirect('back')
      : res.render('comments/edit', { campground_id: campgroundId, comment: foundComment });
  });
});

// UPDATE Comments Route
router.put('/:comment_id', (req, res) => {
  const campgroundId = req.params.id;
  const commentId = req.params.comment_id;
  const inputComment = req.body.comment;
  Comment.findByIdAndUpdate(commentId, inputComment, (err, updatedComment) => {
    return err ? res.redirect('back') : res.redirect(`/campgrounds/${campgroundId}`);
  });
});

module.exports = router;
