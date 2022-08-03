const User = require('../models/user')
const Course = require('../models/course')
const Comment = require('../models/comment')
const Likes = require('../models/likes')
const Dislikes = require('../models/dislikes')
const mailers = require('../nodemailer/mailer')
const cron = require('node-cron');

const mongoose = require('mongoose')

//login
const Filter = require("bad-words");

// Make a new filter
const filter = new Filter();

// https://www.cs.cmu.edu/~biglou/resources/
// Add extra words to the bad words list
const words = require("../bad-words.json");
filter.addWords(...words);


cron.schedule('* * * * *', function() {
    LeanerStatus().then();
});


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

const likeComments = async (req ,res) => {
    const {idC,idU} = req.params;

    // get the comment text and record post id
    try {
        const user = await User.findById(idU)
        const comment = await Comment.findById(idC)

        if (user.type.toString() !== "STUDENT")
        {
            res.status(404).json({ error: 'Assign to Courses STUDENT not Other type' })
        }


        const like = await Likes({comment:comment._id,user:user._id })
        await like.save();




        user.likes.push(like);

        comment.likes.push(like);

        await user.save();
        await comment.save();


        // save and redirect...

        res.status(200).json(like)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}


const dislikeComments = async (req ,res) => {
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


        const comment = await Comment({course:formation._id,user:user._id ,message : filter.clean(message).replace('****','(forbidden words)')})
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
    const { id } = req.params;
    console.log(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such Comment'})
    }

    const comment = await Comment.findOneAndDelete({_id: id})

    const user = await User.findByIdAndUpdate({_id: comment.user},{ $pull: { comments: comment._id } })

    const course = await Course.findByIdAndUpdate({_id: comment.course},{ $pull: { comments: comment._id } })


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


const LeanerStatus = async (req, res) => {


    try {


        const useres = await User.find({'type': 'STUDENT'})




            for (const array11 of useres)  {

                const user = await User.findById(array11.id).populate('comments');


                const NbrCommentsBadByUser = await Comment.countDocuments({'user':user.id,"message":{ $regex: /forbidden words/, $options: 'i' } });

                console.log(NbrCommentsBadByUser)

                if (NbrCommentsBadByUser === 1) {

                    const userWithBadWord = await User.findOneAndUpdate({_id: user.id},{
                        state : 'WARNED'
                    });
                 //   console.log(userWithBadWord)
                    mailers.mail("mahdijr2015@gmail.com", " You Are create bad Comment in this Courses next comment with bad word we punished 20 day please Mr's  "+array11.firstName +" " + array11.lastName +" this web site is for association of women empowerment not to write this type of comment !!! ", "Udacity Academy - You Are create bad Comment in this Courses ", array11.file)

                }else if (NbrCommentsBadByUser === 5){

                    const userWithBadWord = await User.findOneAndUpdate({_id: user.id},{
                        state : 'PUNISHED'
                    });
                    //   console.log(userWithBadWord)
                    mailers.mail("mahdijr2015@gmail.com", "  You Are create Comment with bad word in this Courses we punished in all Courses Mr's  "+array11.firstName +" " + array11.lastName +" this web site is for association of women empowerment not to write this type of comment !!! ", "Udacity Academy - You Are create bad Comment in this Courses ", array11.file)



                }else if (NbrCommentsBadByUser > 6)
                {
                    const userWithBadWord = await User.findOneAndUpdate({_id: user.id},{
                        state : 'EXCLUDED'
                    });

                    for (let o of user.comments)
                    {

                        const comment = await Comment.findOneAndDelete({_id: o})
                        const user = await User.findByIdAndUpdate({_id: comment.user},{ $pull: { comments: comment._id } })

                        const course = await Course.findByIdAndUpdate({_id: comment.course},{ $pull: { comments: comment._id } })

                        // await deleteComment({params :o.id})
                    }
                    //   console.log(userWithBadWord)
                    mailers.mail("mahdijr2015@gmail.com", " You Are create Comment with bad word in this Courses we excluded in this Courses Mr's  "+array11.firstName +" " + array11.lastName +" this web site is for association of women empowerment not to write this type of comment !!! ", "Udacity Academy - You Are create bad Comment in this Courses ", array11.file)
                }
            }


    }catch (e) {

        console.log(e.message)

    }


}




module.exports = {
    getComments,
    getComment,
    likeComments,
    dislikeComments,
    assignApprenantToComment,
    getCommentByCourse,
    createComment,
    deleteComment,
    updateComment
}
