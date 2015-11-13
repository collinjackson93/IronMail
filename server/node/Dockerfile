FROM ubuntu:14.04
RUN apt-get update && apt-get install -y \
    nodejs \
    npm
RUN ln -s /usr/bin/nodejs /usr/bin/node

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

ENV NODE_ENV production

WORKDIR /src
COPY . /src
EXPOSE 3000
CMD npm start
