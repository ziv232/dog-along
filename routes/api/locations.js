const express = require('express');
const router = express.Router();
const auth = require('../../utils/auth');

const Location = require('../../models/location');

router.get('/',(req, res) => {
    Location.find().then(location => res.json(location))
})

router.post('/add', auth, (req, res) =>{
    const data = req.body;
    const newLocation = new Location(data);
    console.log(newLocation);

    newLocation.save().then(location => res.status(200).json(location)).catch(err => console.log(err));
})


router.post('/review', (req, res) => {
    const data = req.body;
    Location.find({
        district: {$in: data.districts},
        category: {$in: data.categories},
        reference: {$eq: null}
    }).exec().then(data => {
        console.log(data)
        res.status(200).json(data)
    }).catch('The Operation Failed!')
})

router.get('/fetchStories/:id', (req, res) => {
    Location.find({
        reference: {$eq: req.params.id}
    }).exec().then( data => {
        console.log(data)
        res.status(200).json(data)})
        .catch(err => res.status(400).json(err));
})


module.exports = router;
