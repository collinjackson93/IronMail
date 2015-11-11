FROM ubuntu:14.04
RUN apt-get update && apt-get install -y \
    nodejs \
    npm
RUN ln -s /usr/bin/nodejs /usr/bin/node

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

WORKDIR /src
ADD . /src
EXPOSE 3000
CMD npm start
