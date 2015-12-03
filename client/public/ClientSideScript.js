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

function signUp(userid, email, password, passwordconfirm){
    alert('hello');
    /* First check that passwords match */ 
    if(password.value!==passwordconfirm.value) {
        d3.select("#signupPASSWORD").property("value", function () {
            return "";
        });
        d3.select("#signupPASSWORDCONFIRM").property("value", function () {
            return "";
        });
        alert('password does not match');
        return;
    }
    else{
        whoIsLoggedInID = userid;
        wipeLoginScreens();
    }
}

function logIn(username, password){
    whoIsLoggedInID = username;
    console.log("logged in");
}

function logOut(){

}

function loadEmails(){

}

function wipeLoginScreens(){
    var lefttab = d3.select("#lefttab"); 
    var righttab = d3.select('#righttab'); 
    var corner = d3.select('#upperrightcorner');  

    //wipe the login screens, prepare to load emails 
    lefttab.selectAll('div').remove(); 
    lefttab.selectAll('quote').remove();
    lefttab.selectAll('input').remove();
    lefttab.selectAll('button').remove();

    lefttab.style("background-color", "green").style("overflow-y", "auto");

    righttab.selectAll('div').remove(); 
    righttab.style("background-color", "lightgreen");

    var menubar = righttab.append('div').
        style("background-color", "red").
        style("padding", "10px").
        style("height", "10vh").
        style("width", "100%").
        style("box-sizing", "border-box");

    menubar.append('button').text('Encrypt and Send').style('display', 'inline').style('height', '100%').style('width', '20%');
    menubar.append('button').text('Discard').style('display', 'inline').style('height', '100%').style('width', '20%');
    menubar.append('button').text('Forward').style('display', 'inline').style('height', '100%').style('width', '20%');
    menubar.append('button').text('Add BCC').style('display', 'inline').style('height', '100%').style('width', '20%');
    menubar.append('button').text('Send Unencrypted').style('display', 'inline').
        style('height', '100%').style('width', '20%').style('background-color', 'green');


    var emailarea = righttab.append('textarea').
        style("padding", "10px").
        style("height", "60vh").
        style("width", "100%").
        style("box-sizing", "border-box");

    var upperRightCornerText = d3.select("#upperrightcornertext").text("Hello, " + whoIsLoggedInID + ": Log out here!");
    corner.selectAll('input').remove();
    d3.select("#logInBUTTON").text("Log Out");
}