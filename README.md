# SecureEmailing
Application for sending encrypted emails

Server is live at 107.170.176.250

## Running Instructions
 - `cd` into `client` subdirectory
 - run `docker build -t client .`
 - run `docker run -p 80:5000 client`
 - navigate to `http://[docker IP]` in your web browser (you can get your docker IP by running `docker-machine ip default`; it is usually `192.168.99.100`)

## Development Guidelines
- Code in the master branch must be functional and pass all tests. If a feature can be finished in a commit or two, it can be added directly to the master branch. Otherwise, create a new branch to develop the feature in.
- If you develop a feature, make sure there is ample test coverage for it before moving onto a new feature. Ideally, tests would be created prior to merging into master, but it is not a necessity.
- Use good naming conventions and break complex functions down into smaller functions that are easier to test.

## Weekly Meeting Time
Tuesdays, 11:45 AM
