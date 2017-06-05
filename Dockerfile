FROM node:4.7.0
MAINTAINER Sandro Montanari <shiftux@gmail.com>

ADD . /opt/app

WORKDIR /opt/app/

RUN npm init -y
RUN npm install \
  && npm cache clear \
RUN npm uninstall fibers && \
  npm install fibers
RUN npm uninstall underscore && \
  npm install underscore
RUN npm uninstall source-map-support && \
  npm install source-map-support
RUN npm uninstall semver && \
  npm install semver
RUN npm install --save bcrypt

CMD ["node", "main.js"]