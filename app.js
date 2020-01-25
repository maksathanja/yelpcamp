const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const seedDB = require('./seeds');
require('dotenv').config();

seedDB();

const app = express();
app.set('view engine', 'ejs');
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
      res.render('index', { campgrounds });
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
    }
  });
});

// * NEW - show form to create new campground
app.get('/campgrounds/new', (req, res) => {
  res.render('new');
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
        res.render('show', { campground: foundCampground });
        console.log(foundCampground);
      }
    });
});

app.listen(port, () => {
  console.log(`The YelpCamp server has started on port ${port}`);
});
