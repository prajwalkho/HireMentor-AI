const mongoose = require('mongoose');

const sharedInterviewLinkSchema = new mongoose.Schema({
  candidateEmail: { type: String, required: true, unique: true },
  googleMeetLink: { type: String, required: true },
});

module.exports = mongoose.model('SharedInterviewLink', sharedInterviewLinkSchema);
