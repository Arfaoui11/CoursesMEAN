const express = require('express')
const {
    loginRequest,
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser,
    upload,
} = require('../controllers/userController')

const router = express.Router()

//POST Login
router.post('/user/login',loginRequest)

// GET all formations
router.get('/user/', getUsers)

// GET a single formation
router.get('/user/:id', getUser)

// POST a new formation
router.post('/user/register',upload.single('image') , createUser)

// DELETE a formation
router.delete('/user/:id', deleteUser)

// UPDATE a formation
router.patch('/user/:id', updateUser)

module.exports = router
