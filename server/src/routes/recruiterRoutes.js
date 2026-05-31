const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authenticate');
const upload = require('../middleware/uploadMiddleware');
const {
    createRecruiter,
    getAllRecruiters,
    getRecruiter,
    updateRecruiter,
    deleteRecruiter
} = require('../controller/recruiterController');


router.post('/create', upload.single('userPhoto'), createRecruiter);
router.get('/get',  getAllRecruiters);
router.get('/:id',  getRecruiter);
router.put('/:id',  upload.single('userPhoto'), updateRecruiter);
router.delete('/:id',  deleteRecruiter);

module.exports = router; 