const express = require('express')
const { check } = require('express-validator')
const fileUpload = require('../middleware/file-upload')
const authMiddleware = require('../middleware/auth')

const {
    getPlaceById, 
    getPlacesByUserId, 
    createPlace,
    updatePlace, 
    deletePlace
} = require('../controllers/places')

const router = express.Router() 

router.get('/:pid', getPlaceById)

router.get('/user/:uid',  getPlacesByUserId )

router.use(authMiddleware)

router.post('/',  fileUpload.single('image'), [check('title').notEmpty(), 
                    check('description').isLength({min: 5}), 
                    check('address').notEmpty()], createPlace)

router.patch('/update/:pid', [check('title').notEmpty(), 
check('description').isLength({min: 5})], updatePlace)

router.delete('/:pid', deletePlace)

module.exports = router;