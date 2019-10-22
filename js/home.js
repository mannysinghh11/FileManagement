var config = new AWS.Config({
    accessKeyId: 'AKIAJESIFCN7Y2XRWZAQ', secretAccessKey: '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', region: 'us-east-1'
  });
AWS.config.update(config);

var cognitoIdentity = new AWS.CognitoIdentityServiceProvider();

$(document).ready(function(){
    getUserInfo();
    //getFileInfo();
});

function refreshToken(){
    var refreshParams = {
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: "46u7r0sfehe5s8lgpoht9stavj",
        AuthParameters: {
            "REFRESH_TOKEN": localStorage.RefreshToken
        }
    };

    cognitoIdentity.initiateAuth(refreshParams, function(err, data){
        if(err){
          console.log(err);
        }else{
          localStorage.setItem("AccessToken", data.AuthenticationResult.AccessToken);
          localStorage.setItem("IdToken", data.AuthenticationResult.IdToken);
          localStorage.setItem("RefreshToken", data.AuthenticationResult.RefreshToken);
        }
      });

      getUserInfo();
}

function getUserInfo(){
    var params = {
        AccessToken: localStorage.AccessToken
    };

    cognitoIdentity.getUser(params, function(err, data){
        if(err){
            console.log(err);
            refreshToken();
        }else{
            console.log(data);
            getFileInfo();
            if(data.UserAttributes[1].Value != "true"){
                document.getElementById("emailConfirmationText").innerHTML = "Our records show that you have not yet actived your email yet. Be sure to do this."
            }
            document.getElementById("fullName").innerHTML = "Welcome, " + data.UserAttributes[2].Value + " " + data.UserAttributes[3].Value;
            localStorage.setItem("userID", data.Username);
        }
    });
}

function getFileInfo(){
    //Accesses dynamoDB to access all of the uploaded files
    var dynamoDB = new AWS.DynamoDB();
    var scanParams = {
        TableName: "UploadedFiles",
        ExpressionAttributeValues:{
            ":a":{
                S: localStorage.userID
            }
        },
        FilterExpression: "userID = :a"
    };

    dynamoDB.scan(scanParams, function(err, data){
        if(err){
            console.log(err);
        }else{
            //console.log(data.Items);
            var allUrls = [];
            for(var i = 0; i < data.Items.length; i++){
                allUrls.push(data.Items[i].url.S);
            }
            var allTableParams = ["fileName", "uploadedBy", "uploadTime", "updateTime", "description"];
            loadTable("mainTable", allTableParams, data.Items, allUrls);
        }
    })
}

function loadTable(tableId, fields, data, urls) {
    var rows = '';
    rows = '<tr><th scope="col">Selected</th><th scope="col">File Name</th><th scope="col">Uploaded By</th><th scope="col">Upload Time</th><th scope="col">Update Time</th><th scope="col">Description</th></tr>';
    $.each(data, function(index, item) {
            var counter = index;
            var row = '<tr id = ' + index + '>';
            row += '<td scope = "row"><input type="radio" name="options" id="option' + index + '" autocomplete="off"></td>';
        $.each(fields, function(index, field) {
            if(field == "fileName"){
                row += '<td><a href="' + urls[counter] + '" target="_blank" download>' + item[field+''].S + '</a></td>';
            }else{
                row += '<td>' + item[field+''].S + '</td>';
            }
        });
        rows += row + '<tr>';
    });
    $('#' + tableId).html(rows);
}

function deleteFile(){
    var fileToDeleteText = document.getElementById($("input[name=options]:checked")[0].id.substring(6, 7)).innerText.trim().split(" ")[0].split("\t");

    //Deletes entry from database
    var dynamoDB = new AWS.DynamoDB();
    var deleteParams = {
        TableName: "UploadedFiles",
        Key:{
            "fileName":{
                S: fileToDeleteText[0]
            }, "userID" : {
                S: localStorage.userID
            }
        }
    };
/*
    dynamoDB.deleteItem(deleteParams, function(err, data){
        if(err){
            console.log(err);
        }else{
            console.log(data);
            //document.location.reload(true);
        }
    })
    */

    //Deletes file from S3 storage
    var S3 = new AWS.S3();
    var deleteObjectParams = {
        Bucket: "www.uploadfileproject.com",
        Key: "userUploadedFiles/" + fileToDeleteText[0]
    };

    S3.deleteObject(deleteObjectParams, function(err, data){
        if(err){
            console.log(err.message)
        }else{
            console.log(data);
        }
    });
}

function uploadFile(){

}