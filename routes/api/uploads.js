const express = require('express');
const router = express.Router();
const path = require('path');
const DataURIParser = require("datauri/parser");
const {multerUploads, dataUri} = require('../../utils/multer');
const {uploader, cloudinaryConfig} = require('../../utils/cloudinary');
const auth = require('../../utils/auth');

router.use(cloudinaryConfig);

router.post('/', multerUploads, (req, res) => {
    const urls = [];
    const publicIds = [];
    if(req.files) {
       let res_promises = req.files.map(file => new Promise((resolve, reject) => {
            const dUri = new DataURIParser();
            dUri.format(path.extname(file.originalname).toString(), file.buffer);
            const content = dUri.content;
            uploader.upload(content, async function (res, err) {
                if(err){
                    reject(err);
                }
                else{
                    resolve(res)
                    console.log(res);
                    urls.push(res.url);
                    publicIds.push(res.public_id);
                    //console.log(res);
                }
            },
            {
                folder: req.body.name,
                use_filename: true
            })
        }))
        
        Promise.all(res_promises).then(result => res.status(200).json({
            msg: 'Your images has been uploded successfully to cloudinary',
            urls: urls,
            publicIds: publicIds
        }))
        .catch(err => res.status(400).json({
            msg: 'someting went wrong while processing your request',
            data: {err}
        }))
    }
});


router.post('/delete', auth, (req, res) => {
    try{
    let deletePromises = req.body.map(id => new Promise( (resolve, reject) => {
        uploader.destroy(id, { resource_type: "image" }, function (res, err){
                console.log(res);
             }
        )
     })
    )

    Promise.all(deletePromises).then(result => res.status(200).json({msg: 'all images deleted'}))
    .catch(err => res.status(400).json({msg: 'There was a problem deleting the images'}))
    } catch(err){
        res.status(500).json({error: err.message});
    }
})


router.delete('/:id', auth, (req, result) => {
    console.log(req.params.id);
    uploader.destroy(req.params.id, { resource_type: "image" }, async function (res, err){
        if(err){
            reject(err);
        }
        else{
            resolve(res);
        }

    })
})

module.exports = router;


  
        // const dUri = new DataURIParser();
        // dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
        // const file = dUri.content;
        // return uploader.upload(file).then((result) => {
        // const image = result.url;
        // return res.status(200).json({
        //     messge: 'Your image has been uploded successfully to cloudinary',
        //     data: {
        //     image
        //     }
        //     })
        // }).catch((err) => res.status(400).json({
        //     messge: 'someting went wrong while processing your request',
        //     data: {
        //     err
        //     }
        //     }))