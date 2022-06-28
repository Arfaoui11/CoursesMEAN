const Formation = require('../models/course')
const Formateur = require('../models/formateur')
const Apprenant = require('../models/apprenant')
const CourseApprenant = require('../models/courseApprenant')

const mongoose = require('mongoose')

// get all formation
const getCourses = async (req, res) => {
    const courses = await Formation.find({}).sort({createdAt: -1})

    res.status(200).json(courses)
}

// get a single formation
const getCourse = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    const course = await Formation.findById(id)

    if (!course) {
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json(course)
}

// create a new formation
const createCourse = async (req, res) => {
    const {title, niveau, dateDebut,dateFin,nbrHeures,nbrMaxParticipant,frais} = req.body

    // add to the database
    try {
        const course = await Formation.create({title, niveau, dateDebut,dateFin,nbrHeures,nbrMaxParticipant,frais})
        res.status(200).json(course)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
const createCourseAndAssignToFormer = async (req, res) => {
    // find out which post you are commenting
    const id = req.params.id;
    const {title, niveau, dateDebut,dateFin,nbrHeures,nbrMaxParticipant,frais} = req.body
    // get the comment text and record post id
    try {
        const course = await Formation({title, niveau, dateDebut,dateFin,nbrHeures,nbrMaxParticipant,frais,formateur: id})

        // save comment
        await course.save();
        // get this particular post
        const formateur = await Formateur.findById(id);
        // push the comment into the post.comments array
        formateur.formations.push(course);
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
        const apprenant = await Apprenant.findById(idA)
        const formation = await Formation.findById(idF)

        const courseApp = await CourseApprenant({course:formation._id,apprenant:apprenant._id})
        await courseApp.save();




        apprenant.courseApprenant.push(courseApp);

        formation.courseApprenant.push(courseApp);

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
        return res.status(400).json({error: 'No such workout'})
    }

    const course = await Formation.findOneAndDelete({_id: id})

    if(!course) {
        return res.status(400).json({error: 'No such workout'})
    }

    res.status(200).json(course)
}

// update a formation
const updateCourse = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such workout'})
    }

    const course = await Formation.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!course) {
        return res.status(400).json({error: 'No such workout'})
    }

    res.status(200).json(course)
}









module.exports = {
    getCourses,
    getCourse,
    createCourse,
    createCourseAndAssignToFormer,
    deleteCourse,
    updateCourse,
    assignApprenantToCourse
}
