const Skill = require("../models/skillmodel");


// Create a new skill
exports.createSkill = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }

    const newSkill = new Skill({ title });
    const savedSkill = await newSkill.save();

    res.status(201).json({ message: "Skill created successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to create skill."});
  }
};

// Get all skills
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find(); 
    res.status(200).json({ skills });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve skills." });
  }
};

// Update a skill
exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      { title },
      { new: true, runValidators: true } 
    );

    if (!updatedSkill) {
      return res.status(404).json({ error: "Skill not found." });
    }

    res.status(200).json({ message: "Skill updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update skill.", details: error.message });
  }
};

// Delete a skill
exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSkill = await Skill.findByIdAndDelete(id);

    if (!deletedSkill) {
      return res.status(404).json({ error: "Skill not found." });
    }

    res.status(200).json({ message: "Skill deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete skill.", details: error.message });
  }
};
