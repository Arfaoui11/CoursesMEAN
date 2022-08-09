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
            {url : /\/api\/user(.*)/ , methods : ['POST','OPTIONS'] },
            {url : /\/api\/user\/activate(.*)/ , methods : ['POST','OPTIONS'] },
            {url : /\/api\/video(.*)/ , methods : ['GET','OPTIONS'] },
            {url : /\/api\/user(.*)/ , methods : ['POST','OPTIONS'] },
            {url : /\/api\/comment(.*)/ , methods : ['GET','POST','OPTIONS'] },
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
