const User = require('../models/user')
const Course = require('../models/course')
const Comment = require('../models/comment')


const mongoose = require('mongoose')

//login




// get all formation
const getComments = async (req, res) => {
    const Users = await Comment.find({})

    res.status(200).json(Users)
}

// get a single formation
const getComment = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Comment'})
    }

    const course = await Comment.findById(id)

    if (!course) {
        return res.status(404).json({error: 'No such Comment'})
    }

    res.status(200).json(course)
}

// create a new formation
const createComment = async (req, res) => {
    const {message} = req.body




    // add to the database
    try {
        let comment = await Comment.create({message} )
        res.status(200).json(comment)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const assignApprenantToComment = async (req, res) => {
    // find out which post you are commenting
    const {idF,idU} = req.params;

    const {message} = req.body


    // get the comment text and record post id
    try {
        const user = await User.findById(idU)
        const formation = await Course.findById(idF)

        if (user.type.toString() !== "STUDENT")
        {
            res.status(404).json({ error: 'Assign to Courses STUDENT not Other type' })
        }


        const comment = await Comment({course:formation._id,user:user._id ,message : message})
        await comment.save();




        user.comments.push(comment);

        formation.comments.push(comment);

        await user.save();
        await formation.save();


        // save and redirect...

        res.status(200).json(comment)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}


const getCommentByCourse = async (req, res) => {

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
const deleteComment = async (req, res) => {
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
const updateComment = async (req, res) => {
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
    getComments,
    getComment,
    assignApprenantToComment,
    getCommentByCourse,
    createComment,
    deleteComment,
    updateComment
}
