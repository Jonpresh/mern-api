const mongoose = require('mongoose');


const connectDB = () => {
    const conn =  mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@jpcluster.or2kg.mongodb.net/${process.env.DB_NAME}`, {
        useNewUrlParser: true,
        
        
    });

    console.log('MongoDB is connected');
}

module.exports = connectDB