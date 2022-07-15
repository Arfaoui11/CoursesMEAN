const Formation = require('../models/course')
const User = require('../models/user')

const cron = require('node-cron');
const fs = require('fs');
const mailers = require('../nodemailer/mailer')

const CourseApprenant = require('../models/courseApprenant')

const mongoose = require('mongoose')


const multer = require('multer')






// Schedule tasks to be run on the server.
cron.schedule('* * * * *', function() {
    // getCourses();
});


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.originalname + '-' + Date.now()+ '.' +extension)
    }
})
const upload = multer({ storage: storage })





const getCourses = async (req, res) => {
    const courses = await Formation.find({}).sort({createdAt: -1}).populate('userF comments').populate({path:'courseApprenants',populate:'course userA' })
    console.log(courses)
    res.status(200).json(courses)
}

// get a single formation
const getCourse = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Course'})
    }

    const course = await Formation.findById(id).populate('userF').populate({path:'courseApprenants',populate:'course userA' }).populate({path:'comments',populate:'course user' })
    console.log(course.size)

    if (!course) {
        return res.status(404).json({error: 'No such Course'})
    }

    res.status(200).json(course)
}

const getFormationByApprenant = async (req, res) => {
    const {idA} = req.params;

    if (!mongoose.Types.ObjectId.isValid(idA)) {
        return res.status(404).json({error: 'No such Course'})
    }

    const course = await CourseApprenant.find({userA : idA}).populate('course').select('course')




    if (!course) {
        return res.status(404).json({error: 'No such Course'})
    }

    res.status(200).json(course)

}

const countCoursesByFormer = async (req, res) => {
    const { id ,dateD,dateF } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Course'})
    }

    let nbr = 0;

    const NbrcourseByFormer = await Formation.countDocuments({'userF':id})

    const course = await Formation.find({$and:[{'userF':id},{'start':{"$gte": dateD}},{'end':{"$lte": dateF}}]}).populate('userF')

    course.forEach(t => {
        nbr += (t.nbrHours * t.userF.tarifHoraire)

    })


    if (!NbrcourseByFormer) {
        return res.status(404).json({error: 'No such Course'})
    }

    res.status(200).json({count :NbrcourseByFormer })
}

const getNbrApprenantByFormation = async (req, res) => {
    const { id  } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Course'})
    }



    const course = await Formation.findById(id)




    if (!course) {
        return res.status(404).json({error: 'No such Course'})
    }

    res.status(200).json({count :course.courseApprenants.length })
}

const getCoursesByFormer = async (req, res) => {
    let filtre = {};



    if (req.query.userF) {
        filtre = {userF : req.query.userF.split(',')}
    }
    console.log(req.query.userF.split(','))

    if (!mongoose.Types.ObjectId.isValid(req.query.userF.split(','))) {
        return res.status(404).json({error: 'No such Found'})
    }


    const course = await Formation.find(filtre)




    if (!course) {
        return res.status(404).json({error: 'No such Course'})
    }

    res.status(200).json(course)
}







// create a new formation
const  createCourse =  async (req, res) => {
    const {title, domain,level, start,end,nbrHours,lieu,nbrMaxParticipant,costs} = req.body;


    // add to the database
    try {
        const course = await Formation.create({title, domain,level,  start,end,nbrHours,lieu,nbrMaxParticipant,costs})
        res.status(200).json(course)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
const createCourseAndAssignToFormer = async (req, res) => {
    // find out which post you are commenting
    const id = req.params.id;

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request')

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;



    const {title, domain,level, start,end,nbrHours ,lieu,nbrMaxParticipant,costs} = req.body
    // get the comment text and record post id
    try {
        const formateur = await User.findById(id);

        if (formateur.type.toString() !== "FORMER")
        {
            res.status(404).json({ error: 'Assign to Courses former not Other type' })
        }
        const course = await Formation({title, domain,level,image : `${basePath}${fileName}` , start,end,nbrHours,lieu,nbrMaxParticipant,costs,userF: id})

        // save comment
        await course.save();
        // get this particular post

        // push the comment into the post.comments array
        formateur.coursesF.push(course);
        // save and redirect...
        await formateur.save()
        res.status(200).json(course)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}

const updatreCourseAndAssignToFormer = async (req, res) => {
    // find out which post you are commenting
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such Course'})
    }

    const files = req.files
    let filesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files.length >= 1)
    {
        files.map( f => {
            filesPaths.push(`${basePath}${f.filename}`)
        })
    }else
    {
        return res.status(400).json({error: 'No such Files'})
    }
    // get the comment text and record post id
    try {



        const course = await Formation.findByIdAndUpdate(id, {
                images : filesPaths
            },
            { new:true }
        )

        if (!course) {
            return res.status(500).json({error: 'the Courses cannot be updated ! '})
        }



        res.status(200).json(course)

    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}



const assignApprenantToCourse = async (req, res) => {
    // find out which post you are commenting
    const {idF,idA} = req.params;




    // get the comment text and record post id
    try {
        const apprenant = await User.findById(idA)
        const formation = await Formation.findById(idF).populate('userF')

        if (apprenant.type.toString() !== "STUDENT")
        {
            res.status(404).json({ error: 'Assign to Courses STUDENT not Other type' })
        }


        const courseApp = await CourseApprenant({course:formation._id,userA:apprenant._id})
        await courseApp.save();




        apprenant.courseApprenants.push(courseApp);

        formation.courseApprenants.push(courseApp);

        await apprenant.save();
        await formation.save();


        // save and redirect...
        //send email to anather mail
        mailers.mail("mahdijr2015@gmail.com",formation.title,formation.userF.lastName,formation.image)

        res.status(200).json(courseApp)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}






// delete a formation
const deleteCourse = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such Course'})
    }

    const course = await Formation.findOneAndDelete({_id: id})

    if(!course) {
        return res.status(400).json({error: 'No such Course'})
    }

    res.status(200).json(course)
}

// update a formation
const updateCourse = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such Course'})
    }

    const course = await Formation.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!course) {
        return res.status(400).json({error: 'No such Course'})
    }

    res.status(200).json(course)
}









module.exports = {
    getCourses,
    getCourse,
    createCourse,
    createCourseAndAssignToFormer,
    countCoursesByFormer,
    getCoursesByFormer,
    getNbrApprenantByFormation,
    deleteCourse,
    updateCourse,
    getFormationByApprenant,
    updatreCourseAndAssignToFormer,
    assignApprenantToCourse,
    upload,
}
