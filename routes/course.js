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
    upload,
    updatreCourseAndAssignToFormer,
    assignApprenantToCourse
} = require('../controllers/coursesController')

const router = express.Router()


router.get('/courses/', getCourses);


router.get('/courses/',getCoursesByFormer);
// GET all formations


router.get('/courses/:id', getCourse);

router.get('/courses/countnbr/:id', getNbrApprenantByFormation)


router.get('/courses/count/:id/:dateD/:dateF',countCoursesByFormer)


router.post('/courses/',createCourse)



//assign apprenant to course

router.post('/courses/:idF/:idA', assignApprenantToCourse)


router.post(`/courses/:id`,upload.single('image') ,createCourseAndAssignToFormer)

router.put('/courses/multiple/:id',upload.array('images'),updatreCourseAndAssignToFormer)


router.delete('/courses/:id', deleteCourse)


router.patch('/courses/:id', updateCourse)

module.exports = router
