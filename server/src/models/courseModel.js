const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        courseType: {
            type: String,
            required: true,
            trim: true,
            
        },
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Add index for better query performance
courseSchema.index({ courseType: 1, roleId: 1 });

module.exports = mongoose.model('Course', courseSchema); 