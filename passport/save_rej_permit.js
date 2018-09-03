var Permit = require('../models/permit');
var sharedEmailService = require('../passport/shared_email_service');


var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var emailFrom = 'postmaster@sandbox3c649c5aee334ddb9933d5cb9131e1aa.mailgun.org';
var pswrd = 'b4a17b88fe253dbf59bd34875bd106ff';
var transport = nodemailer.createTransport(smtpTransport({
    service: 'Mailgun',
    auth: {
        user: emailFrom, 
        pass: pswrd
    }
}));


var htmltxt;

module.exports = function(permit){

    htmltxt = '<h1>Dear Reviewer,</h1><p>Could you please find corrected permit with ID '+permit.gen_per_id+' as per your comments.</p><p>Follow the link below to open the permit.</p><a href="https://newsitename.com">Open the Permit '+permit.gen_per_id+'</a>';

    return saveInMongo(permit); 

}


var saveInMongo = function(permit){
    if(permit.gen_per_status==='closed'){
        console.log('hkjkjk');
        return new Promise(function(resolve, reject) {
            Permit.findOne({'permit.gen_per_id' : permit.gen_per_id}, function(err, p){
                //console.log(JSON.stringify(p)); 
                p.markModified("permit");
                p.permit = permit;
                p.save(function(err) {
                    if (err){ 
                        reject(err);  
                    }
                    console.log('Closed permit saved succesfully'); 
                    console.log('i am done 1st!');
                    resolve('we have done it!');
                });
            });
        }).catch(function(err){
            console.log(err);
        });
    }else{ 
        console.log('1122334566');
        return new Promise(function(resolve, reject) {
            Permit.findOne({'permit.gen_per_id' : permit.gen_per_id}, function(err, p){
                //console.log(JSON.stringify(p)); 
                p.markModified("permit");
                var temparray = [];
                for(var i=0; i<permit.reviewers.length; i++){
                    if(permit.reviewers[i].approved === 'no'){
                        var o= {};
                        o.txt = htmltxt;
                        o.sub = 'For review';
                        o.em = permit.reviewers[i].email;
                        temparray.push(o);
                        permit.reviewers[i].reviewed = 'no';
                    }
                } 
                p.permit = permit;
                p.save(function(err) {
                    if (err){ 
                        reject(err);  
                    }
                    console.log('Rejected permit saved succesfully'); 
                    console.log('i am done 1st!');
                    resolve(temparray);
                });
            });
        }).then(function(items){
            return sharedEmailService(items);   
        }).catch(function(err){
            console.log(err);
        });
    }
}





