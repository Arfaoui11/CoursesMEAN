const express = require('express')
const {
    getCourses,
    getCourse,
    createCourse,
    deleteCourse,
    updateCourse
} = require('../controllers/coursesController')

const router = express.Router()

// GET all formations
router.get('/', getCourses)

// GET a single formation
router.get('/:id', getCourse)

// POST a new formation
router.post('/', createCourse)

// DELETE a formation
router.delete('/:id', deleteCourse)

// UPDATE a formation
router.patch('/:id', updateCourse)

module.exports = router