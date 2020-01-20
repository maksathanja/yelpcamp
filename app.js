const express = require('express');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
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

  res.render('campgrounds', { campgrounds });
});

app.listen(port, () => {
  console.log(`The YelpCamp server has started on port ${port}`);
});
