FROM node:15

# install app dependencies
RUN npm install -g serve

COPY build app

# start app
CMD ["serve", "-s", "app"]