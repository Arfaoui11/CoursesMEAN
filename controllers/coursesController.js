const Formation = require('../models/formation')
const mongoose = require('mongoose')

// get all formations
const getFormations = async (req, res) => {
    const formation = await Formation.find({}).sort({createdAt: -1})

    res.status(200).json(formation)
}

// get a single formation
const getFormation = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    const formation = await Formation.findById(id)

    if (!formation) {
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json(formation)
}

// create a new formation
const createFormation = async (req, res) => {
    const {title, niveau, dateDebut,dateFin,nbrHeures,nbrMaxParticipant,frais} = req.body

    // add to the database
    try {
        const formation = await Formation.create({title, niveau, dateDebut,dateFin,nbrHeures,nbrMaxParticipant,frais})
        res.status(200).json(formation)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// delete a formation
const deleteFormation = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such workout'})
    }

    const formation = await Formation.findOneAndDelete({_id: id})

    if(!formation) {
        return res.status(400).json({error: 'No such workout'})
    }

    res.status(200).json("delete with success",formation)
}

// update a formation
const updateFormation = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such workout'})
    }

    const formation = await Formation.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!formation) {
        return res.status(400).json({error: 'No such workout'})
    }

    res.status(200).json(formation)
}

module.exports = {
    getFormations,
    getFormation,
    createFormation,
    deleteFormation,
    updateFormation
}