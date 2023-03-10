const fs = require('fs')
const { validationResult} = require('express-validator')
const mongoose = require('mongoose')


const ErrorResponse = require('../utils/errorResponse')
//const getcoordsForAddress = require('../utils/geocode')
const Place = require('../models/Place')
const User = require('../models/User')


exports.getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid 

    const place = await Place.findById(placeId)

    if (!place) {
       throw new ErrorResponse(' Could not find a place for the provided placeID', 404);
     }

    res.json({
        place: place.toObject({getters: true}) 
    })
}


exports.getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid
    
    let userWithPlaces

    try {
        userWithPlaces = await User.findById(userId).populate('places')
    } catch (error) {
        next(new ErrorResponse('getting Places failed ', 500))
    }

    if (!userWithPlaces || userWithPlaces.places.length === 0 ) {
       return next(new ErrorResponse(' Could not find  places for the provided userID', 404));  
    }

    res.json({places: userWithPlaces.places.map(place=> place.toObject({getters: true}))})
}

exports.createPlace = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        console.log(errors)
        next(new ErrorResponse('invalid inputs ', 422))
    }

    const {title, description, coordinates, address} = req.body;

    const createdPlace = new Place({
        title,
        description,
        location:coordinates,
        address,
        image:req.file.path,
        creator: req.userData.userId 
    });

    let user;

    try {
        user = await User.findById(req.userData.userId)
    } catch (error) {
        next(new ErrorResponse('Creating Place failed ', 500))
    }

    if (!user) {
     return   next(new ErrorResponse('Could not find user for provided id ', 404))
    }

    console.log(user)
    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await createdPlace.save({session: sess})
         user.places.push(createdPlace)
        await user.save({session: sess})
        await sess.commitTransaction()
    } catch (error) {
       return  next(new ErrorResponse('Creating Place failed ', 500))
    }
     
    res.status(200)
        .json({success: true, place: createdPlace})
}



exports.updatePlace = async (req, res, next) => {

    let place = await Place.findById(req.params.pid);

    if (!place) {
        return next(new ErrorResponse(`Place not found with id of ${req.params.id}`, 404));
    };

    if (place.creator.toString() !== req.userData.userId) {
        return   next(new ErrorResponse('You are not allowed to edit this place ', 401))
    }
    
    const updatedPlace= await Place.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).send({success: true, place: updatedPlace});
  };
  


  exports.deletePlace = async (req, res, next) => {
    let place

    try {
         place = await Place.findById(req.params.pid).populate('creator');
    } catch (error) {
        next(new ErrorResponse('Deleting Place failed ', 500))
    }


    if (!place) {
        return next(new ErrorResponse(`place not found with id of ${req.params.pid}`, 404));
    };

    if (place.creator.id !== req.userData.userId) {
        return   next(new ErrorResponse('You are not allowed to delete this place ', 401))
    }
    
    const imagePath = place.image
    

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await place.remove({session: sess})
        await place.creator.places.pull(place)
        await place.creator.save({session: sess})
        await sess.commitTransaction()
    } catch (error) {
        next(new ErrorResponse('Deleting Place failed ', 500))
    }
     
    fs.unlink(imagePath, err => {
        console.log(err)
    })

    res.status(200).send({success: true, data:{} });
  };