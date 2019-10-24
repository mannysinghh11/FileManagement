function registerUser(){
    //First grab all of the information from each of the fields
    var email = document.getElementById("emailInput").value;
    var firstName = document.getElementById("firstNameInput").value;
    var lastName = document.getElementById("lastNameInput").value;
    var password = document.getElementById("passwordInput").value;
    var confirmPassword = document.getElementById("confirmPasswordInput").value;

    var config = new AWS.Config({
        accessKeyId: 'AKIA2ZNGSL7Q56QUDD76', secretAccessKey: '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', region: 'us-east-1'
    });

    AWS.config.update(config);

    var cognitoIdentity = new AWS.CognitoIdentityServiceProvider();

    if(password != confirmPassword && password.length >= 6){
        document.getElementById("infoText").innerHTML = "Please ensure each field is filled out properly.";
        document.getElementById("infoText").className = "form-text alert-danger";
    }else{
        if(email != "" && firstName != "" && lastName != ""){
            var userInfo = {
                ClientId: "46u7r0sfehe5s8lgpoht9stavj",
                Username: email,
                Password: password,
                UserAttributes: [{
                    Name: 'given_name',
                    Value: firstName
                },{
                    Name: 'family_name',
                    Value: lastName
                },{
                    Name: "email",
                    Value: email
                }]
            }

            cognitoIdentity.signUp(userInfo, function(err, data){
                if(err){
                    console.log(err);
                    document.getElementById("infoText").innerHTML = err.message;
                    document.getElementById("infoText").className = "form-text alert-warning";
                }else{
                    console.log(data);
                    document.getElementById("infoText").innerHTML = "An Email confirmation will be sent to you.";
                    document.getElementById("infoText").className = "form-text alert-success";
                }
            });
        }else{
            document.getElementById("infoText").innerHTML = "Please ensure each field is filled out properly.";
            document.getElementById("infoText").className = "form-text alert-danger";
        }
    }
}