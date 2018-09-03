$(document).ready(function(){
    console.log('11111 openper');
    var permit = JSON.parse($('#reviewers_array').val());
    var user_obj = JSON.parse($('#user_obj').val()); 
    var tempar = permit.reviewers.filter(function( obj ) {
        return obj.email !== user_obj.email;
    }); 
    //console.log(tempar[0].email);  
    var num = parseInt(permit.reviewers.findIndex(x => x.email==user_obj.email));
    var num_not_logged = parseInt(permit.reviewers.findIndex(x => x.email==tempar[0].email));
    var ind, ind_not_logged;
    if(user_obj.authorization_level==='Facility Owner'){
        ind = 0;
        ind_not_logged = 1;
    }else{
        ind = 1;
        ind_not_logged = 0;
    }
    console.log('ind: '+ind);
    console.log(num);
    console.log(num_not_logged);
    var table_id = '#approval_signatures';
    if(permit.reviewers[num].reviewed==='no'){
        $(table_id).find(".reviewer_name").eq(ind).html('Autofilled');
        $(table_id).find(".reviewer_signature").eq(ind).append('<div class="form-group"><input class="form-control" type="text" placeholeder="NK"/></div>')
                    .append('<div class="form-group"><input class="form-control" type="password" placeholeder="Key"/></div>')
                    .append('<div class="form-group"><input class="btn btn-default" type="button" value="sign" onclick="signas(event)"/></div>');
        $(table_id).find(".reviewer_approved_date").eq(ind).html('Autofilled');
    }else{
        $(table_id).find(".reviewer_name").eq(ind).html(permit.reviewers[num].name);
        $(table_id).find(".reviewer_approved_date").eq(ind).html(permit.reviewers[num].approved_time);
        if(permit.reviewers[num].approved === 'yes'){
            $(table_id).find(".reviewer_signature").eq(ind).html('<img src="'+permit.reviewers[num].signature+'"/>');
        }else{
            $(table_id).find(".reviewer_signature").eq(ind).html('Rejected');
        }
    }

    $(table_id).find(".reviewer_name").eq(ind_not_logged).html(permit.reviewers[num_not_logged].name);
    $(table_id).find(".reviewer_approved_date").eq(ind_not_logged).html(permit.reviewers[num_not_logged].approved_time);
    if(permit.reviewers[num_not_logged].signature==='Rejected'){
        console.log('1');
        $(table_id).find(".reviewer_signature").eq(ind_not_logged).html(permit.reviewers[num_not_logged].signature);
    }else{
        console.log('2');
        $(table_id).find(".reviewer_signature").eq(ind_not_logged).html('<img src="'+permit.reviewers[num_not_logged].signature+'"/>');
    }


    $('#reject_but').hide();
    $('#cancel_but').hide();
    $('#comment_textarea').hide();

    $('.toggle_buts').click(function(){
        if($(this).attr('id')==='com_and_rej_but'){
            $('#approve_but').hide();
            $('#com_and_rej_but').hide();
            $('#reject_but').show();
            $('#cancel_but').show();
            $('#comment_textarea').show();
        }else{
            $('#reject_but').hide();
            $('#cancel_but').hide();
            $('#comment_textarea').hide();
            $('#approve_but').show();
            $('#com_and_rej_but').show();
            $('#comment_textarea').val('');            
        }
    });


    $('.send_but').click(function(){
        var o = {};
        if(document.querySelector('#comment_textarea').value){
            $(table_id).find(".reviewer_name").eq(ind).html(user_obj.firstName+' '+user_obj.lastName);
            $(table_id).find(".reviewer_signature").eq(ind).html('Rejected');
            $(table_id).find(".reviewer_approved_date").eq(ind).html(humanReadableTime());
            o.reviewer_signature = document.querySelectorAll('.reviewer_signature')[ind].innerHTML;
        }else{            
            o.reviewer_signature = document.querySelectorAll('.reviewer_signature')[ind].children[0].src;
        }
        o.id = document.getElementById('permit_id').value;
        o.reviewer_name = document.querySelectorAll('.reviewer_name')[ind].innerHTML;
        o.reviewer_approved_date = document.querySelectorAll('.reviewer_approved_date')[ind].innerHTML;
        o.reviewer_index = num;
        o.reviewer_rej_comment = document.querySelector('#comment_textarea').value; 
        console.log(o); 
            
        if(document.querySelectorAll('.reviewer_approved_date')[ind].innerHTML==='Autofilled'){
            alert('Please sign the document!');
        }else{
            console.log('post request will be sent');                        
            $.ajax({
                type: 'POST',
                url: '/save-reviewed-permit',
                data: o,
                success: function(data) {
                    console.log(data);
                    window.location.href = '/main';                
                }
            });
        }
    });

});