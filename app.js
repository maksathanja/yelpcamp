const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const seedDB = require('./seeds');

// requiring routes
const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const authRoutes = require('./routes/index');
require('dotenv').config();

const app = express();
const database = process.env.DATABASE;
const port = process.env.PORT;

// seedDB();

app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));

// PASSPORT CONFIGURATION
app.use(
  session({
    secret: 'There and Back Again! A Book by Bilgo Baggins.',
    resave: false,
    saveUninitialized: false,
  })
);
// These should come after 'app.use(session({}))'
// 'session()' below refers to a strategy bundled with Passport.
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// add currentUser to every single route
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Connect to database with mongoose
mongoose.connect(database, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(port, () => {
  console.log(`The YelpCamp server has started on port ${port}`);
});
