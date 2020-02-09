/* eslint-disable no-underscore-dangle */
/* eslint-disable no-lonely-if */
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// All middleware goes here
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        res.redirect('back');
      } else {
        // does user own the campground?
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back');
      } else {
        // does user own the comment?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};

// See https://www.udemy.com/the-web-developer-bootcamp/learn/v4/questions/3112532
// and https://www.udemy.com/the-web-developer-bootcamp/learn/v4/questions/1886146
// redirect to the last page before login
middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    // flash message should be before redirect
    req.flash('error', 'Please login first.');
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
  }
};

module.exports = middlewareObj;
