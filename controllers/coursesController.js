const Formation = require('../models/course')
const User = require('../models/user')

const CourseApprenant = require('../models/courseApprenant')

const mongoose = require('mongoose')

// get all formation
const getCourses = async (req, res) => {
    const courses = await Formation.find({}).sort({createdAt: -1}).populate('courseApprenants')

    res.status(200).json(courses)
}

// get a single formation
const getCourse = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Course'})
    }

    const course = await Formation.findById(id).populate('userF')
    console.log(course.size)

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

    const course = await Formation.find({$and:[{'userF':id},{'dateDebut':{"$gte": dateD}},{'dateFin':{"$lte": dateF}}]}).populate('userF')

       course.forEach(t => {
           nbr += (t.nbrHeures * t.formateur.tarifHoraire)

       })


    if (!nbr) {
        return res.status(404).json({error: 'No such Course'})
    }

    res.status(200).json({count :nbr })
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

const getCoursesByDomain = async (req, res) => {
    let filtre = {};

    if (req.query.domain) {
        filtre = {domain : req.query.domain.split(',')}
    }



    const course = await Formation.find(filtre)




    if (!course) {
        return res.status(404).json({error: 'No such Course'})
    }

    res.status(200).json(course)
}







// create a new formation
const createCourse = async (req, res) => {
    const {title, domain,level, start,end,nbrHours,lieu,nbrMaxParticipant,costs} = req.body

    // add to the database
    try {
        const course = await Formation.create({title, domain,level, start,end,nbrHours,lieu,nbrMaxParticipant,costs})
        res.status(200).json(course)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
const createCourseAndAssignToFormer = async (req, res) => {
    // find out which post you are commenting
    const id = req.params.id;
    const {title, domain,level, start,end,nbrHours,lieu,nbrMaxParticipant,costs} = req.body
    // get the comment text and record post id
    try {
        const formateur = await User.findById(id);

        if (formateur.type.toString() !== "FORMER")
        {
            res.status(404).json({ error: 'Assign to Courses former not Other type' })
        }
        const course = await Formation({title, domain,level, start,end,nbrHours,lieu,nbrMaxParticipant,costs,userF: id})

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

const assignApprenantToCourse = async (req, res) => {
    // find out which post you are commenting
    const {idF,idA} = req.params;




    // get the comment text and record post id
    try {
        const apprenant = await User.findById(idA)
        const formation = await Formation.findById(idF)

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
    getCoursesByDomain,
    getNbrApprenantByFormation,
    deleteCourse,
    updateCourse,
    assignApprenantToCourse
}
