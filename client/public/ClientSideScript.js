/**
 * Created by Lawrence on 11/6/15.
 */
var areWeSignedUp = false;
var areWeLoggedIn = false;
var num = 0;
var whoIsLoggedInID = undefined;
var bcc = false;
var publicKey = "";
var privateKey = "";

//get interface
function getPageWithCallback(url, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200)
            callback(httpRequest.responseText);
    }

    httpRequest.open("GET", url, true);
    httpRequest.send(null);
}

function signUp(firstname, lastname, userid, email, password, passwordconfirm){
    // First check that passwords match
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

        $.ajax({
            url: '/addNewUser',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({username: userid, password: password}),
            complete: function (req, status) {
                console.log(req);
                /*
                if(req.messageText === "signed up"){
                    alert('You are now signed up, ' + userid + "!");
                    whoIsLoggedInID = userid;

                    d3.select("#logInDiv").selectAll('button').remove();
                    d3.select('#logInDiv').selectAll('input').remove();
                    d3.select('#logInDiv').append('button').text("Log Out").on({"click": function(){
                        logOut();
                    }}).style('margin', '0 auto');

                    var upperRightCornerText = d3.select("#upperrightcornertext").text("Hello, " + whoIsLoggedInID + ": Log out here!");

                    wipeLoginScreens();
                }
                else{
                    alert('Eh...try a different username.');
                }*/
            }

        });
    }
}

function logIn(user, pass) {

    if ((user === "") || (pass === "")) {
        alert('You left a log in field blank. Try again.');
        return;
    }

    $.ajax({
        url: '/logIn',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({username: user, password: pass}),
        complete: function (req, status) {
            if (status === "success") {
                if (req.responseText === "login failed") {
                    alert('Invalid Credentials. Try again.');
                    return;
                }
                else {
                    whoIsLoggedInID = user; //log them in
                    console.log(whoIsLoggedInID);

                    var upperRightCornerText = d3.select("#upperrightcornertext").text("Hello, " + whoIsLoggedInID + ": Log out here!");
                    d3.select("#logInDiv").selectAll('button').remove();
                    d3.select('#logInDiv').selectAll('input').remove();
                    d3.select('#logInDiv').append('button').text("Log Out").on({
                        "click": function () {
                            logOut();
                        }
                    }).style('margin', '0 auto');

                    wipeLoginScreens();
                }
            }
            else {
                console.log("error");
            }
        }
    });
}

//only called if someone is already logged in...
function logOut(){
    whoIsLoggedInID = undefined; //log them out
    d3.select('#logInDiv').selectAll('button').remove();
    d3.select('#logInDiv').append('input').attr('id', 'logInUSERID').attr('class', 'inline')
        .attr('placeholder', 'User ID');
    d3.select('#logInDiv').append('input').attr('id', 'logInPASSWORD').attr('class', 'inline')
        .attr('placeholder', 'Password').attr('type', 'password');
    d3.select('#logInDiv').append('button').text('Log in').attr('id', 'logInBUTTON').attr('class', 'inline')
        .on({"click": function(){
        logIn(document.getElementById('logInUSERID').value,
            document.getElementById('logInPASSWORD').value);
    }});
    console.log("logging out");
    resetToLoginPage();
    getPageWithCallback("/logout", function(retval){console.log(retval);})
}

function loadEmails(){

}

function resetToLoginPage(){
    var lefttab = d3.select("#lefttab");
    var righttab = d3.select('#righttab');
    var corner = d3.select('#upperrightcorner');

    var upperRightCornerText = d3.select("#upperrightcornertext").text("Existing User? Welcome Home.");

    $('#righttab').contents().remove();
    $('#lefttab').contents().remove();


    lefttab.style("background-color", "rgba(0, 0, 0, 0.07)");
    righttab.style("background-color", "rgba(0, 0, 0, 0.07)");

    var lefttabdata = [
        '<br>',
        '<quote>',
        'Sign up...<br>',
        'and say hello to digital security<br>',
        '</quote>',
        '<input id="signupFirstName" type="text" placeholder="First Name" required>',
        '<input id="signupLastName" type="text" placeholder="Last Name" required><br>',
        '<input id="signupUSERID" type="text" placeholder="User ID" required><br>',
        '<input id="signupEMAIL" type="email" placeholder="Email" required><br>',
        '<input id="signupPASSWORD" type="password" placeholder="Password" required><br>',
        '<input id="signupPASSWORDCONFIRM" type="password" placeholder="Confirm Password" required><br>',
        '<button id="signUpNow" type="submit">Sign Up</button>'
        ];

        var templeft = '';
        for(var data in lefttabdata){
            templeft += lefttabdata[data];
        }
        $('#lefttab').append(templeft);

        d3.select('#righttab').append('p').text('Features').style("font-family", "Copperplate Gothic Light")
            .style('font-size', '20px').style('color', 'black');

        var myspan = d3.select('#righttab').append('span').attr('class', 'featuresList').append('ul');

        myspan.append('li').text('State of the Art public-private key encryption');
        myspan.append('li').text('Your emails are safe on our central server--not even we can read them!');
        myspan.append('li').text('Emails stay off your machine until you request them');
        myspan.append('li').text('Link your unencrypted email to IronMail to contact users outside the IronMail network');

        d3.select('#righttab').append('p').text('Tutorial: IronMail in 5 minutes')
            .style("font-family", "Copperplate Gothic Light")
            .style('font-size', '20px').style('color', 'black');
        d3.select('#righttab').append('iframe')
            .attr('height', '300vh').attr('width', '100%').attr('src', 'https://www.youtube.com/embed/EuJbsF0yLfw')
            .attr('frameborder', '0').attr('allowfullscreen', 'allowfullscreen');

        d3.select('#signUpNow').on({"click": function(){
            signUp(
            document.getElementById('signupFirstName').value,
            document.getElementById('signupLastName').value,
            document.getElementById('signupUSERID').value,
            document.getElementById('signupEMAIL').value,
            document.getElementById('signupPASSWORD').value,
            document.getElementById('signupPASSWORDCONFIRM').value
            )
        }});

    righttab.selectAll('div').remove();
    righttab.selectAll('input').remove();
    righttab.selectAll('button').remove();
    righttab.selectAll('textarea').remove();
}

function wipeLoginScreens(){
    var lefttab = d3.select("#lefttab"); 
    var righttab = d3.select('#righttab'); 
    var corner = d3.select('#upperrightcorner');  

    //wipe the login screens, prepare to load emails 
    $('#lefttab').contents().remove();


    lefttab.style("background-color", "green").style("overflow-y", "auto");

    righttab.selectAll('div').remove(); 
    righttab.style("background-color", "lightgreen");
    righttab.selectAll('span').remove();
    righttab.selectAll('p').remove();
    righttab.selectAll('iframe').remove();

    var menubar = righttab.append('div').
        style("background-color", "red").
        style("padding", "10px").
        style("height", "10vh").
        style("width", "100%").
        style("box-sizing", "border-box");

    var encryptAndSendButton = menubar.append('button').text('Encrypt and Send').style('display', 'inline')
        .style('height', '100%').style('width', '20%');

    var discardButton = menubar.append('button').text('Discard').style('display', 'inline')
        .style('height', '100%').style('width', '20%');

    var forwardButton = menubar.append('button').text('Pull').style('display', 'inline')
        .style('height', '100%').style('width', '20%').on({"click":function(){
            pullInbox();
        }});
    var bccButton = menubar.append('button').text('Add CC').style('display', 'inline')
        .style('height', '100%').style('width', '20%').attr('id', 'bccButton');
    var receiveButton = menubar.append('button').text('Check Email').style('display', 'inline').
        style('height', '100%').style('width', '20%').style('background-color', 'green');

    var inputsBar = righttab.append('div').
        style("background-color", "blue").
        style("padding", "10px").
        style("height", "10vh").
        style("width", "100%").
        style("box-sizing", "border-box").
        attr('id', 'inputDIV');

    inputsBar.append('input').attr('id', 'to').attr('placeholder', 'To:').style('width', '100%').style('box-sizing', 'border-box');
    inputsBar.append('br');
    inputsBar.append('input').attr('id', 'subject').attr('placeholder', 'Subject:')
        .style('width', '100%').style('box-sizing', 'border-box');
    inputsBar.append('br');

    receiveButton.on({"click": function(){
        inboxCheck();
    }});

    bccButton.on({"click": function(){
        if(bcc===false){
            console.log("CC changing to true, increase div");
            bcc = true;
            d3.select('#inputDIV').style('height', '15vh');
            d3.select('#emailArea').style('height', '45vh');
            d3.select('#bccButton').text("Hide CC");
            inputsBar.append('input').attr('id', 'bcc').attr('placeholder', 'CC: (NOT AVAILABLE with this version of IronMail)')
                .style('width', '100%').style('box-sizing', 'border-box').attr('disabled', 'disabled');
        }
        else{
            console.log("CC changing to false, decrease div");
            bcc = false;
            d3.select('#inputDIV').style('height', '10vh');
            d3.select('#emailArea').style('height', '50vh');
            d3.select('#bccButton').text("Add CC");
            d3.select('#bcc').remove();
        }
    }});

    var titleBar = righttab.append('div').
        style("background-color", "red").
        style("padding", "10px").
        style("height", "5vh").
        style("width", "100%").
        style("box-sizing", "border-box").
        attr('id', 'titleDiv');

    var emailarea = righttab.append('textarea').
        style("padding", "10px").
        style("height", "50vh").
        style("width", "100%").
        style("box-sizing", "border-box").
        attr('id', 'emailArea');

    discardButton.on({"click": function(){
        d3.select('#to').property("value", function () {
            return "";
        });
        d3.select('#subject').property("value", function () {
            return "";
        });
        d3.select('#emailArea').property("value", function () {
            return "";
        });
        alert('Draft Discarded.');
    }});

    encryptAndSendButton.on({"click": function(){

        if( document.getElementById('to').value === '' ){
            alert('Sorry, you must specify an adressee.');
            return;
        }

        $.ajax({
            url: '/sendMessage',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({receiver: document.getElementById('to').value,
                subject: document.getElementById('subject').value,
                content: document.getElementById('emailArea').value}),
            complete: function (req, status) {
                if(req.messageText === "email sent"){
                    console.log("message sent");
                }
                else{
                    console.log("failure");
                    console.log(req + " " + status);
                }

            }});

        d3.select('#to').property("value", function () {
            return "";
        });
        d3.select('#subject').property("value", function () {
            return "";
        });
        d3.select('#emailArea').property("value", function () {
            return "";
        });
        alert('Message Sent!');
    }});
}

function inboxCheck(){
    console.log('check inbox');

    var square = d3.select(".signup").insert("svg", ":first-child").attr("width", '100%').attr("height", '50px');

    square.append("rect").attr("x", 0).attr("y", 0).attr("width", '100%').attr('height', '50px').style("fill", "#B19CD9");
    square.append('text').attr('x', 0).attr('y', 25).attr('font-family', 'Copperplate Light Gothic').
        attr('font-size', '10pt').attr('fill', 'blue').text(num);

    square.append('rect').attr('x', 400).attr('y', 5).attr('width', '10px').attr('height', '40px').style('fill', 'goldenrod');
    square.append('rect').attr('x', 430).attr('y', 5).attr('width', '70px').attr('height', '40px').style('fill', 'red')
        .on({"click": function(){
            console.log("delete");
        }});

    square.append('rect').attr('x', 355).attr('y', 5).attr('width', '70px').attr('height', '40px').style('fill', 'lightblue')
        .on({"click": function(){
            console.log("open");
        }});

    square.append('text').attr('x', 440).attr('y', 30).attr('font-family', 'Copperplate Light Gothic')
        .attr('font-size', '10pt').attr('fill', 'black').text("DELETE")
        .on({"click": function(){
            console.log("delete");
        }});

    square.append('text').attr('x', 370).attr('y', 30).attr('font-family', 'Copperplate Light Gothic')
        .attr('font-size', '10pt').attr('fill', 'black').text("OPEN")
        .on({"click": function(){
            console.log("open");
        }});

    d3.select('.signup').append('br');
    num++;
}


function pullInbox(){
    getPageWithCallback("/getMessages", function(retval){

        console.log(retval);


    });
}