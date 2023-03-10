const jwt = require('jsonwebtoken');

const ErrorResponse = require('../utils/errorResponse')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('Authentications failed!');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return next(new ErrorResponse("Authentication  failed", 403 ));
  }
};
