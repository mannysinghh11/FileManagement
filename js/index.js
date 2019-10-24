function loginUser(){
  var config = new AWS.Config({
    accessKeyId: 'AKIA2ZNGSL7Q56QUDD76', secretAccessKey: '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', region: 'us-east-1'
});

    AWS.config.update(config);

    var username = document.getElementById("emailInput").value;
    var password = document.getElementById("passwordInput").value;

    var cognitoIdentity = new AWS.CognitoIdentityServiceProvider();
    var params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        "USERNAME" : username,
        "PASSWORD" : password
      },
      ClientId: "46u7r0sfehe5s8lgpoht9stavj"
    }

    cognitoIdentity.initiateAuth(params, function(err, data){
      if(err){
        console.log(err);
        document.getElementById("infoText").innerHTML = err.message;
        document.getElementById("infoText").className = "form-text alert-warning";
      }else{
        localStorage.setItem("AccessToken", data.AuthenticationResult.AccessToken);
        localStorage.setItem("IdToken", data.AuthenticationResult.IdToken);
        localStorage.setItem("RefreshToken", data.AuthenticationResult.RefreshToken);

        if(username == "manpreetdot11@gmail.com"){
          window.open("admin.html", "_self");
        }else{
          window.open("home.html", "_self");
        }
      }
    });
}