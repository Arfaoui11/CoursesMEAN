const expressJwt = require("express-jwt");

function authJwt() {
    const secret = process.env.JWT_SECRET;
    return expressJwt({
            secret,
            algorithms: ['HS256'],
        }).unless({

        path : [
            {url : /\/api\/courses(.*)/ , methods : ['GET','OPTIONS'] },
            '/api/user/login',
            '/api/user/register'
        ]

        })

}

module.exports = authJwt;
