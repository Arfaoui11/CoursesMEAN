const express = require('express')
const {
    getFormations,
    getFormation,
    createFormation,
    deleteFormation,
    updateFormation
} = require('../controllers/coursesController')

const router = express.Router()

// GET all formations
router.get('/', getFormations)

// GET a single formation
router.get('/:id', getFormation)

// POST a new formation
router.post('/', createFormation)

// DELETE a formation
router.delete('/:id', deleteFormation)

// UPDATE a formation
router.patch('/:id', updateFormation)

module.exports = router