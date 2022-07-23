

const Formation = require('../models/course')
const User = require('../models/user')
const Course = require('../models/course')

const cron = require('node-cron');
const fs = require('fs');
const mailers = require('../nodemailer/mailer')

const Rating = require('../models/rating')

const mongoose = require('mongoose')




// Schedule tasks to be run on the server.
cron.schedule('* * * * *', function() {
    // getCourses();
});



const getRatingByCourses = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Course'})
    }

    let SomRating = 0 ;

    const course = await Course.find({_id: id})







    const list = await Rating.find({_id : { $in : course.ratings}}).populate('user course')


    list.forEach(t => {
        SomRating += (t.typeRating)



    });

    const som = (SomRating/list.length);

    if (!som) {
        return res.status(404).json({error: 'No such Course'})
    }

    res.status(200).json(som)

}




const assignRatingToCourses = async (req, res) => {
    // find out which post you are commenting
    const {idF,idU} = req.params;
    const {ratings} = req.body;




    // get the comment text and record post id
    try {
        const student = await User.findById(idU)
        const formation = await Formation.findById(idF).populate('userF')

        if (student.type.toString() !== "STUDENT")
        {
            res.status(404).json({ error: 'Assign to Courses STUDENT not Other type' })
        }

        const r = await Rating.find({course:formation._id,user:student._id})

        if(r.length > 0){
            return res.status(404).json({error: 'this user is rat this courses '})
        }


        const rating = await Rating({course:formation._id,user:student._id,typeRating : ratings})
        await rating.save();




        student.Ratings.push(rating);

        formation.ratings.push(rating);

        await student.save();
        await formation.save();


        // save and redirect...
        //send email to anather mail
        mailers.mail("mahdijr2015@gmail.com",formation.title,student.lastName,student.file)

        res.status(200).json(rating)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}












module.exports = {
    getRatingByCourses,
    assignRatingToCourses,
}
