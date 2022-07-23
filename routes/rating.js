const express = require('express')
const {
    getRatingByCourses,
    assignRatingToCourses,

} = require('../controllers/ratingController')

const router = express.Router()


router.get('/rating/:id', getRatingByCourses);

router.post('/rating/:idF/:idU', assignRatingToCourses)

module.exports = router
