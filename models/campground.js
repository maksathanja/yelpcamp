const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

// * pre-hook for deleting associated comments
// * to use code below, first uncomment the code in campground Destroy route
// ? https://www.youtube.com/watch?v=5iz69Wq_77k

// const Comment = require('../models/comment');
// campgroundSchema.pre('remove', async () => {
//   await Comment.remove({
//     _id: {
//       $in: this.comments,
//     },
//   });
// });

module.exports = mongoose.model('Campground', campgroundSchema);
