# Cloud to Client-Server
### (All interaction occurs via HTTPS requests)
- /login(POST):
  - send: username, password
  - receive: login status (success or failure)
- /register(POST):
  - send: username, password, public-key
  - receive: registration status (success or failure with appropriate reason)
- /user(POST):
  - send: username (partial name starting from beginning)
  - receive: potentially empty list of user objects that each have username and publicKey
- /logout(GET):
  - receive: message indicating success or failure to logout
- /sendMessage(POST):
  - send: receiver, prime, subject, content
  - receive: sending status (success or failure reason)
- /getMessages(GET):
  - receive: list of message objects with \_id, sender, receiver, sharedPrime, subject, content(encrypted), timestamp

# Client-Server to UI
- / (GET):
  - receive: /IronMail.html  i.e. it res.sends the webpage
- /logIn(POST):
  - send: username, password
  - receive: login status (sucess or failure&why)
- /addNewUser(POST):
  - send: username, password
  - receive registration status (success or failure&why), logic should end up being similar to login unless we want a "welcome new user" page or something
- /getMessages(GET)
  - receive: list of message objects with \_id, sender, receiver, sharedPrime, subject, content (decrypted)
- /sendMessage(POST)
	- send: receiver, subject, content (body of the email)
- /logout(GET)
	- receive: message indicating success or failure
