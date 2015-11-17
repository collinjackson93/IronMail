/**
 * Created by Lawrence on 11/6/15.
 */
var areWeSignedUp = false;
var areWeLoggedIn = false;
var whoIsLoggedInID = "";

/* AJAX request function that requires response
   CITATION: GOT THIS FROM CODE I WROTE PREVIOUSLY FOR the ORACLEOFOMAHA assignment */
function getPageWithCallback(url, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200)
            callback(httpRequest.responseText);
    }

    httpRequest.open("GET", url, true);
    httpRequest.send(null);
}

//invokes sign up logic on server
function signUpForIronMail(firstname, lastname, id, passwd){
    getPageWithCallback('/addNewUser?firstname=' + firstname +
        '&lastname=' + lastname +
        '&id=' + id + 
        '&passwd=' + passwd, function(response){
        if(response = "invalid"){
            alert('that username is not available, try another');
        }
        else{
            console.log('successful sign up for user ' + response);
        }

    });
}

//invokes log in on server
function logInToIronMail(id, passwd){
    getPageWithCallback('/logIn?id=' + id + '&passwd=' + passwd, function(response){

        if(!response){
            alert('login was invalid');
        }
        else{
            console.log('successful login');
        }

    })
}

//invokes log out on server, then wipes html of sensitive data
function logOutOfIronMail(){
    getPageWithCallback('/logOut', function(response){
        whoIsLoggedInID = "";
        areWeLoggedIn = false;
        logOut();
    });
}

//wipes webpage
function logOut(){
    console.log('clear web page');
}

