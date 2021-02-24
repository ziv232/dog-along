const express = require('express');
const router = express.Router();
const auth = require('../../utils/auth');

const Request = require('../../models/request');

router.post('/', (req, res) => {
    const data = req.body;
    console.log(data);
    const newRequest = new Request(data);
    newRequest.save().then(data => {
        res.status(200).json({data})
    })
    .catch(err => {
        res.status(400).json({err});
        console.log(err);
    })

})

//Get all Requests
router.get('/', auth, (req ,res) => {
    Request.find().exec().then(data => {
        console.log(data);
        res.status(200).json(data);
    }).catch(err => res.status(400).json({msg: err.message}));
})

//Delete Request
router.delete('/:id',auth, (req, res) => {
    Request.findByIdAndDelete(req.params.id).then(data => {
        res.status(200).json(res.data);
    }).catch(err => {
        res.status(400).json({msg: err.message});
    })

})

module.exports = router;