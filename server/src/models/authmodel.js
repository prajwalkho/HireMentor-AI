const { Schema, model } = require("mongoose");

const authschema=  new Schema({
    first_Name: {
        type:String
    },
    last_Name:{
        type:String
    },
    email:{
        type:String,
        
    },
    birth_Date:{
        type:Date,
       required: true,

    },
    gender:{
       type:String,
       enum:['male','female','other']
    },
    role:{
        type:String,
        enum:['admin','user','recruiter','hiringmanager'],
        default:"user"
    },
    password:{
        type:String,
        required:true
    },
    otp: {
      type: String,
    },
    otpExpiration: {
      type: Date,
      default: Date.now,
      get: (otpExpiration) => otpExpiration.getTime(),
      set: (otpExpiration) => new Date(otpExpiration),
    },
    profilePhoto: {
        public_id: String,
        url: String
    },
    userPhoto: {
        public_id: String,
        url: String
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: null
    },
    loginCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true })


const Auth = model("Auth", authschema)
module.exports = Auth;