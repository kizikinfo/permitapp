var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var mainjson = process.env;
var emailFrom = mainjson.login;
var pswrd = mainjson.password;
var transport = nodemailer.createTransport(smtpTransport({
    service: 'Mailgun',
    auth: {
        user: emailFrom, 
        pass: pswrd
    }
}));


module.exports = function(items){

    return sendEmail(items);

}

var sendEmail = function(items){
    
    var fn = function asyncfn(el){            
        return new Promise(function(resolve, reject) { 
            mailMsg = el.txt;
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Electronic Permit" <'+emailFrom+'>',
                to: el.em,
                subject: el.sub,
                html: mailMsg
            };
            // send mail with defined transport object
            transport.sendMail(mailOptions, (error, info) => {
                if (error) reject(error);
                console.log('Message sent to '+el.em);
                resolve('Message sent to '+el.em);
            });
        }).catch(function(err){
            console.log(err);
        });
    };

    var actions = items.map(fn);

    return Promise.all(actions);

}