const express = require('express')
const {
    getCourses,
    getCourse,
    createCourse,
    createCourseAndAssignToFormer,
    deleteCourse,
    updateCourse,
    assignApprenantToCourse
} = require('../controllers/coursesController')

const router = express.Router()

// GET all formations
router.get('/courses/', getCourses)

// GET a single formation
router.get('/courses/:id', getCourse)

// POST a new formation
router.post('/courses/', createCourse)

//assign apprenant to course

router.post('/courses/:idF/:idA', assignApprenantToCourse)


router.post('/courses/:id',createCourseAndAssignToFormer)

// DELETE a formation
router.delete('/courses/:id', deleteCourse)

// UPDATE a formation
router.patch('/courses/:id', updateCourse)

module.exports = router
