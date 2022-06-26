const Formation = require('../models/course')
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
    deleteCourse,
    updateCourse
}