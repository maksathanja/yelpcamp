const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT;

const campgrounds = [
  {
    name: 'Salmon Creek',
    image:
      'https://cdn.pixabay.com/photo/2017/06/17/03/17/gongga-snow-mountain-2411069_960_720.jpg',
  },
  {
    name: 'Granite Hill',
    image: 'https://cdn.pixabay.com/photo/2015/07/10/17/24/night-839807_960_720.jpg',
  },
  {
    name: "Mountain Goat's Rest",
    image: 'https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_960_720.jpg',
  },
];

app.get('/', (req, res) => {
  res.render('landing');
});

// Campgrounds route
app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', { campgrounds });
});

app.post('/campgrounds', (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const newCampground = { name, image };
  // get data from form and add to campgrounds array
  campgrounds.push(newCampground);
  // redirect back to /campgrounds page
  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

app.listen(port, () => {
  console.log(`The YelpCamp server has started on port ${port}`);
});
