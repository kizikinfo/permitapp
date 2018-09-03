$(document).ready(function(){
    var permit = JSON.parse($('#reviewers_array').val());
    var objt = {};
    var user_obj = JSON.parse($('#user_obj').val());
    console.log('11111 openper_for_generator');     
    //console.log(permit); 
    
    var posturl;

    if(permit.gen_per_status==='reviewed'){
        $('#sent_back_for_review').html('Close Permit');
        posturl = '/close-permit';
    }else{
        $('#sent_back_for_review').html('Send');
        posturl = '/response-for-review';
    }

    $('#reviewer1_comment').hide();
    $('#reviewer2_comment').hide();

    if(permit.reviewers[0].approved==='yes'){
        $('#reviewer1_name').attr('class', 'text-success').html(permit.reviewers[0].name+' approved permit.');
    }

    if(permit.reviewers[0].signature==='Rejected'){
        $('#reviewer1_comment').show();
        $('#reviewer1_name').attr('class', 'text-danger').html(permit.reviewers[0].name+' rejected permit.');
        $('#reviewer1_comment').val(permit.reviewers[0].comment);
    }

    if(permit.reviewers[1].approved==='yes'){
        $('#reviewer2_name').attr('class', 'text-success').html(permit.reviewers[1].name+' approved permit.');
    }

    if(permit.reviewers[1].signature==='Rejected'){
        $('#reviewer2_comment').show();
        $('#reviewer2_name').attr('class', 'text-danger').html(permit.reviewers[1].name+' rejected permit.');
        $('#reviewer2_comment').val(permit.reviewers[1].comment);
    }

    $('#type_of_work_select').val(permit.type_of_work);
    
    if(permit.gen_per_status==='reviewed'){
        $('#type_of_work_select').attr('disabled', 'disabled');
        $('#add_authorized_worker').hide();        
        $('#work_location').attr("readonly", true);
        $('#permission_requested').attr("readonly", true);
        $('#scope_of_work').attr("readonly", true);
        $('#equipment_used').attr("readonly", true);
        $('#equipment_isolation').attr("disabled", true);
        $('#depressure_drain').attr("disabled", true); 
        $('#lockout_tagout').attr("disabled", true);
        $('#electrical_disconnet').attr("disabled", true);
        $('#binds_tags').attr("disabled", true);
        $('#arrea_barricades').attr("disabled", true);
        $('#two_way_radio').attr("disabled", true);
        $('#scaffolding_checkbox').attr("disabled", true);
        $('#rigging_diagram').attr("disabled", true);
        $('#x_ray_work').attr("disabled", true);
        $('#mechanical_ventilation').attr("disabled", true);
        $('#other_checkbox').attr("disabled", true);
        $('#safety_protective').attr("readonly", true);
        $('#special_safety').attr("readonly", true);
        permit.gen_per_status = 'closed';
    }else{        
        $('#work_location').attr("readonly", false);
        $('#permission_requested').attr("readonly", false);
        $('#scope_of_work').attr("readonly", false);
        $('#equipment_used').attr("readonly", false);
        $('#equipment_isolation').attr("disabled", false);
        $('#depressure_drain').attr("disabled", false);
        $('#lockout_tagout').attr("disabled", false);
        $('#electrical_disconnet').attr("disabled", false);
        $('#binds_tags').attr("disabled", false);
        $('#arrea_barricades').attr("disabled", false);
        $('#two_way_radio').attr("disabled", false);
        $('#scaffolding_checkbox').attr("disabled", false);
        $('#rigging_diagram').attr("disabled", false);
        $('#x_ray_work').attr("disabled", false);
        $('#mechanical_ventilation').attr("disabled", false);
        $('#other_checkbox').attr("disabled", false);
        $('#safety_protective').attr("readonly", false);
        $('#special_safety').attr("readonly", false);
    }

    $('#sent_back_for_review').click(function(){    
        var auth_list = document.querySelector('#authorized_worker_list');
        var temp_ar = [];
        for(var i=0; i<auth_list.children.length; i++){
            var o = {};
            o.aw_name = auth_list.children[i].children[0].innerHTML;
            o.aw_sign = auth_list.children[i].children[1].children[0].src
            temp_ar.push(o);
        }
        permit.aw_list = temp_ar;      
        permit.w_loc = $('#work_location').val();
        permit.p_req = $('#permission_requested').val();
        permit.s_work = $('#scope_of_work').val();
        permit.e_used = $('#equipment_used').val();


        if($('#equipment_isolation').is(':checked')){
            console.log('1');
            permit.checkbox1 = $('#equipment_isolation').val();
        }else{
            console.log('2');
            permit.checkbox1 = '0';
        }
        if($('#depressure_drain').is(':checked')){
            permit.checkbox2 = $('#depressure_drain').val();
        }else{
            permit.checkbox2 = '0';
        }
        if($('#lockout_tagout').is(':checked')){
            permit.checkbox3 = $('#lockout_tagout').val();
        }else{
            permit.checkbox3 = '0';
        }
        if($('#electrical_disconnet').is(':checked')){
            permit.checkbox4 = $('#electrical_disconnet').val();
        }else{
            permit.checkbox4 = '0';
        }

        if($('#binds_tags').is(':checked')){
            permit.checkbox5 = $('#binds_tags').val();
        }else{
            permit.checkbox5 = '0';
        }
        if($('#arrea_barricades').is(':checked')){
            permit.checkbox6 = $('#arrea_barricades').val();
        }else{
            permit.checkbox6 = '0';
        }
        if($('#two_way_radio').is(':checked')){
            permit.checkbox7 = $('#two_way_radio').val();
        }else{
            permit.checkbox7 = '0';
        }
        if($('#scaffolding_checkbox').is(':checked')){
            permit.checkbox8 = $('#scaffolding_checkbox').val();
        }else{
            permit.checkbox8 = '0';
        }

        if($('#rigging_diagram').is(':checked')){
            permit.checkbox9 = $('#rigging_diagram').val();
        }else{
            permit.checkbox9 = '0';
        }
        if($('#x_ray_work').is(':checked')){
            permit.checkbox10 = $('#x_ray_work').val();
        }else{
            permit.checkbox10 = '0';
        }
        if($('#mechanical_ventilation').is(':checked')){
            permit.checkbox11 = $('#mechanical_ventilation').val();
        }else{
            permit.checkbox11 = '0';
        }
        if($('#other_checkbox').is(':checked')){
            permit.checkbox12 = $('#other_checkbox').val();
        }else{
            permit.checkbox12 = '0';
        }

        permit.p_equip = $('#safety_protective').val();
        permit.s_meas = $('#special_safety').val();

        console.log('post request will be sent');  
        console.log(permit); 

        $.ajax({
            type: 'POST',
            url: posturl,
            data: permit,
            success: function(data) {
                //console.log(data);
                if(permit.gen_per_status==='closed'){
                    window.location.href = '/success-close'; 
                }else{
                    window.location.href = '/success-submit'; 
                }               
            }
        });

    });

});