FROM docker.io/node:16.13.1-buster-slim

# install server
RUN npm install -g serve
# update npm
RUN npm install -g npm

COPY . /app

WORKDIR /app

RUN npm ci

# compile and start app 
# NOTE: npm run build at start time allows us to change environment variables
CMD ["sh","-c","npm run build && serve -s -l 5000 build"]
