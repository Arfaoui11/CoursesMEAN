require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const CoursesRoutes = require('./routes/course')
const UserRoutes = require('./routes/user')

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

//const swaggerUi = require('swagger-ui-express'),
//swaggerDocument = require('./swagger.json');

const bp = require("body-parser");




const authJwt = require('./jwt/jwt');
const errorHandler = require('./jwt/error-handler')

// express app
const app = express();

// middleware
app.use(cors());


app.use(express.json());

app.use(express.urlencoded({ extended: true}))
app.disable('etag');



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




app.use('/api', CoursesRoutes,UserRoutes)


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
