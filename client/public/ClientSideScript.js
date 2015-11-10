/**
 * Created by Lawrence on 11/6/15.
 */

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
            var passwordIsCorrect = verifyPassword(passwd, function(verification){
                //TODO: logic for verifying password with server goes here
            });
            if (passwordIsCorrect) {
                console.log('success');
            }

        }
        else{
            alert('username not found')
        }
    });

}

