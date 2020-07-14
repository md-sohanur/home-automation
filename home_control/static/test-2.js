
if(document.getElementById("switch_fading").getAttribute("commit_status")=='no'){
   // $('#updateStatus2').text('Update not commit yet');
    document.getElementById("myonoffswitch").disabled = true; 
    $('#switch_fading').fadeTo("fast", 0.3);
    var swapImage = $('#arrowRotate').attr('data-swap'),
          currentImage = $('#arrowRotate').attr('src');
          $('#arrowRotate').attr({
            'src': swapImage,
            'data-swap': currentImage
           });
    var switch_id = $('#myonoffswitch').attr('switch_id')
    var username = $('#myonoffswitch').attr('user_name')
    var refreshIntervalId = setInterval(httpReqIn, 500)
  
    function httpReqIn(){
          req = $.ajax({
            url : '/update',
            type : 'POST',
            data : { username : username, switch_id : switch_id, switch_status :'no_need', req_state : 'recheck' }
        });
             
        req.done(function(data){  
         req_status = data.update_commit
         //$('#updateStatus5').text(req_status);
          if(req_status=='complete'){
            //$('#updateStatus5').text('Commit Complete');
            $('#switch_fading').fadeTo("fast",1);       
          //$('#updateStatus4').text(data.update_commit);  
          document.getElementById("myonoffswitch").disabled = false;
  
          var swapImage = $('#arrowRotate').attr('data-swap'),
          currentImage = $('#arrowRotate').attr('src');
          $('#arrowRotate').attr({
            'src': swapImage,
            'data-swap': currentImage
           });
            clearInterval(refreshIntervalId);
          }
          else{
           // $('#updateStatus5').text('waiting to commit');
        }       
        });
      }
  
  }
  
  /////////////////////////////ON\OFF button action///////////////////////////////////////
  
  $('#myonoffswitch').change(function() {
  
  if($(this).is(":checked")){
    //clearInterval(refreshIntervalId);
   // $('#updateStatus2').text('checkbox- checked');
    var switch_req = '1'
    }
    
    else {
      //$('#updateStatus2').text('checkbox- unchecked');
      var switch_req = '0'
    }
    var switch_id = $(this).attr('switch_id')
    var username = $(this).attr('user_name')
    var  refreshIntervalId
    var  refreshIntervalId_fail
   
    document.getElementById("myonoffswitch").disabled = true; 
    $('#switch_fading').fadeTo("fast", 0.3); 
           
  
   // $('#updateStatus').text('username-'+username+' |switch_id-'+switch_id);             
   // $('#updateStatus3').text('switch_req-'+switch_req);
  
    req = $.ajax({
            url : '/update',
            type : 'POST',
            data : { username : username, switch_id : switch_id, switch_status : switch_req ,req_state : 'commit'}
        });
        req.done(function(data){   
         req_status = data.update_commit
        // $('#updateStatus5').text(req_status);
          if(req_status == 'already_done'){
          document.getElementById("myonoffswitch").disabled = false;
           //document.getElementById('myonoffswitch').click();
           $('#switch_fading').fadeTo("fast",1);       
            //$('#updateStatus4').text(data.update_commit); 
          var swapImage = $('#arrowRotate').attr('data-swap'),
          currentImage = $('#arrowRotate').attr('src');
          $('#arrowRotate').attr({
            'src': swapImage,
            'data-swap': currentImage
           });
          }      
          else if(req_status=='done'){
           // $('#updateStatus4').text('Requsest submitted . Please wait'); 
            refreshIntervalId = setInterval(httpReqWait, 500)
          }               
        });
  
  
        req.fail(function(data){       
         //$('#updateStatus4').text('Requsest failed . Retrying');  
            refreshIntervalId_fail = setInterval(httpRetry, 2000)              
        });
  
  
  
  
  function httpRetry(){
    req = $.ajax({
            url : '/update',
            type : 'POST',
            data : { username : username, switch_id : switch_id, switch_status : switch_req ,req_state : 'commit'}
        });
    req.done(function(data){   
         req_status = data.update_commit
         //$('#updateStatus5').text(req_status);
          if(req_status == 'already_done'){
          document.getElementById("myonoffswitch").disabled = false;
           //document.getElementById('myonoffswitch').click();
           $('#switch_fading').fadeTo("fast",1);       
            //$('#updateStatus4').text(data.update_commit); 
          var swapImage = $('#arrowRotate').attr('data-swap'),
          currentImage = $('#arrowRotate').attr('src');
          $('#arrowRotate').attr({
            'src': swapImage,
            'data-swap': currentImage
           });
           clearInterval(refreshIntervalId_fail);
          }      
          else if(req_status=='done'){
           // $('#updateStatus4').text('Requsest submitted . Please wait'); 
            clearInterval(refreshIntervalId_fail);
            refreshIntervalId = setInterval(httpReqWait, 500)
          }               
        });
  }
  
  function httpReqWait(){
          req = $.ajax({
            url : '/update',
            type : 'POST',
            data : { username : username, switch_id : switch_id, switch_status :'no_need', req_state : 'recheck' }
        });
                  
        req.done(function(data){  
         req_status = data.update_commit
         //$('#updateStatus5').text(req_status);
          if(req_status=='complete'){
            //$('#updateStatus5').text('Commit Complete');
            $('#switch_fading').fadeTo("fast",1);       
          //$('#updateStatus4').text(data.update_commit);  
          document.getElementById("myonoffswitch").disabled = false;
  
          var swapImage = $('#arrowRotate').attr('data-swap'),
          currentImage = $('#arrowRotate').attr('src');
          $('#arrowRotate').attr({
            'src': swapImage,
            'data-swap': currentImage
           });
            clearInterval(refreshIntervalId);
          }
          else{
            //$('#updateStatus5').text('waiting to commit');
        }       
        });
      } 
         
  });