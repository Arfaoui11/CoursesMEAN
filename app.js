require('dotenv').config()

const express = require('express')
const cors = require('cors')

const mongoose = require('mongoose')
const CoursesRoutes = require('./routes/course')
const UserRoutes = require('./routes/user')
const CommentRoutes = require('./routes/comment')
const QuizRoutes = require('./routes/quiz')
const RatingRoutes = require('./routes/rating')
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

////////////////////////////////
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

app.get('/', (req, res) => {
    res.send('Heelloaa world sss');
})

let userList = new Map();

io.on('connection', (socket) => {

    console.log('char app connected')
    let userName = socket.handshake.query.userName;
    addUser(userName, socket.id);

    socket.broadcast.emit('user-list', [...userList.keys()]);
    socket.emit('user-list', [...userList.keys()]);

    socket.on('message', (msg) => {
        socket.broadcast.emit('message-broadcast', {message: msg, userName: userName});
    })

    socket.on('disconnect', (reason) => {
        console.log('user logout')
        removeUser(userName, socket.id);
    })
});

function addUser(userName, id) {
    if (!userList.has(userName)) {
        userList.set(userName, new Set(id));
    } else {
        userList.get(userName).add(id);
    }
}

function removeUser(userName, id) {
    if (userList.has(userName)) {
        let userIds = userList.get(userName);
        if (userIds.size == 0) {
            userList.delete(userName);
        }
    }
}




//////////////////////////////////
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




//app.use(authJwt.apply());

//app.use(errorHandler)

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



//const swaggerDocs = swaggerJsDoc(swaggerOptions);

//app.use("/api-swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","c-access-token,Origin,Content-Type,Accept");
    next();
});

 */

app.use('/api', CoursesRoutes , UserRoutes , CommentRoutes ,QuizRoutes,RatingRoutes)





// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('connected to database')
        // listen to port
        http.listen(process.env.PORT, () => {
            console.log('listening for requests on port', process.env.PORT)
        })
    })
    .catch((err) => {
        console.log(err)
    })
