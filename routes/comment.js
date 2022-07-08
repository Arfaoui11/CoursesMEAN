const express = require('express')
const {
    getComments,
    getComment,
    getCommentByCourse,
    assignApprenantToComment,
    createComment,
    likeComments,
    dislikeComments,
    deleteComment,
    updateComment
} = require('../controllers/commentController')

const router = express.Router()


router.get('/comment/', getComments);


//router.get('/comment/',getComment);
// GET all formations


router.get('/comment/:id', getCommentByCourse);




router.post('/comment/',createComment)



//assign apprenant to course

router.post('/comment/:idF/:idU', assignApprenantToComment)

router.post('/comment/like/:idC/:idU', likeComments)


router.post('/comment/dislike/:idC/:idU', dislikeComments)






router.delete('/comment/:id', deleteComment)


router.patch('/comment/:id', updateComment)

module.exports = router
