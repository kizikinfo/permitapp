
document.querySelector('#date_from').value = humanReadableTime();
document.querySelector('#date_to').value = oneWeekAhead();
var randomid = Math.floor(Math.random()*90000)+10000;
document.querySelector('#permit_id').innerHTML = ' ' + randomid;
document.querySelector('#gen_per_id').value = randomid;
document.querySelector('#gen_per_status').value = 'for_review';
var auth_people = document.querySelectorAll('.auth_per')

$(document).ready(function(){
    $('.gen_per_checkbox').change(function(){
        //alert($(this).attr('name'));
        if(this.checked){ 
            $(this).parent().find(':first-child').remove();
        }else{
            $(this).parent().prepend('<input type="hidden" value="0" name="'+$(this).name+'"/>');
        }
    })
});

$(document).ready(function(){
    $('#type_of_work').change(function(){
        //alert($(this).val());
        $.ajax({
            type: 'GET',
            url: 'https://api.mlab.com/api/1/databases/gladkidskz/collections/users?q={"field":'+'"'+$(this).val()+'"'+'}&apiKey=1q3b3TmQ1W1WIAwMvGTi6uqzE93m1OdO',
            success: function(data) {
                console.log(data);
                for(var i=0; i<data.length; i++){
                    auth_people[i].value = data[i].email
                }
            }
        });
    })
});

function signwrp(e){
    e.stopPropagation();
    var nk = e.target.parentNode.parentNode.children[0].children[0].value;
    var pass = e.target.parentNode.parentNode.children[1].children[0].value;
    var myurl = 'https://api.mlab.com/api/1/databases/gladkidskz/collections/users?q={"nk":'+'"'+nk.toString()+'"'+'}&apiKey=1q3b3TmQ1W1WIAwMvGTi6uqzE93m1OdO';
   
    $.ajax({
        type: 'GET',
        url: myurl,
        success: function(data) {
            var plaintext  = Crypt.AES.decrypt(data[0].key);  
            if(plaintext===pass){
                console.log('kol koilad');
                e.target.parentNode.parentNode.parentNode.nextSibling.children[1].value = humanReadableTime();
                e.target.parentNode.parentNode.className = 'row form-group';
                //e.target.parentNode.parentNode.innerHTML = '<input class="form-control" type="text" value="'+data[0].name+' signed'+'" disabled/>';
                e.target.parentNode.parentNode.innerHTML = '<img src="'+data[0].signature+'"/><input type="hidden" name="r_per_sign" value="'+data[0].signature+'"/>';

            }else{
                console.log('kol koilmaid');
            }
        }
    });
}




function humanReadableTime(){
    var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth()+1;
    var date1 = time.getDate();
    var hour = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    return  year + "-" + month+"-"+date1+" "+hour+":"+minutes;
}

function oneWeekAhead(){
    var time = new Date();
    time.setDate(time.getDate()+7);
    var year = time.getFullYear();
    var month = time.getMonth()+1;
    var date1 = time.getDate();
    var hour = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    return  year + "-" + month+"-"+date1+" "+hour+":"+minutes;
}





