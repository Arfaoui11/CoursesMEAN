const express = require('express')
const {
    loginRequest,
    getUsers,
    getUser,
    getFormer,
    createUser,
    deleteUser,
    updateUser,
    searchUser,
    desaffectionApp,
    activatedAccount,
    resendEmailActivated,
    upload,
} = require('../controllers/userController')

const router = express.Router()


//POST Login
router.post('/user/login',loginRequest)

// GET all formations
router.get('/user', getUsers)

router.get('/user/getFormer', getFormer)

// GET a single formation
router.get('/user/:id', getUser)

router.post('/user/search', searchUser);


router.post('/user/activate', activatedAccount);


router.post('/user/resendToken', resendEmailActivated);





// POST a new formation
router.post('/user/register',upload.single('file') , createUser)

// DELETE a formation
router.delete('/user/:id', deleteUser)

router.delete('/user/desaffection/:idA/:idF', desaffectionApp)

// UPDATE a formation
router.patch('/user/:id', updateUser)

module.exports = router
