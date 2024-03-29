# SecureEmailing
Application for sending encrypted emails

Server is live at 107.170.176.250

## Running Instructions
*Updated* - run `docker run -p 80:5000 collinjackson93/ironmail`, then skip to last step
 - `cd` into `client` subdirectory
 - run `docker build -t client .`
 - run `docker run -p 80:5000 client`
 - navigate to `http://[docker IP]` in your web browser (you can get your docker IP by running `docker-machine ip default`; it is usually `192.168.99.100`)

## Beta Release
 1. As a naive user, I want to use the service without understanding private key encryption.
  - user can send and receive encrypted emails without manually encrypting and decrypting
  - key pairs are automatically generated and handled for the user
 1. As a trusting user, I want the service to be able to perform key exchange.
  - user can send a message without manually looking up/entering recipient public key
 1. As a busy user, I want the encryption and decryption process to work quickly.
  - sending and opening an encrypted email take less than one second
 1. As an organized user, I want to delete old emails.
  - button for deleting an email
  - after deleting an email, refreshing the inbox confirms it is gone
  

## Development Guidelines
- Code in the master branch must be functional and pass all tests. If a feature can be finished in a commit or two, it can be added directly to the master branch. Otherwise, create a new branch to develop the feature in.
- If you develop a feature, make sure there is ample test coverage for it before moving onto a new feature. Ideally, tests would be created prior to merging into master, but it is not a necessity.
- Use good naming conventions and break complex functions down into smaller functions that are easier to test.

## Weekly Meeting Time
Tuesdays, 11:45 AM
