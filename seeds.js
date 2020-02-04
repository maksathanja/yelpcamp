/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
// const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const seeds = [
  {
    name: 'Scout Camp',
    image: 'https://cdn.pixabay.com/photo/2016/11/08/05/03/adventure-1807495_960_720.jpg',
    description:
      'Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic. Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.',
  },
  {
    name: 'Rocky Mountain',
    image: 'https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_960_720.jpg',
    description:
      'Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter purslane kale. Celery potato scallion desert raisin horseradish spinach carrot soko. Lotus root water spinach fennel kombu maize bamboo shoot green bean swiss chard seakale pumpkin onion chickpea gram corn pea. Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress. Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke.',
  },
  {
    name: 'Laky Hollow',
    image:
      'https://cdn.pixabay.com/photo/2018/12/20/13/58/tent-at-woolly-hollow-3886077_960_720.jpg',
    description:
      'Soko radicchio bunya nuts gram dulse silver beet parsnip napa cabbage lotus root sea lettuce brussels sprout cabbage. Catsear cauliflower garbanzo yarrow salsify chicory garlic bell pepper napa cabbage lettuce tomato kale arugula melon sierra leone bologi rutabaga tigernut. Sea lettuce gumbo grape kale kombu cauliflower salsify kohlrabi okra sea lettuce broccoli celery lotus root carrot winter purslane turnip greens garlic. Jícama garlic courgette coriander radicchio plantain scallion cauliflower fava bean desert raisin spring onion chicory bunya nuts. Sea lettuce water spinach gram fava bean leek dandelion silver beet eggplant bush tomato.',
  },
];

const seedDB = () => {
  // Delete all campgrounds
  Campground.deleteMany({}, err => {
    if (err) {
      console.log(err);
    } else {
      console.log('Removed all campgrounds.');
      // Delete all comments
      Comment.deleteMany({}, err => {
        if (err) {
          console.log(err);
        } else {
          console.log('Removed all comments.');
        }
      });
      // Add new campgrounds
      seeds.forEach(seed => {
        Campground.create(seed, (err, campground) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Added a campground from seed.');
            // Create a comment
            Comment.create(
              {
                text: 'This place is great, but I wish there was internet',
                author: 'Homer',
              },
              (err, comment) => {
                if (err) {
                  console.log(err);
                } else {
                  campground.comments.push(comment);
                  campground.save();
                  console.log('Created new comment');
                }
              }
            );
          }
        });
      });
    }
  });
};

// * Get rid of 'callback hell' with async
// async function seedDB() {
//   try {
//     await Campground.deleteMany({});
//     console.log('All campgrounds removed!');
//     await Comment.deleteMany({});
//     console.log('All comments removed!');

//     for (const seed of seeds) {
//       const campground = await Campground.create(seed);
//       console.log('Campground created');
//       const comment = await Comment.create({
//         text: 'This place is great, but I wish there was internet',
//         author: 'Homer',
//       });
//       console.log('Comment created');
//       campground.comments.push(comment);
//       campground.save();
//       console.log('Comment added to campground');
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }

module.exports = seedDB;
