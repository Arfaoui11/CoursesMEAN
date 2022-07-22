const User = require('../models/user')
const Course = require('../models/course')
const CourseApprenant = require('../models/courseApprenant')

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const multer = require('multer')

const mongoose = require('mongoose')

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.originalname + '-' + Date.now()+ '.' +extension)
    }
})
const upload = multer({ storage: storage })





//login





////////////////////// login jwt jdida //////////////////

const loginNew = async (req,res) => {

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
                id : user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {
                expiresIn: '1d'
            }
        )
        res.cookie('jwt',token ,{
            httpOnly:true,
            maxAge : 24 *60 *60 *1000 // 1 day
        })
        res.status(200).json({message : 'success'});
    }else
    {
        res.status(200).json('Password Wrong !!!!')
    }


}


const getUsera =async (req,res) => {

    try {
        const secret = process.env.JWT_SECRET

        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie,secret)

        if(!claims){
            return res.status(401).send({
                message: 'Unauthenticated'
            })
        }

        const user = await User.findOne({id:claims.id})

        const {password,...data} = await user.toJSON();


        res.send(data)
    }catch (e) {
        res.status(401).send({message : 'Unauthenticated'})
    }



}


const logout = async (req,res) => {
    res.cookie('jwt','',{
        maxAge : 0
    })

    res.send({message : 'success'})
}





////////////////////////login node jwt la9dima ///////////////////
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

        res.status(200).json({user : user , token : token})
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



const getFormer = async (req, res) => {
    const Users = await User.find({type : 'FORMER'}).select('-password')

    res.status(200).json(Users)
}

// get a single formation
const getUser = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such User'})
    }

    const course = await User.findById(id).select('-password')

    if (!course) {
        return res.status(404).json({error: 'No such User'})
    }

    res.status(200).json(course)
}

// create a new formation
const createUser = async (req, res) => {

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request')

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    const {firstName,lastName, profession,email, type,state,salary,isAdmin,tarifHoraire,age,phoneNumber} = req.body;




    // add to the database
    try {
        let user = await User.create({firstName,lastName, email,isAdmin,file : `${basePath}${fileName}` ,profession, type,state, password : bcrypt.hashSync(req.body.password,10),salary,tarifHoraire,age,phoneNumber} )
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}






// delete a formation
const deleteUser = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such User'})
    }

    const Formateur = await User.findOneAndDelete({_id: id})

    if(!Formateur) {
        return res.status(400).json({error: 'No such User'})
    }

    res.status(200).json(Formateur)
}

// update a formation
const updateUser = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such User'})
    }

    const formateur = await User.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!formateur) {
        return res.status(400).json({error: 'No such User'})
    }

    res.status(200).json(formateur)
}


const desaffectionApp = async (req, res) => {
    const { idA,idF } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idA)) {
        return res.status(400).json({error: 'No such CourseApprenant'})
    }

    const courseApprenant = await CourseApprenant.findOneAndDelete({course: idF ,userA : idA}, {
        ...req.body
    });

    const user = await User.findByIdAndUpdate({_id: courseApprenant.userA},{ $pull: { courseApprenants: courseApprenant._id } })

    const course = await Course.findByIdAndUpdate({_id: courseApprenant.course},{ $pull: { courseApprenants: courseApprenant._id } })




    if(!courseApprenant) {
        return res.status(400).json({error: 'No such CourseApprenant'})
    }

    res.status(200).json(courseApprenant)
}





module.exports = {
    loginRequest,
    getUsers,
    getFormer,
    getUser,
    createUser,
    deleteUser,
    desaffectionApp,
    updateUser,
    upload,
}
