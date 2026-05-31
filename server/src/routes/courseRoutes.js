const express = require('express');
const router = express.Router();
const {
    createCourse,
    getAllCourses,
    getCoursesByRole,
    updateCourse,
    deleteCourse
} = require('../controller/courseController');

router.post('/create', createCourse);
router.get('/get', getAllCourses);
router.get('/role/:roleId', getCoursesByRole);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router; 