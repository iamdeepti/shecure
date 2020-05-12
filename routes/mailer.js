var mailer = require("nodemailer");
const express = require("express");
const router = express.Router();

// Use Smtp Protocol to send Email
router.post(
    "/",async(req,res)=>{
        try{
            var transporter = mailer.createTransport({
                service: 'outlook',
                auth: {
                  user: 'hackDP_DTU@outlook.com',
                  pass: 'DEEPpriya'
                }
              });
              
              var mailOptions = {
                from: 'hackDP_DTU@outlook.com',
                to: 'deeptisingh956@gmail.com',
                subject: 'Sending Email using Node.js',
                text: 'That was easy!'
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            res.send('mail sent');
        }
        catch(err){
            console.log(err);
        }
    }
);
module.exports = router;
