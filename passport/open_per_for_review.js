var Permit = require('../models/permit');

module.exports = function(per_id, u){
    return findPermitById(per_id, u); 
}


var findPermitById = function(per_id, u){
    var obj = {};
    return new Promise(function(resolve, reject) { 
        Permit.findOne({'permit.gen_per_id' : per_id}, 
                function(err, permit) {
                    if (err)
                        reject(err);
                    obj.per = permit;
                    obj.reviewer_index_wrp = permit.permit.reviewers.findIndex(x => x.email=='olx.513@mail.ru');
                    obj.reviewer_index_fo = permit.permit.reviewers.findIndex(x => x.email=='olx.514@mail.ru');
                    resolve(obj);
                }
            );
    }).catch(function(err){
        console.log(err);
    });
}

