const express = require('express');
const router = express.Router();
const {
    createCourseInfo,
    getCourseInfo,
    updateCourseInfo,
    deleteCourseInfo,
    getAllCourseInfo,
    getCourseInfoById
} = require('../controller/courseInfoController');
const upload= require("../utils/multer.image")

router.post('/create', upload.single("courseImage"),createCourseInfo);
router.get('/get', getAllCourseInfo);
router.get('/get/:id', getCourseInfoById);
router.get('/:courseId/:roleId', getCourseInfo);
router.put('/:id', upload.single("courseImage"), updateCourseInfo);
router.delete('/:id', deleteCourseInfo);

module.exports = router; 