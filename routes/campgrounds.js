/* eslint-disable no-underscore-dangle */
const express = require('express');
const Campground = require('../models/campground');

const router = express.Router();

// middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
  }
};

// INDEX - Campgrounds
router.get('/', (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    return err
      ? console.log(err)
      : res.render('campgrounds/index', { campgrounds: allCampgrounds });
  });
});

// CREATE - add new campground to DB
router.post('/', isLoggedIn, (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const { description } = req.body;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  const newCampground = { name, image, description, author };
  // Create a new campground and save to DB
  Campground.create(newCampground, (err /* , newlyCreated */) => {
    return err ? console.log(err) : res.redirect('/campgrounds');
  });
});

// NEW - show form to create new campground
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// SHOW - shows more info about one campground
router.get('/:id', (req, res) => {
  // find the campground with the provided ID
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, foundCampground) => {
      return err
        ? console.log(err)
        : res.render('campgrounds/show', { campground: foundCampground });
    });
});

module.exports = router;
