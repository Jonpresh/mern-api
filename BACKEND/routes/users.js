const express = require('express')
const { check } = require('express-validator')
const fileUpload = require('../middleware/file-upload')

const {
    getUsers,
    signup,
    login
} = require('../controllers/users')



const router = express.Router() 

router.get('/', getUsers)


router.post('/signup', fileUpload.single('image')
, [ 
                        check('email').normalizeEmail().isEmail(),
                        check('password').isLength({min: 6}), 
                        check('name').notEmpty(),
                        ],  
            signup)



router.post('/login', login)


module.exports = router;