/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-return-assign */
/* eslint-disable no-shadow */
const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');
// { mergeParams: true } will access id of the comments
const router = express.Router({ mergeParams: true });

// NEW Comments Route
router.get('/new', middleware.isLoggedIn, (req, res) => {
  // find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    return err ? console.log(err) : res.render('comments/new', { campground });
  });
});

// CREATE Comments Route
router.post('/', middleware.isLoggedIn, (req, res) => {
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
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  const campgroundId = req.params.id;
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    return err
      ? res.redirect('back')
      : res.render('comments/edit', { campground_id: campgroundId, comment: foundComment });
  });
});

// UPDATE Comments Route
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  const campgroundId = req.params.id;
  const commentId = req.params.comment_id;
  const inputComment = req.body.comment;
  Comment.findByIdAndUpdate(commentId, inputComment, err => {
    return err ? res.redirect('back') : res.redirect(`/campgrounds/${campgroundId}`);
  });
});

// DESTROY Comments Route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  // findByIdAndRemove
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    return err ? res.redirect('back') : res.redirect(`/campgrounds/${req.params.id}`);
  });
});

module.exports = router;
