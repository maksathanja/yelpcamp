const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

// ! Error handling with nonexistent ids
// ! https://youtu.be/eDWPJAzlBfM

// Root route
router.get('/', (req, res) => {
  res.render('landing');
});

// show register form
router.get('/register', (req, res) => {
  res.render('register', { page: 'register' });
});

// handle signup logic
router.post('/register', (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  User.register(new User({ username }), password, (err, user) => {
    return err
      ? // (req.flash('error', `${err.message}.`), res.redirect('register'))
        res.render('register', { error: err.message })
      : (passport.authenticate('local')(req, res, () => {
          req.flash('success', `Welcome to YelpCamp, ${user.username}!`);
          res.redirect('/campgrounds');
        }),
        console.log('New user in town:', user.username));
  });
});

// show login form
router.get('/login', (req, res) => {
  res.render('login', { page: 'login' });
});

// handle login logic
router.post(
  '/login',
  passport.authenticate('local', {
    // successRedirect: '/campgrounds',
    failureRedirect: '/login',
  }),
  (req, res) => {
    // See https://www.udemy.com/the-web-developer-bootcamp/learn/v4/questions/3112532
    // and https://www.udemy.com/the-web-developer-bootcamp/learn/v4/questions/1886146
    // redirect to the last page before login
    const returnTo = req.session.returnTo ? req.session.returnTo : '/campgrounds';
    const userLoggedIn = req.session.passport.user;
    delete req.session.returnTo;
    req.flash('success', `Welcome back, ${userLoggedIn}.`);
    res.redirect(returnTo);
  }
);

// logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged out.');
  res.redirect('/campgrounds');
});

module.exports = router;
