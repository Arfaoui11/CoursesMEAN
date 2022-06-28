const Formateur = require('../models/formateur')
const Apprenant = require('../models/apprenant')

const mongoose = require('mongoose')

// get all formation
const getUsers = async (req, res) => {
    const Users = await Formateur.find({})

    res.status(200).json(Users)
}

// get a single formation
const getUser = async (req, res) => {
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
const createUserFormer = async (req, res) => {
    const {nom, prenom, tarifHoraire,email} = req.body

    // add to the database
    try {
        const formateur = await Formateur.create({nom, prenom, tarifHoraire,email} )
        res.status(200).json(formateur)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const createUserApp = async (req, res) => {
    const {nom, prenom, mobile ,email} = req.body

    // add to the database
    try {
        const apprenant = await Apprenant.create({nom, prenom, mobile ,email} )
        res.status(200).json(apprenant)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}




// delete a formation
const deleteUser = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such workout'})
    }

    const Formateur = await Formateur.findOneAndDelete({_id: id})

    if(!Formateur) {
        return res.status(400).json({error: 'No such workout'})
    }

    res.status(200).json(Formateur)
}

// update a formation
const updateUser = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such workout'})
    }

    const formateur = await Formateur.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!formateur) {
        return res.status(400).json({error: 'No such workout'})
    }

    res.status(200).json(formateur)
}





module.exports = {
    getUsers,
    getUser,
    createUserApp,
    createUserFormer,
    deleteUser,
    updateUser
}
