const express = require('express')
const {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
} = require('../controllers/userController')

const router = express.Router()

// GET all formations
router.get('/user/', getUsers)

// GET a single formation
router.get('/user/:id', getUser)

// POST a new formation
router.post('/user/', createUser)

// DELETE a formation
router.delete('/user/:id', deleteUser)

// UPDATE a formation
router.patch('/user/:id', updateUser)

module.exports = router
