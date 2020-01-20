const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const database = `mongodb+srv://${username}:${password}@clusterone-36qke.mongodb.net/yelp_camp?retryWrites=true&w=majority`;

// Connect to database with mongoose
mongoose.connect(database, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Campground Schema Setup
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

const Campground = mongoose.model('Campground', campgroundSchema);

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
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      // render show template with that campground
      res.render('show', { campground: foundCampground });
      console.log('Here you go:');
      console.log(foundCampground);
    }
  });
  // render show template with that campground
});

app.listen(port, () => {
  console.log(`The YelpCamp server has started on port ${port}`);
});
