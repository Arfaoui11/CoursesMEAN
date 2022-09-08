const User = require('../models/user')
const Course = require('../models/course')
const CourseApprenant = require('../models/courseApprenant')
const Result = require('../models/result')
const Quiz = require('../models/quiz')
const mailers = require('../nodemailer/mailer')
const cron = require('node-cron');
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

        const cookie = req.cookies['jwt'];

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


    const secret = process.env.JWT_SECRET;
    const user = await  User.findOne({email: req.body.email});


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
        );

        if (user.verified === false)
        {
            return res.status(404).json({error: 'please verify your account '})
        }

        res.status(200).json({user : user , token : token});
    }else
    {
        res.status(404).json('Password Wrong !!!!')
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
    if (!file) return res.status(400).send('No image in the request');

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    const {firstName,lastName, profession,email, type,state,salary,password,isAdmin,tarifHoraire,age,phoneNumber} = req.body;




    // add to the database
    try {


        User.findOne({email}).exec(async (err,users) => {

            if (users) {
                return res.status(400).json({error : " User with this email already exists. "})
            }

            let user = await User.create({firstName,lastName, email,isAdmin,file : `${basePath}${fileName}` ,profession, type,state, password : bcrypt.hashSync(req.body.password,10),salary,tarifHoraire,age,phoneNumber} );


            const token = jwt.sign({lastName,email,password },process.env.JWT_ACC_ACTIVAT,{expiresIn:'20m'});






            mailers.mail(email,'Account Activation Link',
                "Udacity Academy Website",user.file,`<h2>Please click on give link to activate your account </h2>
                        <p>http://localhost:4200/verification/${token}</p>`);
            res.status(200).json(user)



        })


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

/*cron.schedule('1-1 * * * * *',  async function() {

    const fileName = `user_shield_64px.png`;
    const basePath = `http://localhost:4000/public/uploads/`;

    const email = "admin@gmail.com";
    const firstName = "Admin";
    const lastName = "Admin";
    const isAdmin = true;
    const verified = true;
    const type = "ADMIN";
    const password = "allAccessWithAdmin2023";
    const phoneNumber = "+21670258369";


    try {

        User.findOne({email}).exec(async (err,users) => {

            if (users) {
                console.log(" User with this email already exists. ");
            }else
            {
                let user = await User.create({firstName,lastName, email,isAdmin,verified ,file : `${basePath}${fileName}` , type, password : bcrypt.hashSync(password,10),phoneNumber} );



                mailers.mail(email,'Account Admin Created With Success',
                    "Udacity Academy Website",user.file);

                console.log("Account Create With Success");
            }

        })


    }catch (error) {
        console.log(error.message);

    }


});*/


const createAccountAdmin = async () => {

    const fileName = `user_shield_64px.png`;
    const basePath = `http://localhost:4000/public/uploads/`;

    const email = "mahdi.arfaoui1@gmail.com";
    const firstName = "Admin";
    const lastName = "Admin";
    const isAdmin = true;
    const verified = true;
    const type = "ADMIN";
    const password = "allAccessWithAdmin2023";
    const phoneNumber = "+21670258369";


    try {

        User.findOne({email}).exec(async (err,users) => {

            if (users) {
                console.log(" User with this email already exists. ");
            }else
            {
                let user = await User.create({firstName,lastName, email,isAdmin,verified ,file : `${basePath}${fileName}` , type, password : bcrypt.hashSync(password,10),phoneNumber} );



                mailers.mail(email,'Account Admin Created With Success',
                    "Udacity Academy Website",user.file);

                console.log("Account Create With Success");
            }

        })


    }catch (error) {
        console.log(error.message);

    }


};




    const resendEmailActivated = async (req,res) => {

    const {email} = req.body;

    try {

        User.findOne({email}).exec(async (err,user) => {
            if(err)
            {
                return res.status(400).json({error: 'Incorrect User'});
            }
            console.log(user);
            const token = jwt.sign({email},process.env.JWT_ACC_ACTIVAT,{expiresIn:'20m'});
            mailers.mail(email,'Account Activation Link',
                "Udacity Academy Website",user.file,`<h2>Please click on give link to activate your account </h2>
                        <p>http://localhost:4200/verification/${token}</p>`);
            res.status(200).json(user)


        });

    }catch (e) {
        res.status(400).json({ error: e.message })
    }

}


const activatedAccount = async (req,res) => {
    const {token} = req.body;
    if (token) {
        jwt.verify(token,process.env.JWT_ACC_ACTIVAT,function (err,decodedToken) {
            if (err)
            {
                return res.status(400).json({error: 'Incorrect orExpired link'});
            }
            const {lastName, email,password} = decodedToken;

            User.findOne({email}).exec(async (err,user) => {
                if(err)
                {
                    return res.status(400).json({error: 'Incorrect User'});
                }
                const userVerif = await User.findOneAndUpdate({_id: user.id}, {
                    verified:true
                });

                res.status(200).json(userVerif);
            });

        })
    }else
    {
        return res.status(400).json({error: 'Something went wrong  !!!!'});
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


const searchUser = async (req, res) => {
    const {firstName,lastName,verified, profession,email, type,state,salary,isAdmin,tarifHoraire,age,phoneNumber} = req.body;






    if (type === 'All' && state === 'All')
    {
        console.log("condition 1");
        const users = await User.find({$or:[{firstName:{ $regex: lastName , $options: 'i' }},{lastName:{ $regex: lastName, $options: 'i' }},{email : { $regex: lastName, $options: 'i' }},{phoneNumber:{ $regex: lastName, $options: 'i' }}]});

        if (!users) {
            return res.status(404).json({error: 'No such users with this search'})
        }

        res.status(200).json(users)
    }
    else if (lastName)
    {

        console.log("condition 2");
        const users = await User.find({$and:[ {$or:[{firstName:{ $regex: lastName , $options: 'i' }},{lastName:{ $regex: lastName, $options: 'i' }},{email : { $regex: lastName, $options: 'i' }},{phoneNumber:{ $regex: lastName, $options: 'i' }}]} ,{state : { $regex: state, $options: 'i' }},{type : { $regex: type+ "", $options: 'i' }}]});

        if (!users) {
            return res.status(404).json({error: 'No such users with this search'})
        }

        res.status(200).json(users)
    }else {

        console.log("condition 3");
        const users = await User.find({$and:[{state : { $regex: state, $options: 'i' }},{type : { $regex: type+ "", $options: 'i' }},{verified : verified}]});

        if (!users) {
            return res.status(404).json({error: 'No such users with this search'})
        }

        res.status(200).json(users);
    }




}

// update a formation
const updateUser = async (req, res) => {
    const { id } = req.params;

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
    try {



    const courseApprenant = await CourseApprenant.findOneAndDelete({course: idF ,userA : idA}, {
        ...req.body
    });

    const user = await User.findByIdAndUpdate({_id: courseApprenant.userA},{ $pull: { courseApprenants: courseApprenant._id } })

    const course = await Course.findByIdAndUpdate({_id: courseApprenant.course},{ $pull: { courseApprenants: courseApprenant._id } })





        for (const t of course.quizzes) {

            const resulte = await Result.find({'quiz' : t , 'user': user._id}).populate('quiz')
            //   console.log(resulte[0]._id)

            // resulte.delete();


            for(const r of resulte)
            {
            console.log(r)

                    const results = await Result.findByIdAndDelete(r._id).populate('user quiz');


                   // console.log(results)

                    const user = await User.findByIdAndUpdate(results.user._id,{ $pull: { results: results._id } })


                    const quiz = await Quiz.findByIdAndUpdate(results.quiz._id,{ $pull: { results: results._id } })

            }



        }
        if(!courseApprenant) {
            return res.status(400).json({error: 'No such CourseApprenant'})
        }

        res.status(200).json(courseApprenant);



        if (!course.quizzes) {
            return res.status(400).json({error: 'No such Quiz have in this courses'})
        }

      //  res.status(200).json(course)

    }catch (error) {
        return  res.status(400).json({ error: error.message })
    }




}





module.exports = {
    loginRequest,
    getUsers,
    getFormer,
    getUser,
    searchUser,
    createUser,
    deleteUser,
    createAccountAdmin,
    desaffectionApp,
    activatedAccount,
    resendEmailActivated,
    updateUser,
    upload,
}
