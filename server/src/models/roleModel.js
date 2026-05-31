
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {
        roleName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        isActive: {
            type: Boolean,
            default: true, 
        },
    },
    {
        timestamps: true, 
        versionKey: false,
    }
);



// Export the model
const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);
module.exports = Role;
