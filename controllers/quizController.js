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
        const course = await Course.findById(id)


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
    const {idC,idU} = req.params;

    // get the comment text and record post id
    try {
        const user = await User.findById(idU)
        const comment = await Comment.findById(idC)

        if (user.type.toString() !== "STUDENT")
        {
            res.status(404).json({ error: 'Assign to Courses STUDENT not Other type' })
        }


        const dislike = await Dislikes({comment:comment._id,user:user._id })
        await dislike.save();




        user.dislikes.push(dislike);

        comment.dislikes.push(dislike);

        await user.save();
        await comment.save();


        // save and redirect...

        res.status(200).json(dislike)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}








// create a new formation
const getQuestionByQuiz = async (req, res) => {
    const {message} = req.body




    // add to the database
    try {
        let comment = await Comment.create({message} )
        res.status(200).json(comment)
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


const getQuizQuestion = async (req, res) => {

    const { id } = req.params




    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Found'})
    }


    const comments = await Comment.find({course:id}).populate('user course')




    if (!comments) {
        return res.status(404).json({error: 'No such Comment'})
    }

    res.status(200).json(comments)
}




// delete a formation
const DeleteQuiz = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such Comment'})
    }

    const comment = await Comment.findOneAndDelete({_id: id})

    if(!comment) {
        return res.status(400).json({error: 'No such workout'})
    }

    res.status(200).json(comment)
}

// update a formation
const DeleteQuestion = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such workout'})
    }

    const comment = await Comment.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!comment) {
        return res.status(400).json({error: 'No such workout'})
    }

    res.status(200).json(comment)
}





module.exports = {
    getQuizByFormation,
    addQuiz,
    SaveScore,
    getQuestionByQuiz,
    getQuizQuestion,
    addQuestionAndAsigntoQuiz,
    DeleteQuiz,
    DeleteQuestion
}
