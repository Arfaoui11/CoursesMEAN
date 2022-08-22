const nodemailer = require('nodemailer');

require('dotenv').config()

const Services =   {
 mail :  (email,message,object,path,link) => {
     const transporter = nodemailer.createTransport({
         service: "gmail",
         auth: {
             user: `${process.env.EMAIL_ADDRESS}`,
             pass: `${process.env.EMAIL_PASSWORD}`,
         }
     });


     const mailOptions = {
         from: process.env.EMAIL_ADDRESS,
         to: email ,
         subject: ` ${object}`,
         text: message,
         html : link,
         attachments: [
             {
                 // use URL as an attachment
                // filename: 'Certif.pdf',
                 path: `${path}`
             } ]
     };

     transporter.sendMail(mailOptions, (err, response) => {
         if (err) {
             console.error("err ", err);
         } else {
             console.error("message ", "Email sent");
         }
     });
 }


}

module.exports = Services
