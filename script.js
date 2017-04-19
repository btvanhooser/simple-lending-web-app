$(document).ready(function(){
  //dev mode
  var uri = "https://small-scale-lending-api-btvanhooser.c9users.io:8080";
  //prod mode
  //var uri = "https://simple-lending-api.herokuapp.com/";
  sessionStorage.setItem('uri', uri);
  var settingsForTempUsers = {
    "async": true,
    "crossDomain": true,
    "url": uri + "/CreateTempWebUser",
    "method": "GET"
  }
  
  var settingsForAuth = {
    "async": true,
    "crossDomain": true,
    "url": uri + "/auth",
    "method": "POST",
    "headers": {
      "content-type": "application/json"
    },
    "processData": false
  }
  
  var settingsForLenders = {
    "async": true,
    "crossDomain": true,
    "url": uri + "/lenders",
    "method": "GET"
  }
  
  $.ajax(settingsForTempUsers).done(function (response) {
    
    settingsForAuth.data = JSON.stringify(response);
    $.ajax(settingsForAuth).done(function (response) {
      
       sessionStorage.setItem('access_token', response.access_token);
       settingsForLenders.headers = {"Authorization":"JWT " + response.access_token};
       $.ajax(settingsForLenders).done(function (response) {
          $.each(response.Lenders, function(iteration,lender){
            if (lender.lendercode != "000") {
              var o = new Option(lender.name, lender.lendercode);
              $(o).html(lender.name);
              $("#lenderDropDown").append(o);
            }
          });
       });
    });
  });
});



function onSubmit(){
  var element = jQuery('#lenderDropDown option:selected');
  sessionStorage.setItem('lendercode',element.val());
  sessionStorage.setItem('lendername',element.text());
  location.href = 'submit.html';
}