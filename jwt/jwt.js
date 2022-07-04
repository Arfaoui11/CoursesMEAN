const expressJwt = require("express-jwt");

function authJwt() {
    const secret = process.env.JWT_SECRET;
    return expressJwt({
            secret,
            algorithms: ['HS256'],
            isRevoked : isRevokedd
        }).unless({

        path : [
            {url : /\/api\/courses(.*)/ , methods : ['GET','OPTIONS'] },
            {url : /\/public\/uploads(.*)/ , methods : ['GET','OPTIONS'] },
            {url : /\/api-swagger(.*)/ , methods : ['GET','POST','PUT','DELETE','OPTIONS'] },
            '/api/user/login',
            '/api/user/register'
        ]

        })

}

async function isRevokedd(req ,payload,done) {
    if (!payload.isAdmin){
        done(null,true);
    }
    done();
}

module.exports = authJwt;
