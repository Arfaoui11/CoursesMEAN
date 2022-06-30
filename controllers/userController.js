const User = require('../models/user')
const Course = require('../models/course')


const mongoose = require('mongoose')

// get all formation
const getUsers = async (req, res) => {
    const Users = await User.find({})

    res.status(200).json(Users)
}

// get a single formation
const getUser = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    const course = await Course.findById(id)

    if (!course) {
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json(course)
}

// create a new formation
const createUser = async (req, res) => {
    const {firstName,lastName, profession, type,state,password,salary,tarifHoraire,age,phoneNumber} = req.body

    // add to the database
    try {
        const formateur = await User.create({firstName,lastName, profession, type,state,password,salary,tarifHoraire,age,phoneNumber} )
        res.status(200).json(formateur)
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

    const Formateur = await User.findOneAndDelete({_id: id})

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

    const formateur = await User.findOneAndUpdate({_id: id}, {
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
    createUser,
    deleteUser,
    updateUser
}
