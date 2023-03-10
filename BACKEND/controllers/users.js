const { v4: uuidv4 } = require('uuid')
const { validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')


exports.getUsers = async (req, res, next) => {
  let users;
  try {
     users = await User.find({}, '-password')
    
  } catch (error) {
    return next(new ErrorResponse("Invalid Input", 422 ));
  }
  res.json({users: users.map(user =>user.toObject({getters: true}))})
}



exports.signup = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        console.log(errors)
        return next(new ErrorResponse("Invalid Input", 422 ));
    }
    
    const {name, email, password} = req.body

    const existingUser = await User.findOne({email:email})

    if (existingUser) {
        return next(new ErrorResponse("User exists already, login instead", 422 ));
    };

    //Hashing the password, so it does not become visible
    let hashedPassword;
    try {
     hashedPassword = await bcrypt.hash(password, 12)
    } catch (error) {
      return next(new ErrorResponse("Could not create user, please try again", 500 ))
    }

    const createdUser = await User.create({
        name, 
        email, 
        password: hashedPassword,
        image:  req.file.path ,
        places: []
    });

    // creating a token 
    let token
    try {
      token = jwt.sign({userId: createdUser.id, email: createdUser.email}, process.env.JWT_KEY, {expiresIn: '1h'})
    } catch (error) {
      return next(new ErrorResponse("Could not create user, please try again", 500 ))
    }
    
    res.status(201)
        .json({userId: createdUser.id, email: createdUser.email, token:token})
}



exports.login = async (req, res, next) => {

    const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

    // Check for user
   const existingUser = await User.findOne({ email }).select('+password');

  // if (!existingUser || existingUser.password !== password) {
  //   return next(new ErrorResponse("Invalid a credentials ", 401 ));
  // }

  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password)

  } catch (error) {
    return next(new ErrorResponse("Could not log you in, invalid credentials ", 500 ));
  }

  if (!isValidPassword) {
    return next(new ErrorResponse("Invalid an credentials ", 401 ));
  }

   // creating a token 
   let token
   try {
     token = jwt.sign({userId: existingUser.id, email: existingUser.email}, process.env.JWT_KEY, {expiresIn: '1h'})
   } catch (error) {
     return next(new ErrorResponse("Could not create user, please try again", 500 ))
   }

 
  res.status(200)
        .json({
          userId: existingUser.id,
          email: existingUser.email,
          token: token

        })

}
