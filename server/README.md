# Getting Started

* Install `docker-compose`
* Run `docker-compose build`
* Then run `docker-compose up` (you can pass the `-d` flag to run it in the background)
* Navigate to `[docker IP]` (you can get your docker IP by running `docker-machine ip default`)
* Every time there is a code change, you must run `docker-compose build` to rebuild the image and make the changes appear

# Testing

* Navigate to the test subdirectory and run `docker-compose build`
* Then run `docker-compose up`
* The tests should run automatically and the results will be displayed in the console
* `ctrl-c` to kill the Docker containers that are still alive
