const User = require('../models/user')
const Course = require('../models/course')
const Comment = require('../models/comment')
const Question = require('../models/question')
const Quiz = require('../models/quiz')
const Result = require('../models/result')


const mongoose = require('mongoose')





// get a single formation
const getQuizByFormation = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Quiz'})
    }

    const quizzes = await Quiz.find({'course':id}).populate('course')

    if (!quizzes) {
        return res.status(404).json({error: 'No such Quizzes'})
    }

    res.status(200).json(quizzes)
}

const addQuiz = async (req ,res) => {
    const {id} = req.params;
    const {title,score, content} = req.body;
    // get the comment text and record post id
    try {
        const course = await Course.findById(id);


        const quiz = await Quiz({title : title,score : score ,content : content , course : course.id });
        await quiz.save();


        course.quizzes.push(quiz);

        await course.save();


        // save and redirect...

        res.status(200).json(quiz)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}


const SaveScore = async (req ,res) => {
    const {idQ,idU} = req.params;
    const {username,totalCorrect,correctAnswer,inCorrectAnswer} = req.body;





    // get the comment text and record post id
    try {

        const user = await User.findById(idU);
        const quiz = await Quiz.findById(idQ);

        const allResult = await Result.find({$and:[  {user :user.id} , {quiz :quiz.id}]});

        if (allResult.length > 0)
        {
            return res.status(400).json({error: 'This user is tested with this quiz'})
        }


        const result = await Result({quiz:quiz._id,user:user._id,username:username,totalCorrect : totalCorrect , correctAnswer : correctAnswer , inCorrectAnswer : inCorrectAnswer })
        await result.save();




        user.results.push(result);

        quiz.results.push(result);

        await user.save();
        await quiz.save();


        // save and redirect...

        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}

const listQuiqtestedbuUser = async (req ,res) => {

    const {idC,idU} = req.params;

    const ids = [];
    const list = [];



    try {

        const course = await Course.findById(idC)
        const quizzes = await Quiz.find({'course':course.id}).populate('course')

        const user = await User.findById(idU);


        const results = await Result.find({});

        results.forEach(t => {
            if (t.user.toString() === user.id.toString() )
            {
                ids.push(t.quiz)
            }
        })


        const quizTested = await Quiz.find({_id : { $in : ids}})

        const newArray = quizzes.filter(
            (array22) => !quizTested.some((array11) => array11.id === array22.id));



        res.status(200).json(newArray)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}








// create a new formation
const getQuestionByQuiz = async (req, res) => {
    const {id} = req.params


    // add to the database
    try {
        const question = await Question.find({'quiz':id})
        res.status(200).json(question)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const addQuestionAndAsigntoQuiz = async (req, res) => {
    // find out which post you are commenting
    const {id} = req.params;


    const {title,optionA,optionB,optionC,optionD,optionE,ans,chose} = req.body


    // get the comment text and record post id
    try {
        const quiz = await Quiz.findById(id);




        const question = await Question({quiz:quiz._id,title : title ,optionA : optionA ,optionB : optionB , optionC : optionC , optionD : optionD ,optionE : optionE , ans : ans ,chose : chose })
        await question.save();

        quiz.questions.push(question);

        await quiz.save();

        // save and redirect...

        res.status(200).json(question)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}

function getRandomInt(num) {
    return Math.floor(Math.random() * num);
}

function randomIntInc(low, high) {

    return Math.floor(Math.random() * (high - low + 1) + low);

}


const uniqueRandoms = [];

function makeUniqueRandom(num) {
    // refill the array if needed
    if (!uniqueRandoms.length) {
        for (let i = 0; i < num; i++) {
            uniqueRandoms.push(i);
        }
    }
    const index = Math.floor(Math.random() * uniqueRandoms.length);
    const val = uniqueRandoms[index];

    // now remove that value from the array
    uniqueRandoms.splice(index, 1);

    return val;

}


const getQuizQuestion = async (req, res) => {



    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Question'})
    }

    try {

        const quiz = Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({error: 'No such Quiz'})
        }

        const question = await Question.find({'quiz':id})






        const listQuestions = [];
        for (let i=0 ; i<5 ; i++)
        {

            const rand = makeUniqueRandom(question.length)
            console.log(rand);

            listQuestions.push(question[rand])
        }

        if (!listQuestions) {
            return res.status(404).json({error: 'No such questions'})
        }




        res.status(200).json(listQuestions)
    }catch (e) {
        res.status(400).json({ error: error.message })
    }



}




// delete a formation
const DeleteQuiz = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such Quiz'})
    }

    const quiz = await Quiz.findOneAndDelete({_id: id}, {
        ...req.body
    });

    const course = await Course.findByIdAndUpdate({_id: quiz.course},{ $pull: { quizzes: quiz._id } })
    console.log(course)

    if(!quiz) {
        return res.status(400).json({error: 'No such Quiz'})
    }

    res.status(200).json(quiz)
}

// update a formation
const DeleteQuestion = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such Question'})
    }

    const question = await Question.findByIdAndDelete({_id: id}, {
        ...req.body
    }).populate('quiz');

    const quiz = await Quiz.findByIdAndUpdate({_id: question.quiz._id},{ $pull: { questions: question._id } })
    console.log(quiz)


  /* Quiz.findById(question.quiz._id)
        .then(quiz => {
            console.log(quiz)
            if (!quiz) {
                return res.status(500).json({ message: "Quiz not found" });
            } else {
                Quiz.questions.pull(question._id);

                Quiz.save()
                    .then(response => {
                        return res.status(200).json( { message: 'Id deleted'} );
                    })
            }
        })
        .catch(err => {
            console.log(err);
        });

    //quiz.questions.delete(question._id);
    //quiz.save();



   */
    if (!question) {
        return res.status(400).json({error: 'No such Question'})
    }

    res.status(200).json(question)
}





module.exports = {
    getQuizByFormation,
    addQuiz,
    SaveScore,
    getQuestionByQuiz,
    getQuizQuestion,
    listQuiqtestedbuUser,
    addQuestionAndAsigntoQuiz,
    DeleteQuiz,
    DeleteQuestion
};
