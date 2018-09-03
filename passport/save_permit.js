var Permit = require('../models/permit');
var sharedEmailService = require('../passport/shared_email_service');




var htmltxt;

module.exports = function(permit){

    htmltxt = '<h1>Dear Reviewer,</h1><p>Could you review the permit with ID '+permit.gen_per_id+'.</p><p>Please follow the link below to open the permit.</p><a href="https://newsitename.com">Open the Permit '+permit.gen_per_id+'</a>';

    console.log('****************************************************************************************************************');
    //console.log(JSON.stringify(permit));

    return saveInMongo(permit); 

}


var saveInMongo = function(permit){ 
    return new Promise(function(resolve, reject) { 
        var newPermit = new Permit();
        // set the permit's local credentials
        newPermit.permit = permit;
        // save the permit
        newPermit.save(function(err) {
            if (err){ 
                reject(err);  
            }
            console.log('Permit Registration succesful'); 
            console.log('i am done 1st!'); 
            var temparray = [];
            for(var i=0; i<permit.reviewers.length; i++){
                var o= {};
                o.txt = htmltxt;
                o.sub = 'For review';
                o.em = permit.reviewers[i].email;
                temparray.push(o);
            } 
            resolve(temparray);
        });
    }).then(function(items){
        return sharedEmailService(items);
    }).catch(function(err){
        console.log(err);
    });
}


