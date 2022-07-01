const express = require('express')
const {
    getCourses,
    getCourse,
    createCourse,
    createCourseAndAssignToFormer,
    deleteCourse,
    countCoursesByFormer,
    getNbrApprenantByFormation,
    getCoursesByFormer,
    updateCourse,
    assignApprenantToCourse
} = require('../controllers/coursesController')

const router = express.Router()


router.get('/courses/',getCoursesByFormer)
// GET all formations
router.get('/courses/', getCourses)

// GET a single formation
router.get('/courses/:id', getCourse)
router.get('/courses/countnbr/:id', getNbrApprenantByFormation)

router.get('/courses/count/:id/:dateD/:dateF',countCoursesByFormer)

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
