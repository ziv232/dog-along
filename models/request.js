const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Creating the Schema
const RequestSchema = new Schema({
    location: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true,
        }
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
    donorInstagram: {
        type: String,
        required: false
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

RequestSchema.index({location: '2dsphere'});

module.exports = Request = mongoose.model('Request',RequestSchema);

