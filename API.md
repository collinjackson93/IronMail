# Cloud to Client-Server
### (All interaction occurs via HTTPS requests)
- /login(POST):
  - send: username, password
  - receive: login status (success or failure)
- /register(POST):
  - send: email, username, password, public key
  - receive: registration status (success or failure with appropriate reason)

# Client-Server to UI
