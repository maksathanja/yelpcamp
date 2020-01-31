const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');
require('dotenv').config();

seedDB();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT;
const database = process.env.DATABASE;

// Connect to database with mongoose
mongoose.connect(database, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Root route
app.get('/', (req, res) => {
  res.render('landing');
});

// *** RESTful Routes ***
// * INDEX - Campgrounds
app.get('/campgrounds', (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds });
      // * Also can be done like the following
      // * Campground.find({}, (err, allCampgrounds) => { ...
      // * res.render('index', campgrounds: allCampgrounds);
    }
  });
});

// * CREATE - add new campground to DB
app.post('/campgrounds', (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const { description } = req.body;
  const newCampground = { name, image, description };
  // Create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // redirect back to /campgrounds page
      res.redirect('/campgrounds');
      console.log('Newly created campground:', newlyCreated);
    }
  });
});

// * NEW - show form to create new campground
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

// * SHOW - shows more info about one campground
app.get('/campgrounds/:id', (req, res) => {
  // find the campground with the provided ID
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        // render show template with that foundCampground
        res.render('campgrounds/show', { campground: foundCampground });
        console.log('Found Campground:', foundCampground);
      }
    });
});

// =========================
// * COMMENTS ROUTES
// =========================

// * NEW Route
app.get('/campgrounds/:id/comments/new', (req, res) => {
  // find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

// * SHOW Route
app.post('/campgrounds/:id/comments', (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  // lookup campground using ID
  Campground.findById(id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // create new comment
      Comment.create(comment, (err, newComment) => {
        if (err) {
          console.log(err);
        } else {
          // connect new comment to campground
          campground.comments.push(newComment);
          campground.save();
          console.log('New Comment added', newComment);
          // redirect campground show page
          res.redirect(`/campgrounds/${id}`);
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`The YelpCamp server has started on port ${port}`);
});
