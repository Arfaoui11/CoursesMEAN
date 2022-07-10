require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const CoursesRoutes = require('./routes/course')
const UserRoutes = require('./routes/user')
const CommentRoutes = require('./routes/comment')
const cookieParser = require('cookie-parser')
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const morgan = require('morgan')
const nodemailer = require('nodemailer');




//const swaggerUi = require('swagger-ui-express'),
//swaggerDocument = require('./swagger.json');




//const mailers = require('./nodemailer/mailer')

const authJwt = require('./jwt/jwt');
const errorHandler = require('./jwt/error-handler')

// express app
const app = express();
app.use(morgan('tiny'));

// middleware

//app.options('*',cors());

app.use('/public/uploads',express.static(__dirname +'/public/uploads'))

// use of body parser
/*app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

 */



app.use(cookieParser());

app.use(cors({
    credentials:true,
    origin:['http://localhost:4200']
}));


app.use(express.json());

app.use(express.urlencoded({ extended: true}))




app.use(authJwt.apply());

app.use(errorHandler)

/*
// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: "1.0.0",
            title: "Courses API",
            description: "Courses API Information",
            contact: {
                name: "Arfaoui Jr Mahdi Developer"
            },
            servers: ["http://localhost:4000"]
        }
    },
    // ['.routes/*.js']
    apis: ["./routes/*.js"]
};

 */

//const swaggerDocs = swaggerJsDoc(swaggerOptions);

//app.use("/api-swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","c-access-token,Origin,Content-Type,Accept");
    next();
});

app.use('/api', CoursesRoutes , UserRoutes , CommentRoutes )





// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('connected to database')
        // listen to port
        app.listen(process.env.PORT, () => {
            console.log('listening for requests on port', process.env.PORT)
        })
    })
    .catch((err) => {
        console.log(err)
    })
