var Crypt = new Crypt();

function signas(e){
    e.stopPropagation();
    var nk = e.target.parentNode.parentNode.children[0].children[0].value;
    var pass = e.target.parentNode.parentNode.children[1].children[0].value;
    var myurl = 'https://api.mlab.com/api/1/databases/gladkidskz/collections/users?q={"nk":'+'"'+nk.toString()+'"'+'}&apiKey=1q3b3TmQ1W1WIAwMvGTi6uqzE93m1OdO';
   
    $.ajax({
        type: 'GET',
        url: myurl,
        success: function(data) {
            console.log(data[0].key);
            var plaintext  = Crypt.AES.decrypt(data[0].key);  
            if(plaintext===pass){
                console.log('kol koilad');
                e.target.parentNode.parentNode.parentNode.children[1].innerHTML = data[0].firstName+' '+data[0].lastName;
                e.target.parentNode.parentNode.parentNode.children[3].innerHTML = humanReadableTime();
                //e.target.parentNode.parentNode.innerHTML = 'signed';
                e.target.parentNode.parentNode.innerHTML = '<img src="'+data[0].signature+'"/>';
            }else{
                console.log('kol koilmaid');
            }
        }
    });
}


function sign(e){
    console.log(e.target.className);
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
                var rowCount = $('#awltablebody tr').length-1;
                //e.target.parentNode.parentNode.parentNode.nextSibling.innerHTML = data[0].name+' signed'; 
                if(e.target.className.indexOf('authorized_worker_list')>-1){
                    e.target.parentNode.parentNode.parentNode.nextSibling.innerHTML = '<img src="'+data[0].signature+'"/>';
                    e.target.parentNode.parentNode.parentNode.innerHTML = data[0].firstName+data[0].lastName;  
                }else{
                    e.target.parentNode.parentNode.parentNode.nextSibling.innerHTML = '<img src="'+data[0].signature+'"/><input type="hidden" name="aw_list['+rowCount+'][aw_sign]" value="'+data[0].signature+'"/>';
                    e.target.parentNode.parentNode.parentNode.innerHTML = '<input type="text" class="form-control" name="aw_list['+rowCount+'][aw_name]" value="'+data[0].firstName+' '+data[0].lastName+'" readonly/>';
                }
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

function addAwlField(val){
    console.log(val);
    
    $('#'+val).append('<tr></tr>');
    $('#'+val+' tr:last').append('<td></td>').append('<td></td>');
    $('#'+val+' tr:last td:first').append('<div class="row"><div class="col"></div><div class="col"></div><div class="col"></div></div>');
    $('#'+val+' tr:last td:first > .row > .col:first').append('<input class="form-control" type="text" placeholder="Enter your NK"/>')
    $('#'+val+' tr:last td:first > .row > .col:eq(1)').append('<input class="form-control" type="password" placeholder="Enter your key"/>')
    if(val==='authorized_worker_list'){
        $('#'+val+' tr:last td:first > .row > .col:last').append('<input class="btn btn-default authorized_worker_list" type="button" value="sign" onclick="sign(event)"/>');
    }else{
        $('#'+val+' tr:last td:first > .row > .col:last').append('<input class="btn btn-default awltablebody" type="button" value="sign" onclick="sign(event)"/>');
    }
}