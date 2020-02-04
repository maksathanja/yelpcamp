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

// Comments NEW Route
router.get('/new', isLoggedIn, (req, res) => {
  // find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    return err ? console.log(err) : res.render('comments/new', { campground });
  });
});

// Comments SHOW Route
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

module.exports = router;
