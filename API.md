# Cloud to Client-Server
### (All interaction occurs via HTTPS requests)
- /login(POST):
  - send: username, password
  - receive: login status (success or failure)
- /register(POST):
  - send: email, username, password, public-key
  - receive: registration status (success or failure with appropriate reason)
- /user(POST):
  - send: username (partial name starting from beginning)
  - receive: potentially empty list of user objects that each have username and publicKey
- /logout(GET):
  - receive: message indicating success or failure to logout
- /sendMessages(POST):
  - send: receiver, prime, subject, content
  - receive: sending status (success or failure reason)

# Client-Server to UI
- /logIn(POST):
  - send: username, password
- /addNewUser(POST):
  - send: username, email, password
