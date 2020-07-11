$(document).ready(function(){
    $('.btn').on('click',function(){        

        req = $.ajax({
            url : '/update'
        });
        req.done(function(data){
            //$('#infoChange').fadeOut(1000).fadeIn(1000);
            $('#infoChange').html(data);        
            //setTimeout(function() {
            //}, 1000)
            
        });        
    
    });
});
