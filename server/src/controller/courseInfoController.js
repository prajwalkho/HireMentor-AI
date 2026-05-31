const CourseInfo = require('../models/courseInfoModel');

const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const fs=require("fs")


const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create course information
exports.createCourseInfo = async (req, res) => {
    try {
        const { courseId, roleId, title, description, overview, videoLinks, studyMaterials } = req.body;
           
            const uploadFileToCloudinary = async (filePath) => {
              try {
                const result = await cloudinary.uploader.upload(filePath, {
                  folder: "Course Info", 
                });
                
                fs.unlinkSync(filePath);
                return result.secure_url;
              } catch (error) {
                
                throw new Error("Failed to upload file");
              }
            };
        
            let fileUrl = null;
            if (req.file) {
              fileUrl = await uploadFileToCloudinary(req.file.path);
            }
            
        const courseInfo = await CourseInfo.create({
            courseId,
            roleId,
            title,
            description,
            overview,
            courseImage:fileUrl,
            videoLinks: videoLinks ? (typeof videoLinks === 'string' ? JSON.parse(videoLinks) : videoLinks) : [],
            studyMaterials: studyMaterials ? (typeof studyMaterials === 'string' ? JSON.parse(studyMaterials) : studyMaterials) : []
        });

        res.status(201).json({
            success: true,
            message: 'Course information created successfully',
            data: courseInfo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get course information by course ID and role ID
exports.getCourseInfo = async (req, res) => {
    try {
        const { courseId, roleId } = req.params;

        if (!isValidObjectId(courseId) || !isValidObjectId(roleId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid course ID or role ID format'
            });
        }

        const courseInfo = await CourseInfo.findOne({ courseId, roleId })
            .populate('courseId', 'courseType')
            .populate('roleId', 'roleName');

        if (!courseInfo) {
            return res.status(404).json({
                success: false,
                message: 'Course information not found'
            });
        }

        res.status(200).json({
            success: true,
            data: courseInfo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update course information
exports.updateCourseInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const { courseId, roleId, title, description, overview, videoLinks, studyMaterials } = req.body;
        
            let fileUrl = null;
            if (req.file) {
              const uploadFileToCloudinary = async (filePath) => {
                try {
                  const result = await cloudinary.uploader.upload(filePath, {
                    folder: "candidates",
                    resource_type: "raw",
                    type: "upload",

                  });
                  fs.unlinkSync(filePath);
                  return result.secure_url;
                } catch (error) {
                  
                  throw new Error("Failed to upload file");
                }
              };
              fileUrl = await uploadFileToCloudinary(req.file.path);
            }
        

        const courseInfo = await CourseInfo.findByIdAndUpdate(
            id,
            { 
                courseId, 
                roleId, 
                title, 
                description, 
                overview, 
                ...(fileUrl && { courseImage: fileUrl }),
                videoLinks: videoLinks ? (typeof videoLinks === 'string' ? JSON.parse(videoLinks) : videoLinks) : [],
                studyMaterials: studyMaterials ? (typeof studyMaterials === 'string' ? JSON.parse(studyMaterials) : studyMaterials) : []
            },
            { new: true, runValidators: true }
        )
            .populate('courseId', 'courseType')
            .populate('roleId', 'roleName');

        if (!courseInfo) {
            return res.status(404).json({
                success: false,
                message: 'Course information not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Course information updated successfully',
            data: courseInfo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete course information
exports.deleteCourseInfo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format'
            });
        }

        const courseInfo = await CourseInfo.findByIdAndDelete(id);

        if (!courseInfo) {
            return res.status(404).json({
                success: false,
                message: 'Course information not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Course information deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get course information by ID
exports.getCourseInfoById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format'
            });
        }

        const courseInfo = await CourseInfo.findById(id)
            .populate('courseId', 'courseType')
            .populate('roleId', 'roleName');

        if (!courseInfo) {
            return res.status(404).json({
                success: false,
                message: 'Course information not found'
            });
        }

        res.status(200).json({
            success: true,
            data: courseInfo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all course information
exports.getAllCourseInfo = async (req, res) => {
    try {
        const courseInfo = await CourseInfo.find()
            .populate('courseId', 'courseType')
            .populate('roleId', 'roleName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: courseInfo.length,
            data: courseInfo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 
