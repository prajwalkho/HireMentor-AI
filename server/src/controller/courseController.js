const Course = require('../models/courseModel');
const Role= require('../models/roleModel');
const mongoose = require('mongoose');


const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create new course
exports.createCourse = async (req, res) => {
    try {
        const { courseType, roleId } = req.body;

        
        const roleExists = await Role.findById(roleId);
        if (!roleExists) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        const course = await Course.create({
            courseType,
            roleId
        });

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: course
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all courses with role information
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('roleId', 'roleName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get courses by role
exports.getCoursesByRole = async (req, res) => {
    try {
        const { roleId } = req.params;

        if (!isValidObjectId(roleId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role ID format'
            });
        }

        const courses = await Course.find({ roleId })
            .populate('roleId', 'roleName');

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update course
exports.updateCourse = async (req, res) => {
    try {
        const { courseType, roleId } = req.body;
        const { id } = req.params;

        
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid course ID format'
            });
        }

        
        if (roleId && !isValidObjectId(roleId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role ID format'
            });
        }

        
        if (roleId) {
            const roleExists = await Role.findById(roleId);
            if (!roleExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Role not found'
                });
            }
        }

        const course = await Course.findByIdAndUpdate(
            id,
            { courseType, roleId },
            { new: true, runValidators: true }
        ).populate('roleId', 'roleName');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data: course
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}; 