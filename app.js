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
});

const Campground = mongoose.model('Campground', campgroundSchema);

// Root route
app.get('/', (req, res) => {
  res.render('landing');
});

// Campgrounds route
app.get('/campgrounds', (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log('Something happened:');
      console.log(err);
    } else {
      res.render('campgrounds', { campgrounds });
      // ? Also can be done like the following
      // * Campground.find({}, (err, allCampgrounds) => { ...
      // * res.render('campgrounds', campgrounds: allCampgrounds);
    }
  });
});

app.post('/campgrounds', (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const newCampground = { name, image };
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

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

app.listen(port, () => {
  console.log(`The YelpCamp server has started on port ${port}`);
});
