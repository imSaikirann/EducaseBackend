const express = require('express');

const { addSchool, SchoolsList } = require('../controllers/schoolsControllers');

const router = express.Router();



// Route to add a school
router.post('/addSchool', addSchool);

// Route to get list of schools
router.get('/list', SchoolsList);


module.exports = router;
