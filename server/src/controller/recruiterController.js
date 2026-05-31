
const cloudinary = require('../config/cloudinary');
const { hash } = require('../utils/hashpassword');
const senData = require('../config/mail');
const crypto = require("crypto");
const { ForgotFormatrecruiter } = require('../utils/recruiterui');
const Auth = require('../models/authmodel');
const fs=require("fs")


// Create recruiter
exports.createRecruiter = async (req, res) => {
    try {
        const { first_Name, last_Name, email, birth_Date, gender, role } = req.body;

        function generatePassword(firstName) {
            const randomNumber = Math.floor(100 + Math.random() * 900); 
            return `${firstName}@${randomNumber}`;
        }
        const password = generatePassword(first_Name);

        const hashpassword = await hash(password);

        let userPhoto = {};
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'recruiters',
                width: 300,
                crop: "scale"
            });
            userPhoto = {
                public_id: result.public_id,
                url: result.secure_url
            };

            
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${req.file.path}`, err);
                } else {
                    
                }
            });
        }

       
        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: `Email ${email} already exists.`
            });
        }

        const recruiter = await Auth.create({
            first_Name,
            last_Name,
            email,
            birth_Date,
            gender,
            userPhoto,
            role: role || "recruiter",
            password: hashpassword,
        });

        await senData(
            recruiter.email,
            "Registration Successfully",
            ForgotFormatrecruiter(recruiter.first_Name, recruiter.email, password)
        );

        res.status(201).json({
            success: true,
            message: 'Recruiter created successfully',
            data: recruiter
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: `Duplicate key error: ${JSON.stringify(error.keyValue)}`
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Get all recruiters
exports.getAllRecruiters = async (req, res) => {
    try {
    const recruiters = await Auth.find({role:"recruiter"})
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: recruiters.length,
            data: recruiters
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single recruiter
exports.getRecruiter = async (req, res) => {
    try {
        const recruiter = await Auth.findById(req.params.id);

        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: 'Recruiter not found'
            });
        }

        res.status(200).json({
            success: true,
            data: recruiter
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update recruiter
exports.updateRecruiter = async (req, res) => {
    try {
        let recruiter = await Auth.findById(req.params.id);

        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: 'Recruiter not found',
            });
        }

        if (req.file) {
           
            if (recruiter.userPhoto?.public_id) {
                await cloudinary.uploader.destroy(recruiter.userPhoto.public_id);
            }

            
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'recruiters',
                width: 300,
                crop: 'scale',
            });

            req.body.userPhoto = {
                public_id: result.public_id,
                url: result.secure_url,
            };

            
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${req.file.path}`, err);
                } else {
                    console.log(`File deleted: ${req.file.path}`);
                }
            });
        }

        recruiter = await Auth.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: 'Recruiter updated successfully',
            data: recruiter,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete recruiter
exports.deleteRecruiter = async (req, res) => {
    try {
        const recruiter = await Auth.findById(req.params.id);

        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: 'Recruiter not found'
            });
        }

        
        if (recruiter.userPhoto.public_id) {
            await cloudinary.uploader.destroy(recruiter.userPhoto.public_id);
        }

        await recruiter.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Recruiter deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}; 

