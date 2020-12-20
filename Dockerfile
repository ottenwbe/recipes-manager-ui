FROM node:13.12.0-alpine

# install app dependencies
RUN npm install serve

COPY build build

# start app
CMD ["serve", "-s", "build"]