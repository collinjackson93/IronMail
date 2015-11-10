/**
 * Created by Lawrence on 11/6/15.
 */

var server = require(null); //some abstraction of the server that makes client calls fairly uninvolved?

/* AJAX request function that requires response
   CITATION: GOT THIS FROM CODE I WROTE PREVIOUSLY FOR the ORACLEOFOMAHA assignment */
function getPageWithCallback(url, signingUpFlag, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {

        if (httpRequest.readyState == 4 && httpRequest.status == 200)
            callback(httpRequest.responseText);
    };

    httpRequest.open("GET", url, true);
    httpRequest.send(null);
}


function signUpForIronMail(name, id, passwd){

    getPageWithCallback('/addNewUser?name=' + name + '&id=' + id + '&passwd=' + passwd, true, function(response){
        if(!response){
            alert('that username is not available, try another');
        }
        else{
            console.log('success');
        }

    });
}


function logInIronMail(name, passwd) {

    // need to replace url param with proper input
    getPageWithCallback(url, false, function(response){
        if(!response) {
            // need to ensure this a synchronous call
            var correctEntry;
            verifyPassword(passwd, correctEntry, function(verification){
                //TODO: logic for verifying password with server goes here
                correctEntry = true;
            });
            if (correctEntry) {
                console.log('success');
            }
        }
        else{
            alert('username not found')
        }
    });

}



function sendEmail(){};

function encryptText(){};

function onEmailReceived(){};
