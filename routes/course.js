const express = require('express')
const fs = require('fs');
const http = require('http');
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
    getCertifcateByCoursesAndUser,
    upload,
    searchCourses,
    search,
    CheckOutCourses,
    getCoursesByRating,
    DownloadFiles,
    getApprenantByFormation,
    getFormationByApprenant,
    updatreCourseAndAssignToFormer,
    assignApprenantToCourse
} = require('../controllers/coursesController')

const router = express.Router()


router.get('/courses/', getCourses);

router.get('/coursesByRatings/', getCoursesByRating);


router.get('/courses/coursesByFormer/:idF',getCoursesByFormer);
// GET all formations


router.get('/courses/:id', getCourse);


router.post('/courses/search', searchCourses);

router.post('/courses/searchSingleKey', search);

router.get('/courses/getMycourses/:idA', getFormationByApprenant);

router.get('/courses/getStudent/:idC', getApprenantByFormation);

router.get('/courses/countnbr/:id', getNbrApprenantByFormation)


router.get('/courses/count/:id/:dateD/:dateF',countCoursesByFormer)


router.post('/courses/',createCourse)

router.post('/downloadFile',DownloadFiles)

router.post('/checkout/:id',CheckOutCourses)








//assign apprenant to course

router.post('/courses/:idF/:idA', assignApprenantToCourse)

router.get('/courses/:idC/:idU', getCertifcateByCoursesAndUser)


router.get('/video/:url', function(req, res) {

    const {url} = req.params;
    const path = 'public/uploads/'+url;

  //  const path = 'public/uploads/image-1657583830444.mp4'
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1

        const chunksize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }

        res.writeHead(206, head)
        file.pipe(res)
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
})

router.post('/courses/:id',upload.single('image') ,createCourseAndAssignToFormer)

router.put('/courses/multiple/:id',upload.array('images',10),updatreCourseAndAssignToFormer)


router.delete('/courses/:id', deleteCourse)


router.patch('/courses/:id', updateCourse)

module.exports = router
