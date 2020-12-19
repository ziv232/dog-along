
const multer = require('multer');
const path = require('path');
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null, true)
    }
    else{
        cb({msg: 'Unsupported File Format'}, false);
    }
}


const multerUploads = multer({ storage: storage, fileFilter: fileFilter }).array('image', 5);
module.exports = { multerUploads};