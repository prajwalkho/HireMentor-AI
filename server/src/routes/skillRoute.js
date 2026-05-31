const { createSkill, getAllSkills, updateSkill, deleteSkill } = require("../controller/skillcontroller");

const router=require("express").Router();
router.post("/skills", createSkill); 
router.get("/skills", getAllSkills); 
router.put("/skills/:id", updateSkill); 
router.delete("/skills/:id", deleteSkill); 
module.exports=router;