var Permit = require('../models/permit');

module.exports = function(permit){
    return saveInMongo(permit); 
}


var saveInMongo = function(permit){ 
    return new Promise(function(resolve, reject) {
        Permit.findOne({'permit.gen_per_id' : permit.gen_per_id}, function(err, p){
            //console.log(JSON.stringify(p)); 
            p.markModified("permit");
            permit.gen_per_status = 'closed';
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
}





