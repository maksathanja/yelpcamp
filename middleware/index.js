/* eslint-disable no-underscore-dangle */
/* eslint-disable no-lonely-if */
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// All middleware goes here
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash('error', 'Campground not found.');
        res.redirect('/campgrounds');
      } else {
        // does user own the campground?
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', `You don't have permission to do that.`);
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'Please login to proceed.');
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        req.flash('error', 'Comment not found.');
        res.redirect('back');
      } else {
        // does user own the comment?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', `You don't have permission to do that.`);
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', `You don't have permission to do that.`);
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
    req.flash('error', 'Please login to proceed.');
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
  }
};

module.exports = middlewareObj;
