# Getting Started

* Install `docker-compose`
* Run `docker-compose build`
* Then run `docker-compose up` (you can pass the `-d` flag to run it in the background)
* Navigate to `[docker IP]:8080` (you can get your docker IP by running `docker-machine ip default`)
* Every time there is a code change, you must run `docker-compose build` to rebuild the image and make the changes appear
