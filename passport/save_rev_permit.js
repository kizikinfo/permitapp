var Permit = require('../models/permit');
var sharedEmailService = require('../passport/shared_email_service');

var htmltxt;

module.exports = function(obj, u){

    htmltxt = '<h1>Dear Originator,</h1><p>'+obj.reviewer_name+' has reviewed your permit with ID '+obj.id+'.</p><p>Please follow the link below to open the permit.</p><a href="https://newsitename.com">Open the Permit '+obj.id+'</a>';
    
    return savePermitById(obj, u); 
}


var savePermitById = function(obj, u){
    return new Promise(function(resolve, reject) {
        Permit.findOne({'permit.gen_per_id' : obj.id}, 
                function(err, p) {
                    if (err)
                        reject(err);

                    p.markModified("permit");

                    obj.reviewer_index = p.permit.reviewers.findIndex(x => x.email==u.email);
                    console.log('obj.reviewer_index: '+obj.reviewer_index);

                    p.permit.reviewers[obj.reviewer_index].reviewed = "yes";

                    if(obj.reviewer_rej_comment){
                        p.permit.reviewers[obj.reviewer_index].comment = obj.reviewer_rej_comment;                   
                        p.permit.reviewers[obj.reviewer_index].approved = "no";
                        p.permit.gen_per_status = 'rejected'; 
                    }else{
                        p.permit.reviewers[obj.reviewer_index].approved = "yes";
                    }
                    
                    p.permit.reviewers[obj.reviewer_index].name = obj.reviewer_name;
                    p.permit.reviewers[obj.reviewer_index].signature = obj.reviewer_signature;
                    p.permit.reviewers[obj.reviewer_index].approved_time = obj.reviewer_approved_date;
                    //console.log(JSON.stringify(p, null, 2));                    
                    var count = 0;
                    var rejcount = 0;
                    for(var i=0; i<p.permit.reviewers.length; i++){
                        if(p.permit.reviewers[i].reviewed==='yes'){
                            count++;
                        }
                        if(p.permit.reviewers[i].signature==='Rejected'){
                            rejcount++;
                        }
                    }
                    console.log('--------------------------------count: '+count);
                    console.log('--------------------------------rejcount: '+rejcount);
                    if(parseInt(rejcount)>0){
                        p.permit.gen_per_status = 'rejected'; 
                    }else{                            
                        if(parseInt(count)===2){
                            p.permit.gen_per_status = 'reviewed'; 
                        }
                    }
                    p.save(function(err) {
                        if (err){ 
                            reject(err);  
                        }
                        console.log('Permit saved succesfully'); 
                        var temparray = [{txt: htmltxt, sub: 'Reviewed Permit', em: p.permit.gen_per_generator_email}];
                        resolve(temparray);
                    });
                }
        );
    }).then(function(items){
        console.log('aaaaaaaaaaaaaaaa---------------');
        return sharedEmailService(items);
    }).catch(function(err){
        console.log(err);
    });
}




