const express = require('express');
const { getCourses } = require('../controllers/courses');

// Merge params from other routers
const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses);

module.exports = router;
