# Getting Started

* ## Using Docker
  * `docker run --name some-mongo -d mongo` or `docker restart -d some-mongo`
  * `docker build -t ironmailserver .`
  * `docker run -d -p 8080:3000 --link some-mongo:mongo ironmailserver`
