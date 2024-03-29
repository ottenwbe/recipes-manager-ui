FROM docker.io/node:21-bullseye-slim

# install and update npm
RUN npm install -g npm

COPY . /app

WORKDIR /app

RUN npm ci

EXPOSE 5000

# compile and start app 
# NOTE: npm run build at start time allows us to change environment variables
CMD ["sh","-c","npm run build && npm start -- -p 5000"]
