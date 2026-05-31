const express = require('express');
const router = express.Router();
const {
    createRole,
    getAllRoles,
    getRole,
    updateRole,
    deleteRole
} = require('../controller/rolecontroller');

// Role routes
router.post('/create', createRole);
router.get('/get', getAllRoles);
router.get('/:id', getRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;