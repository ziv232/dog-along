const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating the Schema
const RefreshTokenSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
})

module.exports = refreshToken = mongoose.model('refreshToken',RefreshTokenSchema);
