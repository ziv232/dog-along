const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Creating the Schema
const RequestSchema = new Schema({
    coordinates: {
        type: Array,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photos: {
        urls: {
             type: Array,
             required: true
         },
         publicIds: {
             type: Array,
             required: true
         }
     },
    donor: {
        type: String,
        required: true
    },
    comments: {
        type: Array,
        required: true
    },
    reference: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Request = mongoose.model('Request',RequestSchema);

