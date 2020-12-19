const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating the Schema
 const UserSchema = new Schema({
     username: {
         type: String,
         required: true,
         unique: true,
     },
     password: {
         type: String,
         required: true
     },
     displayName: {
         type: String,
         required: true
     }
 })

 module.exports = User = mongoose.model('User',UserSchema);
