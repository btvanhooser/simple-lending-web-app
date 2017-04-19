function mask(o, f) {
    setTimeout(function () {
        var v = f(o.value);
        if (v != o.value) {
            o.value = v;
        }
    }, 1);
}

function mssn(v) {
    var r = v.replace(/\D/g,"");
    r = r.replace(/^0/,"");
    if (r.length > 9) {
        r = r.replace(/^(\d\d\d)(\d{2})(\d{0,4}).*/,"$1-$2-$3");
		return r;
    }
    else if (r.length > 4) {
        r = r.replace(/^(\d\d\d)(\d{2})(\d{0,4}).*/,"$1-$2-$3");
    }
    else if (r.length > 2) {
        r = r.replace(/^(\d\d\d)(\d{0,3})/,"$1-$2");
    }
    else {
        r = r.replace(/^(\d*)/, "$1");
    }
    return r;
}

function mphone(v) {
    var r = v.replace(/\D/g,"");
    r = r.replace(/^0/,"");
    if (r.length > 10) {
        // 11+ digits. Format as 5+4.
        //r = r.replace(/^(\d\d\d)(\d{5})(\d{4}).*/,"($1) $2-$3");
		r = r.replace(/^(\d\d\d)(\d{3})(\d{0,4}).*/,"($1) $2-$3");
		return r;
    }
    else if (r.length > 5) {
        // 6..10 digits. Format as 4+4
        r = r.replace(/^(\d\d\d)(\d{3})(\d{0,4}).*/,"($1) $2-$3");
    }
    else if (r.length > 2) {
        // 3..5 digits. Add (0XX..)
        r = r.replace(/^(\d\d\d)(\d{0,3})/,"($1) $2");
    }
    else {
        // 0..2 digits. Just add (0XX
        r = r.replace(/^(\d*)/, "($1)");
    }
    return r;
}

$(document).ready(function(){
    $('#LenderWelcomePrompt').text(sessionStorage.getItem("lendername"));

    $('.branchEmployee').click(function() {
        if ($('#employeeID').is(':disabled')){
            $('#employeeID').prop('disabled',false);
            $('#employeeID').prop('required', true);
        }
        else{
            $('#employeeID').prop('disabled',true);
            $('#employeeID').prop('required', false);
            $('#employeeID').val("");
        }
    });
})

var settings = {
  "async": true,
  "crossDomain": true,
  "url": sessionStorage.getItem('uri') + "/application",
  "method": "POST",
  "headers": {
    "authorization": "JWT " + sessionStorage.getItem('access_token'),
    "content-type": "application/json"
  },
  "processData": false
}

function onSubmit(){
    var applicationToSubmit = {};
    applicationToSubmit.firstname = $('#firstName').val();
    applicationToSubmit.lastname = $('#lastName').val();
    applicationToSubmit.ssn = parseInt($('#ssn').val().replace(/-/g,''));
    applicationToSubmit.emailAddress = $('#email').val();
    applicationToSubmit.phoneNumber = $('#phone').val();
    applicationToSubmit.employer = $('#employer').val();
    applicationToSubmit.income = parseInt($('#income').val());
    applicationToSubmit.incomeFrequency = $('#incomeFreq').val();
    if ($('#isBranchEmployee').is(':checked')){
        applicationToSubmit.isBranchEmployee = "yes";
        applicationToSubmit.employeeID = parseInt($('#employeeID').val());
    }
    else {
        applicationToSubmit.isBranchEmployee = "no";
        applicationToSubmit.employeeID = 0;
    }
    applicationToSubmit.requestedAmount = parseInt($('#amount').val());
    applicationToSubmit.requestedTerm = parseInt($('#term').val());
    applicationToSubmit.lendercode = sessionStorage.getItem('lendercode');
    console.log(JSON.stringify(applicationToSubmit));
    settings.data = JSON.stringify(applicationToSubmit);
    $.ajax(settings).done(function (response) {
        location.href = "thankyou.html";
    });
}