if($('#switch_fading').attr('commit_status')=='no'){
  if($('#switch_0').attr('switch_status')=='0'){
    $('#bulb_logo').attr({'src': $('#bulb_logo').attr('bulb_on')});
  }
  else{
    $('#bulb_logo').attr({'src': $('#bulb_logo').attr('bulb_off')});
  }
      document.getElementById("switch_0").disabled = true; 
      $('#switch_fading').fadeTo("fast", 0.3);
      
      var switch_id = $('#switch_0').attr('switch_id')
      var username = $('#switch_0').attr('user_name')
      var refreshIntervalId = setInterval(httpReqIn, 2000)
    
      function httpReqIn(){
            req = $.ajax({
              url : '/update',
              type : 'POST',
              data : { username : username, switch_id : switch_id, switch_status :'no_need', req_state : 'recheck' }
          });
               
          req.done(function(data){  
           req_status = data.update_commit
            if(data.update_commit=='complete'){
              $('#switch_fading').fadeTo("fast",1);       
            document.getElementById("switch_0").disabled = false;  
            if(data.switch_status=='1'){
                $('#bulb_logo').attr({'src': $('#bulb_logo').attr('bulb_on')});
              }
              else{
                $('#bulb_logo').attr({'src': $('#bulb_logo').attr('bulb_off')});
              } 
            clearInterval(refreshIntervalId);
            }       
          });
        }
    
    }
  
  else{
     // $('#updateStatus2').text('Update not commit yet');
        if($('#switch_0').is(":checked")){
          $('#bulb_logo').attr({'src': $('#bulb_logo').attr('bulb_on')}); 
        }
        else{
          $('#bulb_logo').attr({'src': $('#bulb_logo').attr('bulb_off')});
        }
  }
    
    /////////////////////////////ON\OFF button action///////////////////////////////////////
    
    $('#switch_0').change(function() {
    
    if($(this).is(":checked")){
      var switch_req = '1'
      }  
      else {
        var switch_req = '0'
      }
      var switch_id = $(this).attr('switch_id')
      var username = $(this).attr('user_name')
      var  refreshIntervalId
      var  refreshIntervalId_fail
     
      document.getElementById("switch_0").disabled = true; 
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
            document.getElementById("switch_0").disabled = false;
             //document.getElementById('switch_0').click();
             $('#switch_fading').fadeTo("fast",1);       
              //$('#updateStatus4').text(data.update_commit); 
            if(data.switch_status=='1'){
                $('#bulb_logo').attr({'src': $('#bulb_logo').attr('bulb_on')});
              }
              else{
                $('#bulb_logo').attr({'src': $('#bulb_logo').attr('bulb_off')});
              }
            }      
            else if(req_status=='done'){
             // $('#updateStatus4').text('Requsest submitted . Please wait'); 
              refreshIntervalId = setInterval(httpReqWait, 1000)
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
            document.getElementById("switch_0").disabled = false;
             //document.getElementById('switch_0').click();
             $('#switch_fading').fadeTo("fast",1);       
              //$('#updateStatus4').text(data.update_commit); 
            if(data.switch_status=='1'){
                $('#bulb_logo').attr({'src': $('#bulb_logo').attr('bulb_on')});
              }
              else{
                $('#bulb_logo').attr({'src': $('#bulb_logo').attr('bulb_off')});
              }
             clearInterval(refreshIntervalId_fail);
            }      
            else if(req_status=='done'){
             // $('#updateStatus4').text('Requsest submitted . Please wait'); 
              clearInterval(refreshIntervalId_fail);
              refreshIntervalId = setInterval(httpReqWait, 1000)
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
              $('#updateStatus2').text('Commit Complete');
              $('#switch_fading').fadeTo("fast",1);       
            //$('#updateStatus4').text(data.update_commit);  
            document.getElementById("switch_0").disabled = false;
    
            if(data.switch_status=='1'){
                $('#bulb_logo').attr({'src': $('#bulb_logo').attr('bulb_on')});
              }
              else{
                $('#bulb_logo').attr({'src': $('#bulb_logo').attr('bulb_off')});
              }
              clearInterval(refreshIntervalId);
            }
       
          });
        } 
           
    });
  