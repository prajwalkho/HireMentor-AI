const { Schema, model } = require("mongoose");

const skillschema= new Schema({
    title:{
        type:String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    }
},{timestamps:true})

const Skill= model("Skill",skillschema)
module.exports=Skill;