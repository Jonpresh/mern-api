const mongoose = require ('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
      },
      email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
      },
      password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
      },
      image: {
        type: String,
        required: [true, 'Please add an image']
      },
      places: [{
        type:mongoose.Types.ObjectId, 
        required: true,
        ref: 'Place'
    }]
  });

  userSchema.plugin(uniqueValidator)
  
 
  
  module.exports = mongoose.model('User', userSchema);
  