const express = require('express')
const {
    getQuizByFormation,
    addQuiz,
    SaveScore,
    getQuestionByQuiz,
    getQuizQuestion,
    addQuestionAndAsigntoQuiz,
    DeleteQuiz,
    DeleteQuestion,
    listQuiqtestedbuUser,
} = require('../controllers/quizController')

const router = express.Router()


router.get('/quiz/getQuizByFormation/:id', getQuizByFormation);


//router.get('/comment/',getComment);
// GET all formations


router.post('/quiz/addQuiz/:id', addQuiz);




router.post('/quiz/saveScore/:idU/:idQ',SaveScore)


router.get('/quiz/listQuiqtestedbuUser/:idU/:idC',listQuiqtestedbuUser)



//assign apprenant to course

router.get('/quiz/getQuestionByQuiz/:id', getQuestionByQuiz)

router.get('/quiz/getQuizQuestion/:id', getQuizQuestion)




router.post('/quiz/addQuestionAndAsigntoQuiz/:id', addQuestionAndAsigntoQuiz)






router.delete('/quiz/DeleteQuiz/:id', DeleteQuiz)


router.delete('/quiz/DeleteQuestion/:id', DeleteQuestion)

module.exports = router;
