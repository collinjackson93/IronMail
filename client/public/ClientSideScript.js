/**
 * Created by Lawrence on 11/6/15.
 */
var areWeSignedUp = false;
var areWeLoggedIn = false;
var num = 1;
var whoIsLoggedInID = undefined;
var bcc = false;
var publicKey = "";
var privateKey = "";
var inEmailReadingMode = true;
var isAnEmailActuallyOpen = false;

var haveAlreadyPulled = false;


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
    if(password!==passwordconfirm) {
        d3.select("#signupPASSWORD").property("value", function () {
            return "";
        });
        d3.select("#signupPASSWORDCONFIRM").property("value", function () {
            return "";
        });
        alert('passwords do not match');
        return;
    }
    else if((password === "")||(passwordconfirm=== "")){
        alert('passwords do not match');
    }
    else{

        $.ajax({
            url: '/addNewUser',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({username: userid, password: password}),
            complete: function (req, status) {
                console.log(req);

                if(req.responseText == "true"){
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
                else if(req.responseText === "register failed"){
                    alert('Eh...try a different username.');
                    document.getElementById('signupFirstName').value = "";
                    document.getElementById('signupLastName').value = "";
                    document.getElementById('signupUSERID').value = "";
                    document.getElementById('signupEMAIL').value = "";
                    document.getElementById('signupPASSWORD').value = "";
                    document.getElementById('signupPASSWORDCONFIRM').value = "";

                }
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

        d3.select('#righttab').append('p').text('Tutorial: IronMail in under 2 minutes')
            .style("font-family", "Copperplate Gothic Light")
            .style('font-size', '20px').style('color', 'black');
        d3.select('#righttab').append('iframe')
            .attr('height', '300vh').attr('width', '100%').attr('src', 'https://www.youtube.com/embed/nEdnOT3lulE')
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

    var receiveButton = menubar.append('button');

    receiveButton.text('Check Email').style('display', 'inline').
    style('height', '100%').style('width', '20%').style('background-color', 'green')
        .on({"click":function() {
                pullInbox();
        }});

    receiveButton.on({"mouseover":function(){
        receiveButton.style('background-color', 'rgb(0,170,0)')
    }});

    receiveButton.on({"mouseout":function(){
        receiveButton.style('background-color', 'green')
    }});

    var encryptAndSendButton = menubar.append('button');

    encryptAndSendButton.text('Compose').style('display', 'inline')
        .style('height', '100%').style('width', '20%').attr('id', 'encryptAndSendButton');

    var discardButton = menubar.append('button');
    discardButton.text('Discard').style('display', 'inline')
        .style('height', '100%').style('width', '20%');
    discardButton.attr('disabled', 'disabled');
    discardButton.attr('id', 'discardButton');

    var forwardButton = menubar.append('button');

    forwardButton.text('Reply').style('display', 'inline')
        .style('height', '100%').style('width', '20%').on({"click":function(){

        }});
    forwardButton.attr('disabled', 'disabled');
    forwardButton.attr('id', 'reply');
    forwardButton.on({"click": function(){
        var params = {
            replysend: d3.select('#to').property("value").toString().substring(6),
            replysubj: d3.select('#subject').property("value").toString().substring(9),
            replyemail: d3.select('#emailArea').property("value").toString()
        };
        enterComposeMode(true, params);
    }});

    var bccButton = menubar.append('button');
    bccButton.text('Add CC').style('display', 'inline')
        .style('height', '100%').style('width', '20%').attr('id', 'bccButton');
    bccButton.attr('disabled', 'disabled');

    var inputsBar = righttab.append('div').
        style("background-color", "blue").
        style("padding", "10px").
        style("height", "10vh").
        style("width", "100%").
        style("box-sizing", "border-box").
        attr('id', 'inputDIV');

    inputsBar.append('input').attr('id', 'to').attr('disabled', 'disabled').style('width', '100%').style('box-sizing', 'border-box');
    inputsBar.append('br');
    inputsBar.append('input').attr('id', 'subject').attr('disabled', 'disabled')
        .style('width', '100%').style('box-sizing', 'border-box');
    inputsBar.append('br');

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

    var emailarea = righttab.append('textarea');

        emailarea.style("padding", "10px").
        style("height", "50vh").
        style("width", "100%").
        style("box-sizing", "border-box").
        attr('id', 'emailArea').
        attr('disabled', 'disabled');

    discardButton.on({"click": function(){
        if(!inEmailReadingMode) {
            alert('Draft Discarded.');
            enterComposeMode(false);
        }
    }});

    encryptAndSendButton.on({"click": function(){
        if(inEmailReadingMode){
            enterComposeMode(true);
            return;
        }

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

        enterComposeMode(false);
        alert('Message Sent!');

    }});

    //when the above elements are finished loading, check inbox!
    $(document).ready(function(){
        pullInbox();
    });
}

function enterComposeMode(bool, replyParams){
    if(bool){
        isAnEmailActuallyOpen = false;

        document.getElementById('reply').disabled = true;
        document.getElementById('discardButton').disabled = false;
        document.getElementById('bccButton').disabled = false;

        d3.select('#to').property("value", function () {
            return "";
        });
        d3.select('#subject').property("value", function () {
            return "";
        });
        d3.select('#emailArea').property("value", function () {
            return "";
        });

        if(replyParams!==undefined){
            d3.select('#to').property("value", function () {
                return replyParams.replysend;
            });
            d3.select('#subject').property("value", function () {
                return "RE: " + replyParams.replysubj;
            });
            d3.select('#emailArea').property("value", function () {
                return "\n------------ORIGINAL MESSAGE------------\n"
                    + "FROM: " + replyParams.replysend + "\n" +
                    "SUBJECT: " + replyParams.replysubj + "\n"
                    + replyParams.replyemail + "\n------------END ORIGINAL MESSAGE------------\n";
            });
        }

        d3.select('#to').attr('placeholder', 'TO: ');
        d3.select('#subject').attr('placeholder', 'SUBJECT: ');

        document.getElementById('to').disabled = false;
        document.getElementById('subject').disabled = false;
        document.getElementById('emailArea').disabled = false;
        d3.select('#encryptAndSendButton').text('Encrypt and Send');
        inEmailReadingMode = false;
    }
    else{

        document.getElementById('discardButton').disabled = true;


        d3.select('#to').property("value", function () {
            return "";
        });
        d3.select('#subject').property("value", function () {
            return "";
        });
        d3.select('#emailArea').property("value", function () {
            return "";
        });

        d3.select('#to').attr('placeholder', '');
        d3.select('#subject').attr('placeholder', '');

        document.getElementById('to').disabled = true;
        document.getElementById('subject').disabled = true;
        document.getElementById('emailArea').disabled = true;

        d3.select('#encryptAndSendButton').text('Compose');

        if(document.getElementById('bccButton').innerHTML === "Hide CC") {
            $('#bccButton').click();
        }
        document.getElementById('bccButton').disabled = true;
        inEmailReadingMode = true;
    }
}

function inboxCheck(sender, subject, id, timestamp){
    var square = d3.select(".signup").insert("svg", ":first-child").attr("width", '100%').attr("height", '50px');

    square.append("rect").attr("x", 0).attr("y", 0).attr("width", '100%').attr('height', '50px').style("fill", "#B19CD9");
    square.append('text').attr('x', 0).attr('y', 25).attr('font-family', 'Copperplate Light Gothic').
        attr('font-size', '10pt').attr('fill', 'blue').text(num);

    square.append('rect').attr('x', 400).attr('y', 5).attr('width', '10px').attr('height', '40px').style('fill', 'goldenrod');

    var deleter = square.append('rect');

    deleter.attr('x', 430).attr('y', 5).attr('width', '70px').attr('height', '40px').style('fill', 'red');
    deleter.attr('emailID', id);

    deleter.on({"click": function(){
            console.log("delete");
            var myID = d3.select(this).attr('emailID');
            console.log(myID);
            deleteMessage(myID);
            d3.select('#to').property("value", function () {
                return "";
            });
            d3.select('#subject').property("value", function () {
                return "";
            });
            d3.select('#emailArea').property("value", function () {
                return "";

            });
        }});

    var open = square.append('rect');

    open.attr('x', 355).attr('y', 5).attr('width', '70px').attr('height', '40px')
        .style('fill', 'lightblue');

    open.attr('emailID', id);

    open.on({"click": function(){

            isAnEmailActuallyOpen = true;
            document.getElementById('reply').disabled = false;
            inEmailReadingMode = true;
            d3.select('#to').property("value", function () {
                return "";
            });
            d3.select('#subject').property("value", function () {
                return "";
            });
            d3.select('#emailArea').property("value", function () {
                return "";
            });

            d3.select('#to').attr('placeholder', '');
            d3.select('#subject').attr('placeholder', '');

            document.getElementById('to').disabled = true;
            document.getElementById('subject').disabled = true;
            document.getElementById('emailArea').disabled = true;

            console.log("open");
            var myID = d3.select(this).attr('emailID');
            d3.select('#to').property("value", function () {
                return "FROM: " + sender;
            });
            d3.select('#subject').property("value", function () {
                return "SUBJECT: " + subject;
            });
            openMessage(id);

        }});


    square.append('text').attr('x', 440).attr('y', 30).attr('font-family', 'Copperplate Light Gothic')
        .attr('font-size', '10pt').attr('fill', 'black').text("DELETE")
        .on({"click": function(){
            console.log("delete");
        }});

    var mine = square.append('text').attr('x', 370).attr('y', 30).attr('font-family', 'Copperplate Light Gothic')
        .attr('font-size', '10pt').attr('fill', 'black').text("OPEN");

    square.append('text').attr('x', 20).attr('y', 15).attr('font-family', 'Copperplate Light Gothic')
        .attr('font-size', '10pt').attr('fill', 'black').text("FROM: " + sender)
        .on({"click": function(){
            console.log("delete");
        }});

    square.append('text').attr('x', 20).attr('y', 30).attr('font-family', 'Copperplate Light Gothic')
        .attr('font-size', '10pt').attr('fill', 'black').text("SUBJECT: " + subject)
        .on({"click": function(){
            console.log("delete");
        }});

    square.append('text').attr('x', 20).attr('y', 45).attr('font-family', 'Copperplate Light Gothic').
        attr('font-size', '10pt').attr('fill', 'blue').text("SENT on: " +
                                                                timestamp.toString().substring(0,10) + " at " +
                                                                    timestamp.toString().substring(11));

    d3.select('.signup').append('br');
    num++;
}


function pullInbox(){
    getPageWithCallback("/getMessages", function(retval){

        if(haveAlreadyPulled){
            console.log('clear old svgs');
            d3.selectAll('svg').remove();
        }
        num = 1;

        var retjson = JSON.parse(retval);

        for(var data in retjson){
            inboxCheck(retjson[data].sender, retjson[data].subject, retjson[data]._id, retjson[data].timestamp);
        }

        haveAlreadyPulled = true;
    });
}

function openMessage(id){
    $.ajax({
        url: '/openMessage',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({_id: id}),

        complete: function (req, status) {
            var resp = req['responseText'];
            console.log(resp);
            d3.select('#emailArea').property("value", function () {
                inEmailReadingMode = true;
                d3.select('#encryptAndSendButton').text('Compose');

                d3.select('bccButton').text('');
                d3.select('#bccButton').attr('disabled', 'disabled');
                return (resp + "\n\n" + "Message decrypted at: " + new Date());
            });
        }});
}

function deleteMessage(id){
    $.ajax({
        url: '/deleteMessage',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({_id: id}),

        complete: function (req, status) {
            return;
        }});
    pullInbox();
}