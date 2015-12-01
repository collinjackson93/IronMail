/**
 * Created by Lawrence on 11/6/15.
 */
var areWeSignedUp = false;
var areWeLoggedIn = false;
var whoIsLoggedInID = "";
var d3 = require("d3");
var $ = require("jquery");
var publicKey = "";
var privateKey = "";

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
function signUpForIronMail(firstname, lastname, email, id, passwd, passwdconfirm){
    /* First check that passwords match */
    if(passwd.value!==passwdconfirm.value){
        d3.select("#signupPASSWORD").property("value", function(){
            return "";
        });
        d3.select("#signupPASSWORDCONFIRM").property("value", function(){
            return "";
        });
        alert('password does not match');
        return; //wipe fields and return if no match
    }

    var response = "valid";
    getPageWithCallback('/addNewUser?firstname=' + firstname +
        '&lastname=' + lastname +
        '&email=' + email +
        '&id=' + id +
        '&passwd=' + passwd, function(response){
        if(response === "!!!invalid!!!"){
            d3.select("#signupUSERID").property("value", function(){
                return "";
            });
            d3.select("#signupPASSWORD").property("value", function(){
                return "";
            });
            d3.select("#signupPASSWORDCONFIRM").property("value", function(){
                return "";
            });
            alert('that username is not available, try another');
        }
        else{
            var lefttab = d3.select("#lefttab");
            var righttab = d3.select('#righttab');
            var corner = d3.select('#upperrightcorner');

            //wipe the login screens, prepare to load emails
            lefttab.selectAll('div').remove();
            righttab.selectAll('div').remove();
            corner.selectAll('div').remove();

            var newdiv = corner.append('div').attr("class", "centered");
            newdiv.append('button').attr('text', "hello");
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

function publicPrivateKeypair(){
    getPageWithCallback('/publicPrivateKeyGen', function(response){
        publicKey = response["public"];
        privateKey =
            alert(publicKey);
        d3.select("#righttab").selectAll('div').remove();
        d3.select('#righttab').append('p').text(publicKey);
    });
}