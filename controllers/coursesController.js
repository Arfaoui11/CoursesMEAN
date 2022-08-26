const Formation = require('../models/course')
const User = require('../models/user')
const Certificate = require('../models/certificate')
const Order = require('../models/order')
const OrderDetail = require('../models/order-detail')

const path = require('path');
const http = require('http');
const fs = require('fs');
const Quiz = require('../models/quiz')
const Result = require('../models/result')
const cron = require('node-cron');
const mailers = require('../nodemailer/mailer')

const CourseApprenant = require('../models/courseApprenant')

const mongoose = require('mongoose')


const multer = require('multer')

const pdfa = require('../pdf/pdfDoc')




// Schedule tasks to be run on the server.
cron.schedule('* * * * *', function() {
     CertifactionStudents();
});


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





const getCourses = async (req, res) => {
    const courses = await Formation.find({}).sort({createdAt: -1}).populate('userF comments').populate({path:'courseApprenants',populate:'course userA' })
    //console.log(courses)
    res.status(200).json(courses)
}

// get a single formation
const getCourse = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Course'})
    }

    const course = await Formation.findById(id).populate('userF').populate({path:'courseApprenants',populate:'course userA' }).populate({path:'comments',populate:'course user' })


    if (!course) {
        return res.status(404).json({error: 'No such Course'})
    }

    res.status(200).json(course)
}


const searchCourses = async (req, res) => {
    const {title, domain,level,order} = req.body;

    console.log(title + " "+domain + " "+level);


    if( level === 'All' && domain === 'All'){
        const course = await Formation.find({title : { $regex: title+ "" , $options: 'i' }}).sort({costs : order});

        if (!course) {
            return res.status(404).json({error: 'No such users with this search'})
        }



        res.status(200).json(course);
    }
    else if (level === 'All') {

        const course = await Formation.find({$and:[{domain : { $regex: domain + "", $options: 'i' }},{title : { $regex: title + "", $options: 'i' }}]}).sort({costs : order});

        if (!course) {
            return res.status(404).json({error: 'No such users with this search'})
        }

        res.status(200).json(course)
    }else if (domain === 'All') {

        const course = await Formation.find({$and:[{level : { $regex: level + "", $options: 'i' }},{title : { $regex: title + "", $options: 'i' }}]}).sort({costs : order});

        if (!course) {
            return res.status(404).json({error: 'No such users with this search'})
        }


        res.status(200).json(course)
    } else  if (title) {

        const course = await Formation.find({$and:[{level:{ $regex: level + "", $options: 'i' }},{domain : { $regex: domain + "", $options: 'i' }},{title : { $regex: title , $options: 'i' }}]}).sort({costs : order});

        if (!course) {
            return res.status(404).json({error: 'No such users with this search'})
        }



        res.status(200).json(course);

    }else
    {
        const course = await Formation.find({}).sort({costs : order});

        if (!course) {
            return res.status(404).json({error: 'No such users with this search'})
        }


        res.status(200).json(course);
    }


}

const search = async (req, res) => {
    const {key} = req.body;


    const course = await Formation.find({$or:[{level:{ $regex: key, $options: 'i' }},{domain : { $regex: key, $options: 'i' }},{title : { $regex: key, $options: 'i' }}]});



    if (!course) {
        return res.status(404).json({error: 'No such Course in this search'})
    }

    res.status(200).json(course)
}

const getFormationByApprenant = async (req, res) => {
    const {idA} = req.params;

    if (!mongoose.Types.ObjectId.isValid(idA)) {
        return res.status(404).json({error: 'No such Course'})
    }

    const ids = [];

    const course = await CourseApprenant.find({userA : idA})

    course.forEach(t=> {
        ids.push(t.id)
    })



    const list = await Formation.find({courseApprenants : { $in : ids}}).populate('userF').populate({path:'courseApprenants',populate:'course userA' }).populate({path:'comments',populate:'course user' })


    if (!list) {
        return res.status(404).json({error: 'No such Course'})
    }

    res.status(200).json(list)

}
const getApprenantByFormation = async (req, res) => {
    const {idC} = req.params;

    if (!mongoose.Types.ObjectId.isValid(idC)) {
        return res.status(404).json({error: 'No such Course'})
    }

    const ids = [];

    const course = await CourseApprenant.find({course : idC}).populate('userA')

    course.forEach(t=> {
        ids.push(t.userA.id)
    })



    const list = await User.find({_id : { $in : ids}})


    if (!list) {
        return res.status(404).json({error: 'No such Course'})
    }

    res.status(200).json(list)

}

const countCoursesByFormer = async (req, res) => {
    const { id ,dateD,dateF } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Course'})
    }

    let nbr = 0;

    const NbrcourseByFormer = await Formation.countDocuments({'userF':id});

    const course = await Formation.find({$and:[{'userF':id},{'start':{"$gte": dateD}},{'end':{"$lte": dateF}}]}).populate('userF')

    course.forEach(t => {
        nbr += (t.nbrHours * t.userF.tarifHoraire)

    })


    if (!NbrcourseByFormer) {
        return res.status(404).json({error: 'No such Course'})
    }

    res.status(200).json({count :NbrcourseByFormer })
}

const getNbrApprenantByFormation = async (req, res) => {
    const { id  } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Course'})
    }



    const course = await Formation.findById(id)




    if (!course) {
        return res.status(404).json({error: 'No such Course'})
    }

    res.status(200).json({count :course.courseApprenants.length })
}

const getCoursesByFormer = async (req, res) => {


    const { idF } = req.params;


    if (!mongoose.Types.ObjectId.isValid(idF)) {
        return res.status(404).json({error: 'No such Course'})
    }


    const courses = await Formation.find({'userF':idF});




    if (!courses) {
        return res.status(404).json({error: 'No such Course'})
    }

    res.status(200).json(courses)
}







// create a new formation
const  createCourse =  async (req, res) => {
    const {title, domain,level, start,end,nbrHours,lieu,nbrMaxParticipant,costs} = req.body;


    // add to the database
    try {
        const course = await Formation.create({title, domain,level,  start,end,nbrHours,lieu,nbrMaxParticipant,costs})
        res.status(200).json(course)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
const createCourseAndAssignToFormer = async (req, res) => {
    // find out which post you are commenting
    const id = req.params.id;

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request')

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;



    const {title, domain,level, start,end,nbrHours ,lieu,nbrMaxParticipant,costs} = req.body
    // get the comment text and record post id
    try {
        const formateur = await User.findById(id);

        if (formateur.type.toString() !== "FORMER")
        {
            res.status(404).json({ error: 'Assign to Courses former not Other type' })
        }
        const course = await Formation({title, domain,level,image : `${basePath}${fileName}` , start,end,nbrHours,lieu,nbrMaxParticipant,costs,userF: id})

        // save comment
        await course.save();
        // get this particular post

        // push the comment into the post.comments array
        formateur.coursesF.push(course);
        // save and redirect...
        await formateur.save()
        res.status(200).json(course)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}

const updatreCourseAndAssignToFormer = async (req, res) => {
    // find out which post you are commenting
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such Course'})
    }

    const files = req.files
    let filesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files.length >= 1)
    {
        files.map( f => {
            filesPaths.push(`${basePath}${f.filename}`)
        })
    }else
    {
        return res.status(400).json({error: 'No such Files'})
    }
    // get the comment text and record post id
    try {



        const course = await Formation.findByIdAndUpdate(id, {
                images : filesPaths
            },
            { new:true }
        )

        if (!course) {
            return res.status(500).json({error: 'the Courses cannot be updated ! '})
        }



        res.status(200).json(course)

    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}



const assignApprenantToCourse = async (req, res) => {
    // find out which post you are commenting
    const {idF,idA} = req.params;




    // get the comment text and record post id
    try {
        const apprenant = await User.findById(idA)
        const formation = await Formation.findById(idF).populate('userF')




        if (apprenant.type.toString() !== "STUDENT")
        {
            res.status(404).json({ error: 'Assign to Courses STUDENT not Other type' })
        }


       // const nbrapp = await getNbrApprenantByFormation({id : formation._id},{})
       // console.log(nbrapp)

        const courseApp = await CourseApprenant({course:formation._id,userA:apprenant._id})
        await courseApp.save();




        apprenant.courseApprenants.push(courseApp);

        formation.courseApprenants.push(courseApp);

        await apprenant.save();
        await formation.save();


        // save and redirect...
        //send email to anather mail
        mailers.mail("mahdijr2015@gmail.com","Congratulations Mr's : " + apprenant.lastName + " " + apprenant.firstName + " you have added new Courses", " Former Name : "+formation.userF.lastName,formation.image)

       // pdfa(formation,apprenant,'public/certif/Certif.pdf','public/certif/output.pdf');


        res.status(200).json(courseApp)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}

async function  getScore  (idC,idU) {

    const ids = [];
    try {

        const course = await Formation.findById(idC)
        const quizzes = await Quiz.find({'course':course.id})

        const user = await User.findById(idU);


        const results = await Result.find({'user':user.id}).populate('quiz')




        results.forEach(
            (array22) => quizzes.some((array11) => {
                if(array22.quiz.id === array11.id && array22.status !== true){
                    ids.push(array22)
                }
            }));



        let somme = 0 ;

        if (ids.length ===5)
        {
            for (const t of ids)
            {
                somme += t.totalCorrect;

            }
            if (somme >= 100)
            {
                for (const t of ids)
                {
                const result = await Result.findByIdAndUpdate(t.id, {
                        status : true
                    },
                    { new:true }
                );
                }
            }


            return  somme;
        }else {
            return 0;
        }







    }catch (e) {
        console.log(e.message)
    }

}




// delete a formation
const deleteCourse = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such Course'})
    }

    const course = await Formation.findOneAndDelete({_id: id})

    if(!course) {
        return res.status(400).json({error: 'No such Course'})
    }

    res.status(200).json(course)
}

const getCertifcateByCoursesAndUser = async (req, res) => {

    const { idC,idU } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idC)) {
        return res.status(400).json({error: 'No such Course'})
    }

    const user = await User.findById(idU)
    const course = await Formation.findById(idC)

    const certif = await Certificate.findOne({'user':user.id,'course':course.id })

    if(!certif) {
        return res.status(400).json({error: 'No such Course'})
    }

    res.status(200).json(certif)
}

// update a formation
const updateCourse = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such Course'})
    }

    const course = await Formation.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!course) {
        return res.status(400).json({error: 'No such Course'})
    }

    res.status(200).json(course)
}


// update a formation
const DownloadFiles = async (req, res,next) => {
    let filepath = path.join( 'C:\\Users\\LEGION-5\\WebstormProjects\\CoursesMERN\\public\\uploads') + '\\' + req.body.filename;

    res.sendFile(filepath);

    };



const CertifactionStudents = async (req, res) => {


   try {

        const courses = await Formation.find({}).populate('userF');
        const useres = await User.find({'type': 'STUDENT'})

       for (const array22 of courses) {
           for (const array11 of useres)  {

               const score = await getScore(array22.id, array11.id);

               if (score >= 100) {


                   const lien = new Date().toISOString();
                   const certificate = await Certificate({course:array22.id,user:array11.id,name : array22.title,path : array11.id+array22.id+'.pdf'})
                   await certificate.save();




                   array11.Certificates.push(certificate);

                   array22.certificates.push(certificate);

                   await array11.save();
                   await array22.save();

                   await pdfa(array22, array11, 'public/certif/Certif.pdf', 'public/uploads/'+array11.id+array22.id+'.pdf');

                   console.log(" Congratulations Mr's : " + array11.lastName + " " + array11.firstName + " you have finished your Courses  ")
                   mailers.mail("mahdijr2015@gmail.com", " Congratulations Mr's : " + array11.lastName + " " + array11.firstName + " you have finished your Courses  ", array22.userF.lastName, './public/uploads/'+array11.id+array22.id+'.pdf')



               }


           }
       }




   }catch (e) {

       console.log(e.message)

   }


}




const CheckOutCourses = async (req, res) => {
    const { id} = req.params;

    const newOrder = req.body;


    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such User'})
    }

    try {


        const user = await User.findById(id);

        if(!user) {
            return res.status(400).json({error: 'No such User'})
        }
        let totalCost = 0 ;

        if (newOrder.length >= 1)
        {
            newOrder.map( f => {
            totalCost += f.costs;
            })

        }



        const order = await Order({user:user.id,total:totalCost}).populate({path:'orderDetails',populate:'order course'});
        await order.save();






        user.orders.push(order);
        await user.save();


        if (newOrder.length >= 1)
        {

            for (const f of newOrder){

                const course = await Formation.findById(f.id);

                const detail = await OrderDetail({course : course.id,order : order.id});
                await detail.save();

                course.orderDetails.push(detail);
                order.orderDetails.push(detail);
                await course.save();
                await order.save();

                console.log(" Congratulations  : " + user.lastName + " " + user.firstName + " you have added new  Courses  "+course.title);
                await  mailers.mail("mahdijr2015@gmail.com", " Congratulations Mr's : " + user.lastName + " " + user.firstName + " you have added new  Courses Title : "+course.title + "Price : " + course.costs +" .",course.title, course.image);


            }



        }

        await  mailers.mail("mahdijr2015@gmail.com", "Your order’s been processed","Thanks for choosing to learn with us — we’re excited to be on your journey with you.\n", './public/uploads/shopping_cart_500px.png',
            '<table style="border-bottom: 1px solid #ddd;">' +
            '<thead>' +
            '<th> Course name </th>' +
            '<th> Total price </th>' +
            '</thead>' +
            '<tr >' +
            '<td>' + order.orderDetails.course + '</td>' +
            '<td>' + order.total + '</td>' +
            '</tr>' +
            '</table>');

        console.log(order);
        res.status(200).json(newOrder);

    }catch (e) {

        console.log( "error message :" +e.message)

    }


}







module.exports = {
    getCourses,
    getCourse,
    getScore,
    DownloadFiles,
    createCourse,
    createCourseAndAssignToFormer,
    countCoursesByFormer,
    getCertifcateByCoursesAndUser,
    getCoursesByFormer,
    getNbrApprenantByFormation,
    deleteCourse,
    updateCourse,
    searchCourses,
    search,
    CheckOutCourses,
    getFormationByApprenant,
    getApprenantByFormation,
    updatreCourseAndAssignToFormer,
    assignApprenantToCourse,
    upload,
}
