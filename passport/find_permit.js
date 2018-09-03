var Permit = require('../models/permit');

module.exports = function(user){
    return findPermits(user); 
}


var findPermits = function(user){
    var obj = {}; 
    obj.permits = [];
    if(user.authorized==='yes'){
        return new Promise(function(resolve, reject) { 
            Permit.find({'permit.reviewers.email' : user.email, 'permit.gen_per_status': { $ne: 'closed' }}, 
                    function(err, permits) {
                        if (err)
                            reject(err);
                        //console.log(JSON.stringify(permits, null, 2));
                        for(var i=0; i<permits.length; i++){
                            for(var j=0; j<permits[i].permit.reviewers.length; j++){
                                if(permits[i].permit.reviewers[j].email===user.email){
                                    if(permits[i].permit.reviewers[j].reviewed==='no'){
                                        var o = {};
                                        o.desc = permits[i].permit.s_work;
                                        o.id = permits[i].permit.gen_per_id;
                                        obj.permits.push(o);
                                    }
                                }
                            }
                        }
                        resolve(obj);
                    }
                );
        }).catch(function(err){
            console.log(err);
        });
    }else{
        return new Promise(function(resolve, reject) { 
            Permit.find({'permit.gen_per_status': { $ne: 'closed' }}, 
                    function(err, permits) {
                        if (err)
                            reject(err);
                        //console.log(JSON.stringify(permits, null, 2));
                        for(var i=0; i<permits.length; i++){
                            for(var j=0; j<permits[i].permit.reviewers.length; j++){
                                if(permits[i].permit.reviewers[j].reviewed==='yes'){
                                    var o = {};
                                    o.desc = permits[i].permit.s_work;
                                    o.id = permits[i].permit.gen_per_id;
                                    obj.permits.push(o);
                                    break;
                                }
                            }
                        }
                        resolve(obj);
                    }
                );
        }).catch(function(err){
            console.log(err);
        }); 
    }
}

