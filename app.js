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



let userList = new Map();

io.on('connection', (socket) => {

    console.log('chat app connected')
    let userName = socket.handshake.query.userName;
    addUser(userName, socket.id);

    let user  = userName.split(',');

    socket.broadcast.emit('user-list', [...userList.keys()]);
    socket.emit('user-list', [...userList.keys()]);

    socket.on('message', (msg) => {
        socket.broadcast.emit('message-broadcast', {message: msg, userName: user.toString()});
    })

    socket.on('disconnect', (reason) => {
        console.log('user logout')
        removeUser(user[0], socket.id);
    })
});

function addUser(userName, id) {

    //let user  = userName.split(',');

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




////////////////////////////////////////
// maybe replace with socket.io
const WebSocket = require("ws").Server;
const { v4: getID } = require("uuid");
const port = 2233 ;

const CLIENTS = new Map();

const ROOMS = new Map();

const wss = new WebSocket({ port });
console.log("ws:// listening on %d", port);

wss.on("connection", (client) => {
    const id = getID();
    client.uid = id;
    CLIENTS.set(id, client);
    const msg = {
        type: "connection",
        message: "Welcome",
        id: id,
    };
    client.send(JSON.stringify(msg));

    client.on("close", () => {
        const leave_id = client.uid;
        const room_id = client.room;
        if (client.room) {
            const thisRoom = ROOMS.get(room_id);
            if (thisRoom.attendees.has(leave_id)) {
                const msg = {
                    type: "leave",
                    message: "Tschö mit Ö",
                    id: client.uid,
                };
                thisRoom.attendees.forEach((c) => {
                    if (c !== client) {
                        c.send(JSON.stringify(msg));
                    }
                });
                thisRoom.attendees.delete(leave_id);
                if (thisRoom.attendees.size === 0) {
                    ROOMS.delete(room_id);
                }
            }
        }
        CLIENTS.delete(leave_id);
    });
    client.on("message", (m) => {
        const msg = JSON.parse(m);
        const room = msg.id;
        switch (msg.type) {
            case "connection":
                client.name = msg.message;
                break;
            case "message":
                if (ROOMS.has(room)) {
                    const thisRoom = ROOMS.get(room);
                    console.log(client.name);
                    msg.id = client.name;
                    thisRoom.attendees.forEach((c) => {
                        c.send(JSON.stringify(msg));
                    });
                }
                break;
            case "join":
                client.room = room;
                if (!ROOMS.has(room)) {
                    const newroom = {
                        name: room,
                        host: client,
                        attendees: new Map(),
                    };
                    ROOMS.set(room, newroom);
                }
                const thisRoom = ROOMS.get(room);
                thisRoom.attendees.set(client.uid, client);
                const list = [];
                thisRoom.attendees.forEach((c) => {
                    list.push({ name: c.name, id: c.uid });
                });
                const m = { message: list, id: client.uid, type: "list" };
                thisRoom.attendees.forEach((c) => {
                    c.send(JSON.stringify(m));
                });
                break;
            case "available":
                if (ROOMS.has(room)) {
                    const thisRoom = ROOMS.get(room);
                    msg.id = msg.message;
                    msg.message = client.name;
                    thisRoom.attendees.forEach((c) => {
                        console.log("call", c.name);
                        if (c !== client) {
                            c.send(JSON.stringify(msg));
                        }
                    });
                }
                break;
        }
    });
});



////////////////////////////////////////
