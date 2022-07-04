const User = require('../models/user')
const Course = require('../models/course')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const mongoose = require('mongoose')

//login

const loginRequest = async (req,res) => {


    const secret = process.env.JWT_SECRET
    const user = await  User.findOne({email: req.body.email})

    if (!user)
    {
        return res.status(404).json({error: 'No such User Found'})
    }


    if (user &&  bcrypt.compareSync(req.body.password ,user.password))
    {
        const token = jwt.sign(
            {
                userId : user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {
                expiresIn: '1d'
            }
        )

        res.status(200).json({user : user.email , token : token})
    }else
    {
        res.status(200).json('Password Wrong !!!!')
    }


}



// get all formation
const getUsers = async (req, res) => {
    const Users = await User.find({}).select('-password')

    res.status(200).json(Users)
}

// get a single formation
const getUser = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    const course = await User.findById(id).select('-password')

    if (!course) {
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json(course)
}

// create a new formation
const createUser = async (req, res) => {
    const {firstName,lastName, profession,email, type,state,salary,isAdmin,tarifHoraire,age,phoneNumber} = req.body




    // add to the database
    try {
        let formateur = await User.create({firstName,lastName, email,isAdmin ,profession, type,state, password : bcrypt.hashSync(req.body.password,10),salary,tarifHoraire,age,phoneNumber} )
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
    loginRequest,
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
}
