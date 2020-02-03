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
            : (campground.comments.push(newComment),
              campground.save(),
              res.redirect(`/campgrounds/${id}`),
              console.log('New comment added', newComment));
        });
  });
});

module.exports = router;
