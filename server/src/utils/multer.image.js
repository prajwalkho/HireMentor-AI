const multer = require('multer');
const os = require('os');
const path = require('path');
const crypto = require('crypto');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, os.tmpdir());
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${crypto.randomUUID()}${path.extname(file.originalname)}`);
    }
});

// Initialize Multer with limits
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 
    },
    fileFilter: (req, file, cb) => {
       
        const filetypes = /jpeg|jpg|png|gif|pdf/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images only!'); 
        }
    }
});


module.exports = upload;
